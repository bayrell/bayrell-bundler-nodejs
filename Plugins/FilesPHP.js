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
if (typeof Bayrell.Bundler.Plugins == 'undefined') Bayrell.Bundler.Plugins = {};
Bayrell.Bundler.Plugins.FilesPHP = function(ctx)
{
	use("Bayrell.Bundler.Plugin").apply(this, arguments);
};
Bayrell.Bundler.Plugins.FilesPHP.prototype = Object.create(use("Bayrell.Bundler.Plugin").prototype);
Bayrell.Bundler.Plugins.FilesPHP.prototype.constructor = Bayrell.Bundler.Plugins.FilesPHP;
Object.assign(Bayrell.Bundler.Plugins.FilesPHP.prototype,
{
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.Plugins.FilesPHP";
	},
});
Object.assign(Bayrell.Bundler.Plugins.FilesPHP, use("Bayrell.Bundler.Plugin"));
Object.assign(Bayrell.Bundler.Plugins.FilesPHP,
{
	/**
	 * Extend entities
	 */
	extendEntities: function(ctx, c, entities)
	{
		var __v0 = use("Runtime.Core.LambdaChain");
		var __v1 = use("Bayrell.Bundler.BundlerController");
		var __v2 = use("Bayrell.Bundler.BundlerController");
		var __v3 = use("Runtime.Core.LambdaChain");
		var __v4 = use("Bayrell.Bundler.BundlerController");
		var __v5 = use("Bayrell.Bundler.BundlerController");
		return entities.pushIm(ctx, new __v0(ctx, use("Runtime.Dict").from({"name":__v1.CHAIN_BUILD_FILE,"value":"Bayrell.Bundler.Plugins.FilesPHP::readFile","is_async":true,"pos":__v2.BUILD_FILE_READ_FILE}))).pushIm(ctx, new __v3(ctx, use("Runtime.Dict").from({"name":__v4.CHAIN_BUILD_FILE,"value":"Bayrell.Bundler.Plugins.FilesPHP::saveFile","is_async":true,"pos":__v5.BUILD_FILE_SAVE_FILE})));
	},
	/**
	 * Check file
	 */
	check: function(ctx, file)
	{
		if (file.stop)
		{
			return false;
		}
		if (file.getBayPath(ctx) == "")
		{
			return false;
		}
		if (file.module == null)
		{
			return false;
		}
		if (file.ext != "php")
		{
			return false;
		}
		return true;
	},
	/**
	 * Read file
	 */
	readFile: async function(ctx, control, file)
	{
		if (!this.check(ctx, file))
		{
			return Promise.resolve(use("Runtime.Collection").from([control,file]));
		}
		if (file.content != "")
		{
			return Promise.resolve(use("Runtime.Collection").from([control,file]));
		}
		/* Read file */
		var __v0 = use("Runtime.fs");
		var content = await __v0.readFile(ctx, file.file_path, "utf8", ctx.base_path);
		file = Runtime.rtl.setAttr(ctx, file, Runtime.Collection.from(["content"]), content);
		return Promise.resolve(use("Runtime.Collection").from([control,file]));
	},
	/**
	 * Save file
	 */
	saveFile: async function(ctx, control, file)
	{
		if (!this.check(ctx, file))
		{
			return Promise.resolve(use("Runtime.Collection").from([control,file]));
		}
		if (file.content == "")
		{
			return Promise.resolve(use("Runtime.Collection").from([control,file]));
		}
		/* Save file to other languages */
		for (var i = 0;i < control.languages.count(ctx);i++)
		{
			var lang = control.languages.item(ctx, i);
			if (lang != "php")
			{
				continue;
			}
			/* Get destination path */
			var file_path = this.getDestFilePath(ctx, control, file, lang);
			/* Save to file */
			var __v0 = use("Runtime.rs");
			var dir_name = __v0.dirname(ctx, file_path);
			var __v1 = use("Runtime.fs");
			await __v1.mkdir(ctx, dir_name, ctx.base_path);
			var __v2 = use("Runtime.fs");
			await __v2.saveFile(ctx, file_path, file.content, "utf8", ctx.base_path);
			if (control.log_files)
			{
				var __v3 = use("Runtime.fs");
				control.writeln(ctx, "=>" + use("Runtime.rtl").toStr(__v3.concat(ctx, ctx.base_path, file_path)));
			}
		}
		/* Output ok */
		if (control.log_files)
		{
			control.writeln(ctx, "Ok");
		}
		return Promise.resolve(use("Runtime.Collection").from([control,file]));
	},
	/**
	 * Get dest file path
	 */
	getDestFilePath: function(ctx, control, file, lang)
	{
		var __v0 = use("Runtime.fs");
		var file_path = __v0.concatArr(ctx, use("Runtime.Collection").from([file.module.getPath(ctx),lang,file.getBayPath(ctx)]));
		return file_path;
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler.Plugins";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.Plugins.FilesPHP";
	},
	getParentClassName: function()
	{
		return "Bayrell.Bundler.Plugin";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Bayrell.Bundler.Plugins.FilesPHP",
			"name": "Bayrell.Bundler.Plugins.FilesPHP",
			"annotations": Collection.from([
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
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
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
});use.add(Bayrell.Bundler.Plugins.FilesPHP);
module.exports = Bayrell.Bundler.Plugins.FilesPHP;