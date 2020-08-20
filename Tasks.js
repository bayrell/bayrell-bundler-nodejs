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
	 * Load files
	 * Chain: BundlerHelper::BUILD_MODULE
	 */
	loadFiles: async function(ctx, build)
	{
		if (build.stop)
		{
			return Promise.resolve(build);
		}
		if (build.module == null)
		{
			return Promise.resolve(build);
		}
		var module_path = build.module.getPath(ctx);
		var __v0 = use("Runtime.fs");
		var path = __v0.concat(ctx, module_path, "bay");
		var __v1 = use("Runtime.fs");
		var exists = await __v1.exists(ctx, path, ctx.base_path);
		if (exists)
		{
			var __v2 = use("Runtime.fs");
			var files = await __v2.readDirectoryRecursive(ctx, path, ctx.base_path);
			build = Runtime.rtl.setAttr(ctx, build, Runtime.Collection.from(["module_path"]), module_path);
			build = Runtime.rtl.setAttr(ctx, build, Runtime.Collection.from(["files"]), files);
		}
		return Promise.resolve(build);
	},
	/**
	 * Build
	 * Chain: BundlerHelper::BUILD_MODULE
	 */
	build: async function(ctx, build)
	{
		if (build.stop)
		{
			return Promise.resolve(build);
		}
		if (build.files == null)
		{
			return Promise.resolve(build);
		}
		var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
		var json = ctx.config(ctx, "Bayrell.Bundler");
		var languages = json.get(ctx, "languages");
		var __v0 = use("Runtime.fs");
		var files_path = __v0.concat(ctx, build.module_path, "bay");
		for (var i = 0;i < build.files.count(ctx);i++)
		{
			var __v1 = use("Runtime.fs");
			var file_name = __v1.concat(ctx, files_path, build.files.item(ctx, i));
			var __v2 = use("Bayrell.Bundler.BuildFile");
			var __v3 = use("Runtime.rs");
			var file = new __v2(ctx, use("Runtime.Dict").from({"relative_path":build.files.item(ctx, i),"file_path":file_name,"ext":__v3.extname(ctx, file_name),"module":build.module,"languages":languages,"log_files":build.log_files}));
			/* Build file */
			var __v4 = use("Bayrell.Bundler.BundlerHelper");
			var file = ctx.chain(ctx, __v4.BUILD_FILE_CHECK, use("Runtime.Collection").from([file]));
			if (!file.stop)
			{
				var __v5 = use("Runtime.fs");
				output.writeln(ctx, __v5.concat(ctx, ctx.base_path, file_name));
				var __v6 = use("Bayrell.Bundler.BundlerHelper");
				file = await ctx.chainAwait(ctx, __v6.BUILD_FILE, use("Runtime.Collection").from([file]));
				/* Stop if error */
				if (file.parse_error != null)
				{
					/*return build;*/
				}
			}
		}
		return Promise.resolve(build);
	},
	/**
	 * Change File
	 */
	onChangeFile: async function(ctx, inotify, file_name)
	{
		var json = ctx.config(ctx, "Bayrell.Bundler");
		var languages = json.get(ctx, "languages");
		var __v0 = use("Runtime.rs");
		if (__v0.strpos(ctx, file_name, ctx.base_path) != 0)
		{
			return Promise.resolve();
		}
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		var file_path = __v0.substr(ctx, file_name, __v1.strlen(ctx, ctx.base_path));
		var __v2 = use("Bayrell.Bundler.BundlerHelper");
		var module = __v2.findModule(ctx, inotify.modules, file_path);
		if (module == null)
		{
			return Promise.resolve();
		}
		/* Write file name */
		var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
		/* Create build container */
		var __v3 = use("Bayrell.Bundler.BuildFile");
		var __v4 = use("Runtime.rs");
		var file = new __v3(ctx, use("Runtime.Dict").from({"file_path":file_path,"ext":__v4.extname(ctx, file_path),"module":module,"languages":languages}));
		/* Build file */
		var __v5 = use("Bayrell.Bundler.BundlerHelper");
		var file = ctx.chain(ctx, __v5.BUILD_FILE_CHECK, use("Runtime.Collection").from([file]));
		if (!file.stop)
		{
			var __v6 = use("Runtime.fs");
			output.writeln(ctx, __v6.concat(ctx, ctx.base_path, file_path));
			var __v7 = use("Bayrell.Bundler.BundlerHelper");
			await ctx.chainAwait(ctx, __v7.BUILD_FILE, use("Runtime.Collection").from([file]));
		}
	},
	/**
	 * Watch changes
	 */
	watch: async function(ctx)
	{
		var json = ctx.config(ctx, "Bayrell.Bundler");
		var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
		var modules_dir = json.get(ctx, "modules", use("Runtime.Collection").from([]));
		var __v0 = use("Bayrell.Bundler.BundlerHelper");
		var modules = await __v0.getModules(ctx);
		/* Get notify driver */
		var __v1 = use("Bayrell.Bundler.Inotify");
		var inotify = new __v1(ctx, "bundler-inotify");
		await inotify.createNotify(ctx);
		inotify.onChangeFile = this.onChangeFile.bind(this);
		inotify.changeTimeout = 500;
		inotify.modules = modules;
		ctx.addObject(ctx, inotify);
		for (var i = 0;i < modules_dir.count(ctx);i++)
		{
			var dir = modules_dir.item(ctx, i);
			var __v2 = use("Runtime.fs");
			var dir_path = __v2.concat(ctx, ctx.base_path, dir);
			await inotify.addFolder(ctx, dir_path);
		}
		output.writeln(ctx, "Start watch");
		while (true)
		{
			var __v2 = use("Runtime.rtl");
			await __v2.sleep(ctx, 100);
		}
	},
	/**
	 * Build project
	 */
	/*
	@TaskMethod{ "alias": "build" }
	static async void build()
	{
	}
	*/
	/**
	 * Show modules
	 */
	modules: async function(ctx)
	{
		var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
		var __v0 = use("Bayrell.Bundler.BundlerHelper");
		var modules = await __v0.getModules(ctx);
		/* Output list of modules */
		output.writeln(ctx, "Modules:");
		modules.each(ctx, (ctx, item) => 
		{
			output.writeln(ctx, "  " + use("Runtime.rtl").toStr(item.module_name));
		});
	},
	/**
	 * Make symlink
	 */
	make_link: async function(ctx, module_path, assets_path, kind)
	{
		var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
		var __v0 = use("Runtime.fs");
		var src = __v0.concat(ctx, module_path, kind);
		var __v1 = use("Runtime.fs");
		var dest = __v1.concat(ctx, assets_path, kind);
		var __v2 = use("Runtime.fs");
		var rel = __v2.relative(ctx, assets_path, src);
		var __v3 = use("Runtime.fs");
		await __v3.mkdir(ctx, assets_path, ctx.base_path);
		var __v4 = use("Runtime.fs");
		if (await __v4.exists(ctx, src, ctx.base_path))
		{
			var __v5 = use("Runtime.fs");
			await __v5.unlink(ctx, dest, ctx.base_path);
			var __v6 = use("Runtime.fs");
			await __v6.symlink(ctx, rel, dest, ctx.base_path);
			var __v7 = use("Runtime.fs");
			output.writeln(ctx, __v7.concat(ctx, ctx.base_path, dest) + use("Runtime.rtl").toStr(" -> ") + use("Runtime.rtl").toStr(rel));
		}
	},
	/**
	 * Make symlinks
	 */
	make_symlinks: async function(ctx)
	{
		var __v0 = use("Bayrell.Bundler.BundlerHelper");
		var modules = await __v0.getModules(ctx);
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module = modules.item(ctx, i);
			var __v1 = use("Runtime.fs");
			var module_path = __v1.concat(ctx, module.lib_path, module.module_name);
			var __v2 = use("Runtime.fs");
			var assets_path = __v2.concat(ctx, "/web/assets/", module.module_name);
			/* Resources folder */
			this.make_link(ctx, module_path, assets_path, "resources");
			/* ES6 folder */
			this.make_link(ctx, module_path, assets_path, "es6");
		}
	},
	/**
	 * Make module
	 */
	make: async function(ctx)
	{
		var sz = ctx.cli_args.count(ctx);
		var module_name = ctx.cli_args.get(ctx, 2, "");
		var __v0 = use("Bayrell.Bundler.BundlerHelper");
		var modules = await __v0.getModules(ctx);
		var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
		var __v1 = use("Runtime.lib");
		var module = modules.findItem(ctx, __v1.equalAttr(ctx, "module_name", module_name));
		if (module_name == "")
		{
			output.writeln(ctx, "Type module name:");
			modules.each(ctx, (ctx, item) => 
			{
				output.writeln(ctx, "  " + use("Runtime.rtl").toStr(item.module_name));
			});
			return Promise.resolve();
		}
		else if (module == null)
		{
			output.writeln(ctx, "Wrong module name " + use("Runtime.rtl").toStr(module_name));
			return Promise.resolve();
		}
		/* Chain module build */
		var __v2 = use("Bayrell.Bundler.BundlerHelper");
		var __v3 = use("Bayrell.Bundler.BuildModule");
		await ctx.chainAwait(ctx, __v2.BUILD_MODULE, use("Runtime.Collection").from([new __v3(ctx, use("Runtime.Dict").from({"module":module,"log_files":false}))]));
	},
	/**
	 * Make all modules
	 */
	make_all: async function(ctx)
	{
		var __v0 = use("Bayrell.Bundler.BundlerHelper");
		var modules = await __v0.getModules(ctx);
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module = modules.item(ctx, i);
			/* Chain module build */
			var __v1 = use("Bayrell.Bundler.BundlerHelper");
			var __v2 = use("Bayrell.Bundler.BuildModule");
			await ctx.chainAwait(ctx, __v1.BUILD_MODULE, use("Runtime.Collection").from([new __v2(ctx, use("Runtime.Dict").from({"module":module,"log_files":false}))]));
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
			"watch",
			"modules",
			"make_symlinks",
			"make",
			"make_all",
		];
		return use("Runtime.Collection").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "watch")
		{
			
			var __v0 = use("Runtime.Task.TaskMethod");
			var Collection = use("Runtime.Collection");
			var Dict = use("Runtime.Dict");
			var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
			return new IntrospectionInfo(ctx, {
				"kind": IntrospectionInfo.ITEM_METHOD,
				"class_name": "Bayrell.Bundler.Tasks",
				"name": "watch",
				"annotations": Collection.from([
					new __v0(ctx, use("Runtime.Dict").from({"alias":"watch"})),
				]),
			});
		}
		if (field_name == "modules")
		{
			
			var __v0 = use("Runtime.Task.TaskMethod");
			var __v1 = use("Runtime.Task.TaskMethod");
			var Collection = use("Runtime.Collection");
			var Dict = use("Runtime.Dict");
			var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
			return new IntrospectionInfo(ctx, {
				"kind": IntrospectionInfo.ITEM_METHOD,
				"class_name": "Bayrell.Bundler.Tasks",
				"name": "modules",
				"annotations": Collection.from([
					new __v1(ctx, use("Runtime.Dict").from({"alias":"modules"})),
				]),
			});
		}
		if (field_name == "make_symlinks")
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
				"name": "make_symlinks",
				"annotations": Collection.from([
					new __v2(ctx, use("Runtime.Dict").from({"alias":"make_symlinks"})),
				]),
			});
		}
		if (field_name == "make")
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
				"name": "make",
				"annotations": Collection.from([
					new __v3(ctx, use("Runtime.Dict").from({"alias":"make"})),
				]),
			});
		}
		if (field_name == "make_all")
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
				"name": "make_all",
				"annotations": Collection.from([
					new __v4(ctx, use("Runtime.Dict").from({"alias":"make_all"})),
				]),
			});
		}
		return null;
	},
});use.add(Bayrell.Bundler.Tasks);
module.exports = Bayrell.Bundler.Tasks;