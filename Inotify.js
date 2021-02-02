"use strict;"
var use = require('bayrell').use;
/*!
 *  Bayrell Bundler
 *
 *  (c) Copyright 2020 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Bundler == 'undefined') Bayrell.Bundler = {};
const fs = use("Runtime.fs");
const Map = use("Runtime.Map");
const { Inotify } = require('inotify');
Bayrell.Bundler.Inotify = function(ctx, object_name)
{
	if (object_name == undefined) object_name = "";
	use("Runtime.Core.CoreObject").call(this, ctx, object_name);
	var __v0 = use("Runtime.Map");
	this.descriptors = new __v0(ctx);
	var __v1 = use("Runtime.Map");
	this.watchers = new __v1(ctx);
	var __v2 = use("Runtime.Map");
	this.onChangeFileTimeouts = new __v2(ctx);
};
Bayrell.Bundler.Inotify.prototype = Object.create(use("Runtime.Core.CoreObject").prototype);
Bayrell.Bundler.Inotify.prototype.constructor = Bayrell.Bundler.Inotify;
Object.assign(Bayrell.Bundler.Inotify.prototype,
{
	/**
	 * Create notify
	 */
	createNotify: async function(ctx)
	{
		if (this.inotify != null)
		{
			return Promise.resolve();
		}
		this.inotify = new Inotify();
		this.ctx = ctx;
	},
	/**
	 * Callback
	 */
	log: async function(s)
	{
		/*console.log(s);*/
	},
	/**
	 * Callback
	 */
	onNotify: async function(e)
	{
		var ctx = this.ctx;
		var mask = e.mask;
		var descriptor = e.watch;
		var type = mask & Inotify.IN_ISDIR ? 'dir' : 'file';
		var folder_path = this.descriptors.get(ctx, descriptor, "");
		var item_path = (e.name != undefined) ? fs.concat(ctx, folder_path, e.name) : folder_path;
		
		if ( (mask & Inotify.IN_DELETE) && type == 'dir' && item_path != '')
		{
			var item_descriptor = this.watchers.get(ctx, item_path, "");
			this.log("Remove folder [" + item_descriptor + "] " + item_path);
			this.log(e);
			this.log("");
			
			this.descriptors.remove(ctx, item_descriptor);
			this.watchers.remove(ctx, item_path);
		}
		else if (mask & Inotify.IN_IGNORED)
		{
			var item_descriptor = this.watchers.get(ctx, item_path, "");			
			if (item_descriptor != "")
			{
				this.log("Remove folder [" + item_descriptor + "] " + item_path);
				this.descriptors.remove(ctx, item_descriptor);
				this.watchers.remove(ctx, item_path);
			}
		}
		else if (mask & Inotify.IN_MOVED_FROM)
		{
			this.data = e;
			this.data.type = type;
		}
		else if
		(
			mask & Inotify.IN_MOVED_TO && type == 'dir' && 
			Object.keys(this.data).length > 0 && this.data.cookie === e.cookie
		)
		{
			var old_folder_path = this.descriptors.get(ctx, this.data.watch, "");
			var old_item_path = (this.data.name != undefined) ?
				fs.concat(ctx, old_folder_path, this.data.name) : old_folder_path
			;
			var old_item_descriptor = this.watchers.get(ctx, old_item_path, "");
			
			/* Move */
			this.descriptors.remove(ctx, old_item_descriptor);
			this.watchers.remove(ctx, old_item_path);
			this.watchers.set(ctx, item_path, old_item_descriptor);
			this.descriptors.set(ctx, old_item_descriptor, item_path);
			
			this.log("Move [" + old_item_descriptor + "] " + old_item_path + " to " + item_path);
			this.log("");
		}
		else if ( (mask & Inotify.IN_CREATE) && type == 'dir' && item_path != '')
		{
			this.log("Add folder " + item_path);
			this.log("");
			await this.addFolder(ctx, item_path);
		}
		else if ( (mask & Inotify.IN_MODIFY) && type == 'file')
		{
			if (this.onChangeFile != null)
			{
				var timer;
				
				timer = this.onChangeFileTimeouts.get(ctx, item_path, null);
				if (timer != null) clearTimeout(timer);
				this.onChangeFileTimeouts.remove(ctx, item_path);
				
				timer = setTimeout
				(
					async () => { await this.onChangeFile(ctx, this, item_path); },
					this.changeTimeout
				);
				this.onChangeFileTimeouts.set(ctx, item_path, timer);
			}
		}
		else
		{
			this.log("Event " + item_path);
			this.log(e);
			this.log("");
		}
	},
	/** 
	 * Add folder
	 */
	addFolder: async function(ctx, path)
	{
		if (this.watchers.has(ctx, path))
		{
			return Promise.resolve();
		}
		this.log("Watch folder " + path);
		var __v0 = use("Runtime.fs");
		var items = await __v0.readDir(ctx, path);
		for (var i = 0;i < items.count(ctx);i++)
		{
			var item_name = items.item(ctx, i);
			var __v1 = use("Runtime.fs");
			var item_path = __v1.concat(ctx, path, item_name);
			var __v2 = use("Runtime.fs");
			var is_dir = await __v2.isDir(ctx, item_path);
			if (is_dir)
			{
				await this.addFolder(ctx, item_path);
			}
		}
		var descriptor = this.inotify.addWatch({
			"path": path,
			"watch_for":
				Inotify.IN_MODIFY | Inotify.IN_CREATE | Inotify.IN_DELETE |
				Inotify.IN_MOVED_FROM | Inotify.IN_MOVED_TO,
			callback: this.onNotify.bind(this),
		});
		
		this.watchers.set(ctx, path, descriptor);
		this.descriptors.set(ctx, descriptor, path);
	},
	_init: function(ctx)
	{
		this.ctx = null;
		this.inotify = null;
		this.data = null;
		this.descriptors = null;
		this.watchers = null;
		this.onChangeFileTimeouts = null;
		this.onChangeFile = null;
		this.changeTimeout = 500;
		use("Runtime.Core.CoreObject").prototype._init.call(this,ctx);
	},
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.Inotify";
	},
});
Object.assign(Bayrell.Bundler.Inotify, use("Runtime.Core.CoreObject"));
Object.assign(Bayrell.Bundler.Inotify,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.Inotify";
	},
	getParentClassName: function()
	{
		return "Runtime.Core.CoreObject";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": "Bayrell.Bundler.Inotify",
			"annotations": Collection.from([
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		if ((f&2)==2)
		{
			a.push("ctx");
			a.push("inotify");
			a.push("data");
			a.push("descriptors");
			a.push("watchers");
			a.push("onChangeFileTimeouts");
			a.push("onChangeFile");
			a.push("changeTimeout");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		if (field_name == "ctx") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": field_name,
			"t": "var",
			"annotations": Collection.from([
			]),
		});
		if (field_name == "inotify") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": field_name,
			"t": "var",
			"annotations": Collection.from([
			]),
		});
		if (field_name == "data") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": field_name,
			"t": "var",
			"annotations": Collection.from([
			]),
		});
		if (field_name == "descriptors") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": field_name,
			"t": "Runtime.Map",
			"annotations": Collection.from([
			]),
		});
		if (field_name == "watchers") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": field_name,
			"t": "Runtime.Map",
			"annotations": Collection.from([
			]),
		});
		if (field_name == "onChangeFileTimeouts") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": field_name,
			"t": "var",
			"annotations": Collection.from([
			]),
		});
		if (field_name == "onChangeFile") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": field_name,
			"t": "var",
			"annotations": Collection.from([
			]),
		});
		if (field_name == "changeTimeout") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.Inotify",
			"name": field_name,
			"t": "int",
			"annotations": Collection.from([
			]),
		});
		return null;
	},
	getMethodsList: function(ctx,f)
	{
		if (f==undefined) f=0;
		var a = [];
		if ((f&4)==4) a=[
		];
		return use("Runtime.Collection").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Bayrell.Bundler.Inotify);
module.exports = Bayrell.Bundler.Inotify;