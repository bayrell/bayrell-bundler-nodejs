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
Bayrell.Bundler.BuildFile = function(ctx)
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
Bayrell.Bundler.BuildFile.prototype = Object.create(use("Runtime.BaseStruct").prototype);
Bayrell.Bundler.BuildFile.prototype.constructor = Bayrell.Bundler.BuildFile;
Object.assign(Bayrell.Bundler.BuildFile.prototype,
{
	/**
	 * Returns relative module path
	 */
	getBayPath: function(ctx)
	{
		if (this.module == null)
		{
			return "";
		}
		var module_path = this.module.getPath(ctx);
		var __v0 = use("Runtime.rs");
		var module_path_arr = __v0.explode(ctx, "/", module_path);
		var __v1 = use("Runtime.rs");
		var file_path_arr = __v1.explode(ctx, "/", this.file_path);
		var i = 0;
		while (i < module_path_arr.count(ctx) && i < file_path_arr.count(ctx) && Runtime.rtl.get(ctx, module_path_arr, i) == Runtime.rtl.get(ctx, file_path_arr, i))
		{
			i++;
		}
		if (i < file_path_arr.count(ctx) && Runtime.rtl.get(ctx, file_path_arr, i) == "bay")
		{
			var __v2 = use("Runtime.rs");
			return "/" + use("Runtime.rtl").toStr(__v2.join(ctx, "/", file_path_arr.slice(ctx, i + 1)));
		}
		return "";
	},
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		this.file_path = "";
		this.ext = "";
		this.module = null;
		this.languages = null;
		this.content = "";
		this.ast = null;
		this.stop = false;
		this.parse_error = null;
		this.log_files = true;
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.BuildFile"))
		{
			this.file_path = o.file_path;
			this.ext = o.ext;
			this.module = o.module;
			this.languages = o.languages;
			this.content = o.content;
			this.ast = o.ast;
			this.stop = o.stop;
			this.parse_error = o.parse_error;
			this.log_files = o.log_files;
		}
		use("Runtime.BaseStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "file_path")this.file_path = v;
		else if (k == "ext")this.ext = v;
		else if (k == "module")this.module = v;
		else if (k == "languages")this.languages = v;
		else if (k == "content")this.content = v;
		else if (k == "ast")this.ast = v;
		else if (k == "stop")this.stop = v;
		else if (k == "parse_error")this.parse_error = v;
		else if (k == "log_files")this.log_files = v;
		else use("Runtime.BaseStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "file_path")return this.file_path;
		else if (k == "ext")return this.ext;
		else if (k == "module")return this.module;
		else if (k == "languages")return this.languages;
		else if (k == "content")return this.content;
		else if (k == "ast")return this.ast;
		else if (k == "stop")return this.stop;
		else if (k == "parse_error")return this.parse_error;
		else if (k == "log_files")return this.log_files;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.BuildFile";
	},
});
Object.assign(Bayrell.Bundler.BuildFile, use("Runtime.BaseStruct"));
Object.assign(Bayrell.Bundler.BuildFile,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.BuildFile";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": "Bayrell.Bundler.BuildFile",
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
			a.push("file_path");
			a.push("ext");
			a.push("module");
			a.push("languages");
			a.push("content");
			a.push("ast");
			a.push("stop");
			a.push("parse_error");
			a.push("log_files");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		if (field_name == "file_path") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "ext") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "module") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "languages") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "content") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "ast") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "stop") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "parse_error") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "log_files") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BuildFile",
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
});use.add(Bayrell.Bundler.BuildFile);
module.exports = Bayrell.Bundler.BuildFile;