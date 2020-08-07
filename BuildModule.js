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
Bayrell.Bundler.BuildModule = function(ctx)
{
	use("Runtime.CoreStruct").apply(this, arguments);
};
Bayrell.Bundler.BuildModule.prototype = Object.create(use("Runtime.CoreStruct").prototype);
Bayrell.Bundler.BuildModule.prototype.constructor = Bayrell.Bundler.BuildModule;
Object.assign(Bayrell.Bundler.BuildModule.prototype,
{
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		this.module = null;
		this.module_path = "";
		this.files = null;
		this.stop = false;
		this.log_files = true;
		use("Runtime.CoreStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.BuildModule"))
		{
			this.module = o.module;
			this.module_path = o.module_path;
			this.files = o.files;
			this.stop = o.stop;
			this.log_files = o.log_files;
		}
		use("Runtime.CoreStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "module")this.module = v;
		else if (k == "module_path")this.module_path = v;
		else if (k == "files")this.files = v;
		else if (k == "stop")this.stop = v;
		else if (k == "log_files")this.log_files = v;
		else use("Runtime.CoreStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "module")return this.module;
		else if (k == "module_path")return this.module_path;
		else if (k == "files")return this.files;
		else if (k == "stop")return this.stop;
		else if (k == "log_files")return this.log_files;
		return use("Runtime.CoreStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.BuildModule";
	},
});
Object.assign(Bayrell.Bundler.BuildModule, use("Runtime.CoreStruct"));
Object.assign(Bayrell.Bundler.BuildModule,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.BuildModule";
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
			"class_name": "Bayrell.Bundler.BuildModule",
			"name": "Bayrell.Bundler.BuildModule",
			"annotations": Collection.from([
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		if ((f|3)==3)
		{
			a.push("module");
			a.push("module_path");
			a.push("files");
			a.push("stop");
			a.push("log_files");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		if (field_name == "module") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildModule",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "module_path") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildModule",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "files") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildModule",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "stop") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildModule",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "log_files") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildModule",
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
});use.add(Bayrell.Bundler.BuildModule);
module.exports = Bayrell.Bundler.BuildModule;