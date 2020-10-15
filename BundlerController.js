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
Bayrell.Bundler.BundlerController = function(ctx)
{
	use("Runtime.Core.CoreObject").call(this, ctx, "bundler-controller");
	this.config = ctx.config(ctx, "Bayrell.Bundler");
	this.output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
	this.languages = this.config.get(ctx, "languages");
	/* Register object in context */
	ctx.addObject(ctx, this);
};
Bayrell.Bundler.BundlerController.prototype = Object.create(use("Runtime.Core.CoreObject").prototype);
Bayrell.Bundler.BundlerController.prototype.constructor = Bayrell.Bundler.BundlerController;
Object.assign(Bayrell.Bundler.BundlerController.prototype,
{
	/**
	 * Returns modules
	 */
	getModules: async function(ctx)
	{
		if (this.modules == null)
		{
			var __v0 = use("Runtime.Monad");
			var __v1 = new __v0(ctx, this.config);
			__v1 = __v1.attr(ctx, "modules");
			var __v2 = use("Runtime.rtl");
			__v1 = __v1.monad(ctx, __v2.m_def(ctx, use("Runtime.Collection").from([])));
			var modules_dir = __v1.value(ctx);
			this.modules = await this.constructor.loadModules(ctx, modules_dir);
		}
		return Promise.resolve(this.modules);
	},
	/**
	 * Returns module by name
	 */
	findModuleByName: function(ctx, module_name)
	{
		var __v0 = use("Runtime.lib");
		return this.modules.findItem(ctx, __v0.equalAttr(ctx, "module_name", module_name));
	},
	/**
	 * Write line
	 */
	writeln: function(ctx, msg)
	{
		this.output.writeln(ctx, msg);
	},
	/**
	 * Run module build chain
	 */
	chainBuildModuleByName: async function(ctx, module_name)
	{
		var module = this.findModuleByName(ctx, module_name);
		if (module == null)
		{
			return Promise.resolve();
		}
		/* Chain module build */
		var __v0 = use("Bayrell.Bundler.ChainModule");
		await ctx.chainAsync(ctx, this.constructor.CHAIN_BUILD_MODULE, use("Runtime.Collection").from([this,new __v0(ctx, use("Runtime.Dict").from({"module":module}))]));
	},
	/**
	 * Run file build chain
	 */
	chainBuildCheckFile: function(ctx, file)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, ctx.chain(ctx, this.constructor.CHAIN_BUILD_FILE_CHECK, use("Runtime.Collection").from([this,file])));
		__v1 = __v1.attr(ctx, 1);
		return __v1.value(ctx);
	},
	/**
	 * Run file build chain
	 */
	chainBuildFile: async function(ctx, file)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, await ctx.chainAsync(ctx, this.constructor.CHAIN_BUILD_FILE, use("Runtime.Collection").from([this,file])));
		__v1 = __v1.attr(ctx, 1);
		return Promise.resolve(__v1.value(ctx));
	},
	/**
	 * Run module build chain
	 */
	makeBundle: async function(ctx, bundle_conf)
	{
		/* Get modules */
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, bundle_conf);
		__v1 = __v1.attr(ctx, "modules");
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(ctx, __v2.m_to(ctx, "Runtime.Collection", use("Runtime.Collection").from([])));
		var modules = __v1.value(ctx);
		/* Build modules */
		for (var j = 0;j < modules.count(ctx);j++)
		{
			var module_name = modules.item(ctx, j);
			if (Runtime.rtl.get(ctx, module_name, 0) == "@")
			{
				continue;
			}
			await this.chainBuildModuleByName(ctx, module_name);
		}
		/* Make bundle */
		await this.chainBundle(ctx, bundle_conf);
	},
	/**
	 * Run module build chain
	 */
	bundleByModule: async function(ctx, module_name)
	{
		var module = this.findModuleByName(ctx, module_name);
		if (module == null)
		{
			return Promise.resolve();
		}
		var bundle_conf = this.constructor.getBundleConf(ctx, this.config, module);
		if (bundle_conf == null)
		{
			return Promise.resolve();
		}
		await this.chainBundle(ctx, bundle_conf);
	},
	/**
	 * Run module build chain
	 */
	chainBundle: async function(ctx, bundle_conf)
	{
		var __v0 = use("Runtime.Vector");
		var modules_to_build = new __v0(ctx);
		var __v1 = use("Runtime.Monad");
		var __v2 = new __v1(ctx, bundle_conf);
		__v2 = __v2.attr(ctx, "modules");
		var __v3 = use("Runtime.rtl");
		__v2 = __v2.monad(ctx, __v3.m_to(ctx, "Runtime.Collection", use("Runtime.Collection").from([])));
		var build_modules = __v2.value(ctx);
		for (var j = 0;j < build_modules.count(ctx);j++)
		{
			var module_name = build_modules.item(ctx, j);
			/* Module file */
			if (Runtime.rtl.get(ctx, module_name, 0) == "@")
			{
				var __v4 = use("Runtime.rs");
				module_name = __v4.substr(ctx, module_name, 1);
				var __v5 = use("Runtime.rs");
				var __v6 = use("Runtime.lib");
				var arr = __v5.split(ctx, "/", module_name).filter(ctx, __v6.equalNot(ctx, ""));
				module_name = Runtime.rtl.get(ctx, arr, 0);
				var __v7 = use("Runtime.rs");
				var file_name = __v7.join(ctx, "/", arr.slice(ctx, 1));
				var __v8 = use("Runtime.lib");
				var module = this.modules.findItem(ctx, __v8.equalAttr(ctx, "module_name", module_name));
				if (module != null)
				{
					var __v9 = use("Bayrell.Bundler.ModuleFile");
					var file = new __v9(ctx, use("Runtime.Dict").from({"file_name":file_name,"module_name":module_name,"lib_path":module.lib_path}));
					modules_to_build.push(ctx, file);
				}
			}
			else
			{
				var __v9 = use("Runtime.lib");
				var module = this.modules.findItem(ctx, __v9.equalAttr(ctx, "module_name", module_name));
				if (module != null)
				{
					modules_to_build.push(ctx, module);
				}
			}
		}
		var __v4 = use("Runtime.Monad");
		var __v5 = new __v4(ctx, bundle_conf);
		__v5 = __v5.attr(ctx, "lang");
		var __v6 = use("Runtime.rtl");
		__v5 = __v5.monad(ctx, __v6.m_to(ctx, "string", ""));
		var lang = __v5.value(ctx);
		var __v7 = use("Runtime.Monad");
		var __v8 = new __v7(ctx, bundle_conf);
		__v8 = __v8.attr(ctx, "dest");
		var __v9 = use("Runtime.rtl");
		__v8 = __v8.monad(ctx, __v9.m_to(ctx, "string", ""));
		var dest = __v8.value(ctx);
		var __v10 = use("Bayrell.Bundler.ChainBundle");
		await ctx.chainAsync(ctx, this.constructor.CHAIN_BUNDLE, use("Runtime.Collection").from([this,new __v10(ctx, use("Runtime.Dict").from({"modules":modules_to_build.toCollection(ctx),"lang":lang,"dest":dest}))]));
	},
	_init: function(ctx)
	{
		this.config = null;
		this.modules = null;
		this.languages = null;
		this.log_files = false;
		this.output = null;
		use("Runtime.Core.CoreObject").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.BundlerController"))
		{
			this.config = o.config;
			this.modules = o.modules;
			this.languages = o.languages;
			this.log_files = o.log_files;
			this.output = o.output;
		}
		use("Runtime.Core.CoreObject").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "config")this.config = v;
		else if (k == "modules")this.modules = v;
		else if (k == "languages")this.languages = v;
		else if (k == "log_files")this.log_files = v;
		else if (k == "output")this.output = v;
		else use("Runtime.Core.CoreObject").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "config")return this.config;
		else if (k == "modules")return this.modules;
		else if (k == "languages")return this.languages;
		else if (k == "log_files")return this.log_files;
		else if (k == "output")return this.output;
		return use("Runtime.Core.CoreObject").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.BundlerController";
	},
});
Object.assign(Bayrell.Bundler.BundlerController, use("Runtime.Core.CoreObject"));
Object.assign(Bayrell.Bundler.BundlerController,
{
	CHAIN_BUILD_MODULE: "Bayrell.Bundler.BundlerController::CHAIN_BUILD_MODULE",
	CHAIN_BUILD_FILE: "Bayrell.Bundler.BundlerController::CHAIN_BUILD_FILE",
	CHAIN_BUILD_FILE_CHECK: "Bayrell.Bundler.BundlerController::CHAIN_BUILD_FILE_CHECK",
	CHAIN_BUNDLE: "Bayrell.Bundler.BundlerController::CHAIN_BUNDLE",
	BUILD_FILE_FILTER: 1000,
	BUILD_FILE_READ_FILE: 2000,
	BUILD_FILE_PARSE_FILE: 3000,
	BUILD_FILE_SAVE_FILE: 4000,
	/**
	 * Returns controller
	 */
	getController: async function(ctx)
	{
		var control = ctx.getObject(ctx, "bundler-controller");
		if (control == null)
		{
			var __v0 = use("Runtime.rtl");
			control = __v0.newInstance(ctx, this.getCurrentClassName(ctx));
			/* Load modules */
			await control.getModules(ctx);
		}
		return Promise.resolve(control);
	},
	/**
	 * Returns modules from dirs
	 */
	loadModules: async function(ctx, modules_dir)
	{
		/*
		Collection<string> items =
			@.config("Bayrell.Bundler") |> "modules" |> default []
			|> await .mapAsync( curry fs::readDir(?, @.base_path) )
			|> .flat(1)
			|> default []
		;
		*/
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		for (var i = 0;i < modules_dir.count(ctx);i++)
		{
			var dir = modules_dir.item(ctx, i);
			var __v1 = use("Runtime.fs");
			var arr = await __v1.readDir(ctx, dir, ctx.base_path);
			for (var j = 0;j < arr.count(ctx);j++)
			{
				var module_name = arr.item(ctx, j);
				var __v2 = use("Bayrell.Bundler.Module");
				items.push(ctx, new __v2(ctx, use("Runtime.Dict").from({"module_name":module_name,"lib_path":dir})));
			}
		}
		return Promise.resolve(items.toCollection(ctx));
	},
	/**
	 * Find module by file_path
	 */
	findModule: function(ctx, modules, file_path)
	{
		var __v0 = use("Runtime.fs");
		file_path = __v0.addFirstSlash(ctx, file_path);
		var str_len = 0;
		var find = null;
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module = modules.item(ctx, i);
			var __v1 = use("Runtime.fs");
			var __v2 = use("Runtime.fs");
			var module_path = __v1.addFirstSlash(ctx, module.getPath(ctx) + use("Runtime.rtl").toStr(__v2.DIRECTORY_SEPARATOR));
			var __v3 = use("Runtime.rs");
			var module_path_len = __v3.strlen(ctx, module_path);
			var __v4 = use("Runtime.rs");
			if (__v4.strpos(ctx, file_path, module_path) == 0 && module_path_len > str_len)
			{
				find = module;
				str_len = module_path_len;
			}
		}
		return find;
	},
	/**
	 * Get build conf
	 */
	getBundleConf: function(ctx, conf, module)
	{
		var module_name = module.module_name;
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, conf);
		__v1 = __v1.attr(ctx, "bundles");
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(ctx, __v2.m_def(ctx, use("Runtime.Collection").from([])));
		var bundle_items = __v1.value(ctx);
		for (var i = 0;i < bundle_items.count(ctx);i++)
		{
			var bundle_conf = bundle_items.item(ctx, i);
			var __v3 = use("Runtime.Monad");
			var __v4 = new __v3(ctx, bundle_conf);
			__v4 = __v4.attr(ctx, "modules");
			var __v5 = use("Runtime.rtl");
			__v4 = __v4.monad(ctx, __v5.m_to(ctx, "Runtime.Collection", use("Runtime.Collection").from([])));
			var modules = __v4.value(ctx);
			if (modules.indexOf(ctx, module_name) != -1)
			{
				return bundle_conf;
			}
		}
		return null;
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.BundlerController";
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
			"class_name": "Bayrell.Bundler.BundlerController",
			"name": "Bayrell.Bundler.BundlerController",
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
			a.push("config");
			a.push("modules");
			a.push("languages");
			a.push("log_files");
			a.push("output");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		if (field_name == "CHAIN_BUILD_MODULE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "string",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "CHAIN_BUILD_FILE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "string",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "CHAIN_BUILD_FILE_CHECK") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "string",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "CHAIN_BUNDLE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "string",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_FILTER") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "int",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_READ_FILE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "int",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_PARSE_FILE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "int",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_SAVE_FILE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "int",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "config") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "Runtime.Dict",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "modules") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "Runtime.Collection",
			"s": ["Bayrell.Bundler.Module"],
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "languages") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "Runtime.Collection",
			"s": ["string"],
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "log_files") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "bool",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "output") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerController",
			"t": "Runtime.Task.TaskDriver",
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
});use.add(Bayrell.Bundler.BundlerController);
module.exports = Bayrell.Bundler.BundlerController;