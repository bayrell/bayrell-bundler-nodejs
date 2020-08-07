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
Bayrell.Bundler.BundlerContainer = function(ctx)
{
	use("Runtime.CoreStruct").apply(this, arguments);
};
Bayrell.Bundler.BundlerContainer.prototype = Object.create(use("Runtime.CoreStruct").prototype);
Bayrell.Bundler.BundlerContainer.prototype.constructor = Bayrell.Bundler.BundlerContainer;
Object.assign(Bayrell.Bundler.BundlerContainer.prototype,
{
	_init: function(ctx)
	{
		var __v0 = use("Runtime.Dict");
		this.files = null;
		this.current_file = null;
		this.storage = new __v0(ctx);
		use("Runtime.CoreStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.BundlerContainer"))
		{
			this.files = o.files;
			this.current_file = o.current_file;
			this.storage = o.storage;
		}
		use("Runtime.CoreStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "files")this.files = v;
		else if (k == "current_file")this.current_file = v;
		else if (k == "storage")this.storage = v;
		else use("Runtime.CoreStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "files")return this.files;
		else if (k == "current_file")return this.current_file;
		else if (k == "storage")return this.storage;
		return use("Runtime.CoreStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.BundlerContainer";
	},
});
Object.assign(Bayrell.Bundler.BundlerContainer, use("Runtime.CoreStruct"));
Object.assign(Bayrell.Bundler.BundlerContainer,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.BundlerContainer";
	},
	getParentClassName: function()
	{
		return "Runtime.CoreStruct";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Bayrell.Bundler.BundlerContainer",
			"name": "Bayrell.Bundler.BundlerContainer",
			"annotations": Collection.from([
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		if ((f|2)==2)
		{
			a.push("files");
			a.push("current_file");
			a.push("storage");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		if (field_name == "files") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerContainer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "current_file") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerContainer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "storage") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerContainer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a = [
		];
		return use("Runtime.Collection").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Bayrell.Bundler.BundlerContainer);
module.exports = Bayrell.Bundler.BundlerContainer;