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
Bayrell.Bundler.ChainModule = function(ctx)
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
Bayrell.Bundler.ChainModule.prototype = Object.create(use("Runtime.BaseStruct").prototype);
Bayrell.Bundler.ChainModule.prototype.constructor = Bayrell.Bundler.ChainModule;
Object.assign(Bayrell.Bundler.ChainModule.prototype,
{
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		this.module = null;
		this.files = null;
		this.stop = false;
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.ChainModule"))
		{
			this.module = o.module;
			this.files = o.files;
			this.stop = o.stop;
		}
		use("Runtime.BaseStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "module")this.module = v;
		else if (k == "files")this.files = v;
		else if (k == "stop")this.stop = v;
		else use("Runtime.BaseStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "module")return this.module;
		else if (k == "files")return this.files;
		else if (k == "stop")return this.stop;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.ChainModule";
	},
});
Object.assign(Bayrell.Bundler.ChainModule, use("Runtime.BaseStruct"));
Object.assign(Bayrell.Bundler.ChainModule,
{
	/**
	 * Load files
	 * Chain: BundlerController::BUILD_MODULE
	 */
	loadFiles: async function(ctx, control, chain)
	{
		if (chain.stop)
		{
			return Promise.resolve(chain);
		}
		if (chain.module == null)
		{
			return Promise.resolve(chain);
		}
		var module_path = chain.module.getPath(ctx);
		var __v0 = use("Runtime.fs");
		var path = __v0.concat(ctx, module_path, "bay");
		var __v1 = use("Runtime.fs");
		var exists = await __v1.exists(ctx, path, ctx.base_path);
		if (exists)
		{
			var __v2 = use("Runtime.fs");
			var files = await __v2.readDirectoryRecursive(ctx, path, ctx.base_path);
			chain = Runtime.rtl.setAttr(ctx, chain, Runtime.Collection.from(["files"]), files);
		}
		return Promise.resolve(use("Runtime.Collection").from([control,chain]));
	},
	/**
	 * Build
	 * Chain: BundlerController::BUILD_MODULE
	 */
	buildModule: async function(ctx, control, chain)
	{
		if (chain.stop)
		{
			return Promise.resolve(chain);
		}
		if (chain.files == null)
		{
			return Promise.resolve(chain);
		}
		var module_path = chain.module.getPath(ctx);
		var __v0 = use("Runtime.fs");
		var files_path = __v0.concat(ctx, module_path, "bay");
		for (var i = 0;i < chain.files.count(ctx);i++)
		{
			var file_relative_path = chain.files.item(ctx, i);
			var __v1 = use("Runtime.fs");
			var file_name = __v1.concat(ctx, files_path, file_relative_path);
			var __v2 = use("Bayrell.Bundler.ChainFile");
			var __v3 = use("Runtime.rs");
			var file = new __v2(ctx, use("Runtime.Dict").from({"module":chain.module,"file_path":file_name,"ext":__v3.extname(ctx, file_name)}));
			/* Build file */
			file = control.chainBuildCheckFile(ctx, file);
			if (!file.stop)
			{
				var __v4 = use("Runtime.fs");
				control.writeln(ctx, __v4.concat(ctx, ctx.base_path, file_name));
				file = await control.chainBuildFile(ctx, file);
				/* Stop if error */
				if (file.parse_error != null)
				{
					/*return chain;*/
				}
			}
		}
		return Promise.resolve(use("Runtime.Collection").from([control,chain]));
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.ChainModule";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Bayrell.Bundler.ChainModule",
			"name": "Bayrell.Bundler.ChainModule",
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
			a.push("files");
			a.push("stop");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		if (field_name == "module") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.ChainModule",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "files") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.ChainModule",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "stop") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.ChainModule",
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
});use.add(Bayrell.Bundler.ChainModule);
module.exports = Bayrell.Bundler.ChainModule;