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
Bayrell.Bundler.Tasks = function(ctx)
{
};
Object.assign(Bayrell.Bundler.Tasks.prototype,
{
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.Tasks"))
		{
		}
	},
	assignValue: function(ctx,k,v)
	{
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
	},
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.Tasks";
	},
});
Object.assign(Bayrell.Bundler.Tasks,
{
	/**
	 * Change File
	 */
	onChangeFile: async function(ctx, inotify, file_name)
	{
		var __v0 = use("Bayrell.Bundler.BundlerController");
		var control = await __v0.getController(ctx);
		var __v1 = use("Runtime.rs");
		if (__v1.strpos(ctx, file_name, ctx.base_path) != 0)
		{
			return Promise.resolve();
		}
		var __v1 = use("Runtime.rs");
		var __v2 = use("Runtime.rs");
		var file_path = __v1.substr(ctx, file_name, __v2.strlen(ctx, ctx.base_path));
		var __v3 = use("Bayrell.Bundler.BundlerController");
		var module = __v3.findModule(ctx, control.modules, file_path);
		/* Create build container */
		var __v4 = use("Bayrell.Bundler.ChainFile");
		var __v5 = use("Runtime.rs");
		var file = new __v4(ctx, use("Runtime.Dict").from({"module":module,"file_path":file_path,"ext":__v5.extname(ctx, file_path)}));
		/* Build file */
		file = control.chainBuildCheckFile(ctx, file);
		if (!file.stop)
		{
			var __v6 = use("Runtime.fs");
			control.writeln(ctx, __v6.concat(ctx, ctx.base_path, file_path));
			await control.chainBuildFile(ctx, file);
			/* Bundle */
			await control.bundleByModule(ctx, module.module_name);
		}
	},
	/**
	 * Watch changes
	 */
	task_watch: async function(ctx)
	{
		var __v0 = use("Bayrell.Bundler.BundlerController");
		var control = await __v0.getController(ctx);
		control.log_files = true;
		/* Get notify driver */
		var __v1 = use("Bayrell.Bundler.Inotify");
		var inotify = new __v1(ctx, "bundler-inotify");
		await inotify.createNotify(ctx);
		inotify.onChangeFile = this.onChangeFile.bind(this);
		inotify.changeTimeout = 500;
		ctx.addObject(ctx, inotify);
		var __v2 = use("Runtime.Monad");
		var __v3 = new __v2(ctx, control.config);
		__v3 = __v3.attr(ctx, "modules");
		var modules_dir = __v3.value(ctx);
		for (var i = 0;i < modules_dir.count(ctx);i++)
		{
			var dir = modules_dir.item(ctx, i);
			var __v4 = use("Runtime.fs");
			var dir_path = __v4.concat(ctx, ctx.base_path, dir);
			await inotify.addFolder(ctx, dir_path);
		}
		control.writeln(ctx, "Start watch");
		while (true)
		{
			var __v4 = use("Runtime.rtl");
			await __v4.sleep(ctx, 100);
		}
	},
	/**
	 * Build project
	 */
	task_build: async function(ctx)
	{
		var __v0 = use("Bayrell.Bundler.BundlerController");
		var control = await __v0.getController(ctx);
		/* Build bundles */
		var __v1 = use("Runtime.Monad");
		var __v2 = new __v1(ctx, control.config);
		__v2 = __v2.attr(ctx, "build");
		var build_items = __v2.value(ctx);
		for (var i = 0;i < build_items.count(ctx);i++)
		{
			var __v3 = use("Runtime.Map");
			var builded_modules = new __v3(ctx);
			var bundle_conf = build_items.item(ctx, i);
			/* Get params */
			var __v4 = use("Runtime.Monad");
			var __v5 = new __v4(ctx, bundle_conf);
			__v5 = __v5.attr(ctx, "modules");
			var build_modules = __v5.value(ctx);
			/* Build modules */
			for (var j = 0;j < build_modules.count(ctx);j++)
			{
				var module_name = build_modules.item(ctx, j);
				if (builded_modules.has(ctx, module_name))
				{
					continue;
				}
				await control.chainBuildModuleByName(ctx, module_name);
				builded_modules.set(ctx, module_name, true);
			}
			/* Make bundle */
			await control.chainBundle(ctx, bundle_conf);
		}
	},
	/**
	 * Show modules
	 */
	task_modules: async function(ctx)
	{
		var __v0 = use("Bayrell.Bundler.BundlerController");
		var control = await __v0.getController(ctx);
		/* Output list of modules */
		control.output.writeln(ctx, "Modules:");
		control.modules.each(ctx, (ctx, item) => 
		{
			control.output.writeln(ctx, "  " + use("Runtime.rtl").toStr(item.module_name));
		});
	},
	/**
	 * Make symlink
	 */
	make_link: async function(ctx, module_path, assets_path, kind)
	{
		var __v0 = use("Runtime.fs");
		module_path = __v0.addFirstSlash(ctx, module_path);
		var __v1 = use("Runtime.fs");
		assets_path = __v1.addFirstSlash(ctx, assets_path);
		var __v2 = use("Runtime.fs");
		var src = __v2.concat(ctx, module_path, kind);
		var __v3 = use("Runtime.fs");
		var dest = __v3.concat(ctx, assets_path, kind);
		var __v4 = use("Runtime.fs");
		var rel = __v4.relative(ctx, assets_path, src);
		var __v5 = use("Runtime.fs");
		await __v5.mkdir(ctx, assets_path, ctx.base_path);
		var __v6 = use("Runtime.fs");
		if (await __v6.exists(ctx, src, ctx.base_path))
		{
			var __v7 = use("Runtime.fs");
			await __v7.unlink(ctx, dest, ctx.base_path);
			var __v8 = use("Runtime.fs");
			await __v8.symlink(ctx, rel, dest, ctx.base_path);
			var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
			var __v9 = use("Runtime.fs");
			output.writeln(ctx, __v9.concat(ctx, ctx.base_path, dest) + use("Runtime.rtl").toStr(" -> ") + use("Runtime.rtl").toStr(rel));
		}
	},
	/**
	 * Make symlinks
	 */
	task_make_symlinks: async function(ctx)
	{
		var __v0 = use("Bayrell.Bundler.BundlerController");
		var control = await __v0.getController(ctx);
		for (var i = 0;i < control.modules.count(ctx);i++)
		{
			var module = control.modules.item(ctx, i);
			var __v1 = use("Runtime.fs");
			var module_path = __v1.concat(ctx, module.lib_path, module.module_name);
			var __v2 = use("Runtime.fs");
			var assets_path = __v2.concat(ctx, "/web/assets/", module.module_name);
			/* Resources folder */
			this.make_link(ctx, module_path, assets_path, "resources");
			/* ES6 folder */
			/*static::make_link(module_path, assets_path, "es6");*/
		}
	},
	/**
	 * Make module
	 */
	task_make: async function(ctx)
	{
		var sz = ctx.cli_args.count(ctx);
		var module_name = ctx.cli_args.get(ctx, 2, "");
		var __v0 = use("Bayrell.Bundler.BundlerController");
		var control = await __v0.getController(ctx);
		var module = control.findModuleByName(ctx, module_name);
		if (module_name == "")
		{
			control.writeln(ctx, "Type module name:");
			control.modules.each(ctx, (ctx, item) => 
			{
				control.writeln(ctx, "  " + use("Runtime.rtl").toStr(item.module_name));
			});
			return Promise.resolve();
		}
		else if (module == null)
		{
			control.writeln(ctx, "Wrong module name " + use("Runtime.rtl").toStr(module_name));
			return Promise.resolve();
		}
		/* Run module build chain */
		await control.chainBuildModuleByName(ctx, module_name);
	},
	/**
	 * Make all modules
	 */
	task_make_all: async function(ctx)
	{
		var __v0 = use("Bayrell.Bundler.BundlerController");
		var control = await __v0.getController(ctx);
		for (var i = 0;i < control.modules.count(ctx);i++)
		{
			var module = control.modules.item(ctx, i);
			await control.chainBuildModuleByName(ctx, module.module_name);
		}
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.Tasks";
	},
	getParentClassName: function()
	{
		return "";
	},
	getClassInfo: function(ctx)
	{
		var __v0 = use("Runtime.Task.TaskList");
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Bayrell.Bundler.Tasks",
			"name": "Bayrell.Bundler.Tasks",
			"annotations": Collection.from([
				new __v0(ctx, use("Runtime.Dict").from({})),
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a = [
			"task_watch",
			"task_build",
			"task_modules",
			"task_make_symlinks",
			"task_make",
			"task_make_all",
		];
		return use("Runtime.Collection").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "task_watch")
		{
			
			var __v0 = use("Runtime.Task.TaskMethod");
			var Collection = use("Runtime.Collection");
			var Dict = use("Runtime.Dict");
			var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
			return new IntrospectionInfo(ctx, {
				"kind": IntrospectionInfo.ITEM_METHOD,
				"class_name": "Bayrell.Bundler.Tasks",
				"name": "task_watch",
				"annotations": Collection.from([
					new __v0(ctx, use("Runtime.Dict").from({"alias":"watch"})),
				]),
			});
		}
		if (field_name == "task_build")
		{
			
			var __v0 = use("Runtime.Task.TaskMethod");
			var __v1 = use("Runtime.Task.TaskMethod");
			var Collection = use("Runtime.Collection");
			var Dict = use("Runtime.Dict");
			var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
			return new IntrospectionInfo(ctx, {
				"kind": IntrospectionInfo.ITEM_METHOD,
				"class_name": "Bayrell.Bundler.Tasks",
				"name": "task_build",
				"annotations": Collection.from([
					new __v1(ctx, use("Runtime.Dict").from({"alias":"build"})),
				]),
			});
		}
		if (field_name == "task_modules")
		{
			
			var __v0 = use("Runtime.Task.TaskMethod");
			var __v1 = use("Runtime.Task.TaskMethod");
			var __v2 = use("Runtime.Task.TaskMethod");
			var Collection = use("Runtime.Collection");
			var Dict = use("Runtime.Dict");
			var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
			return new IntrospectionInfo(ctx, {
				"kind": IntrospectionInfo.ITEM_METHOD,
				"class_name": "Bayrell.Bundler.Tasks",
				"name": "task_modules",
				"annotations": Collection.from([
					new __v2(ctx, use("Runtime.Dict").from({"alias":"modules"})),
				]),
			});
		}
		if (field_name == "task_make_symlinks")
		{
			
			var __v0 = use("Runtime.Task.TaskMethod");
			var __v1 = use("Runtime.Task.TaskMethod");
			var __v2 = use("Runtime.Task.TaskMethod");
			var __v3 = use("Runtime.Task.TaskMethod");
			var Collection = use("Runtime.Collection");
			var Dict = use("Runtime.Dict");
			var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
			return new IntrospectionInfo(ctx, {
				"kind": IntrospectionInfo.ITEM_METHOD,
				"class_name": "Bayrell.Bundler.Tasks",
				"name": "task_make_symlinks",
				"annotations": Collection.from([
					new __v3(ctx, use("Runtime.Dict").from({"alias":"make_symlinks"})),
				]),
			});
		}
		if (field_name == "task_make")
		{
			
			var __v0 = use("Runtime.Task.TaskMethod");
			var __v1 = use("Runtime.Task.TaskMethod");
			var __v2 = use("Runtime.Task.TaskMethod");
			var __v3 = use("Runtime.Task.TaskMethod");
			var __v4 = use("Runtime.Task.TaskMethod");
			var Collection = use("Runtime.Collection");
			var Dict = use("Runtime.Dict");
			var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
			return new IntrospectionInfo(ctx, {
				"kind": IntrospectionInfo.ITEM_METHOD,
				"class_name": "Bayrell.Bundler.Tasks",
				"name": "task_make",
				"annotations": Collection.from([
					new __v4(ctx, use("Runtime.Dict").from({"alias":"make"})),
				]),
			});
		}
		if (field_name == "task_make_all")
		{
			
			var __v0 = use("Runtime.Task.TaskMethod");
			var __v1 = use("Runtime.Task.TaskMethod");
			var __v2 = use("Runtime.Task.TaskMethod");
			var __v3 = use("Runtime.Task.TaskMethod");
			var __v4 = use("Runtime.Task.TaskMethod");
			var __v5 = use("Runtime.Task.TaskMethod");
			var Collection = use("Runtime.Collection");
			var Dict = use("Runtime.Dict");
			var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
			return new IntrospectionInfo(ctx, {
				"kind": IntrospectionInfo.ITEM_METHOD,
				"class_name": "Bayrell.Bundler.Tasks",
				"name": "task_make_all",
				"annotations": Collection.from([
					new __v5(ctx, use("Runtime.Dict").from({"alias":"make_all"})),
				]),
			});
		}
		return null;
	},
});use.add(Bayrell.Bundler.Tasks);
module.exports = Bayrell.Bundler.Tasks;