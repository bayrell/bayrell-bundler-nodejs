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
Bayrell.Bundler.Plugins.BayLang = function(ctx)
{
	use("Bayrell.Bundler.Plugin").apply(this, arguments);
};
Bayrell.Bundler.Plugins.BayLang.prototype = Object.create(use("Bayrell.Bundler.Plugin").prototype);
Bayrell.Bundler.Plugins.BayLang.prototype.constructor = Bayrell.Bundler.Plugins.BayLang;
Object.assign(Bayrell.Bundler.Plugins.BayLang.prototype,
{
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.Plugins.BayLang"))
		{
		}
		use("Bayrell.Bundler.Plugin").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		use("Bayrell.Bundler.Plugin").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		return use("Bayrell.Bundler.Plugin").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.Plugins.BayLang";
	},
});
Object.assign(Bayrell.Bundler.Plugins.BayLang, use("Bayrell.Bundler.Plugin"));
Object.assign(Bayrell.Bundler.Plugins.BayLang,
{
	/**
	 * Extend entities
	 */
	extendEntities: function(ctx, c, entities)
	{
		var __v0 = use("Runtime.Core.LambdaChain");
		var __v1 = use("Bayrell.Bundler.BundlerHelper");
		var __v2 = use("Runtime.Core.LambdaChain");
		var __v3 = use("Bayrell.Bundler.BundlerHelper");
		var __v4 = use("Bayrell.Bundler.BundlerHelper");
		var __v5 = use("Runtime.Core.LambdaChain");
		var __v6 = use("Bayrell.Bundler.BundlerHelper");
		var __v7 = use("Bayrell.Bundler.BundlerHelper");
		var __v8 = use("Runtime.Core.LambdaChain");
		var __v9 = use("Bayrell.Bundler.BundlerHelper");
		var __v10 = use("Bayrell.Bundler.BundlerHelper");
		return entities.pushIm(ctx, new __v0(ctx, use("Runtime.Dict").from({"name":__v1.BUILD_FILE_CHECK,"value":"Bayrell.Bundler.Plugins.BayLang::check","pos":0}))).pushIm(ctx, new __v2(ctx, use("Runtime.Dict").from({"name":__v3.BUILD_FILE,"value":"Bayrell.Bundler.Plugins.BayLang::readFile","is_async":true,"pos":__v4.BUILD_FILE_READ_FILE}))).pushIm(ctx, new __v5(ctx, use("Runtime.Dict").from({"name":__v6.BUILD_FILE,"value":"Bayrell.Bundler.Plugins.BayLang::parseFile","is_async":true,"pos":__v7.BUILD_FILE_PARSE_FILE}))).pushIm(ctx, new __v8(ctx, use("Runtime.Dict").from({"name":__v9.BUILD_FILE,"value":"Bayrell.Bundler.Plugins.BayLang::saveFile","is_async":true,"pos":__v10.BUILD_FILE_SAVE_FILE})));
	},
	/**
	 * Check file
	 */
	check: function(ctx, file)
	{
		if (file.stop)
		{
			return file.copy(ctx, use("Runtime.Dict").from({"stop":true}));
		}
		if (file.getBayPath(ctx) == "")
		{
			return file.copy(ctx, use("Runtime.Dict").from({"stop":true}));
		}
		if (file.module == null)
		{
			return file.copy(ctx, use("Runtime.Dict").from({"stop":true}));
		}
		if (file.ext != "bay")
		{
			return file.copy(ctx, use("Runtime.Dict").from({"stop":true}));
		}
		return file;
	},
	/**
	 * Read file
	 */
	readFile: async function(ctx, file)
	{
		if (file.stop)
		{
			return Promise.resolve(file);
		}
		if (file.getBayPath(ctx) == "")
		{
			return Promise.resolve(file);
		}
		if (file.module == null)
		{
			return Promise.resolve(file);
		}
		if (file.ext != "bay")
		{
			return Promise.resolve(file);
		}
		if (file.content != "")
		{
			return Promise.resolve(file);
		}
		/* Read file */
		var __v0 = use("Runtime.fs");
		var content = await __v0.readFile(ctx, file.file_path, "utf8", ctx.base_path);
		file = Runtime.rtl.setAttr(ctx, file, Runtime.Collection.from(["content"]), content);
		return Promise.resolve(file);
	},
	/**
	 * Parse file
	 */
	parseFile: async function(ctx, file)
	{
		if (file.stop)
		{
			return Promise.resolve(file);
		}
		if (file.module == null)
		{
			return Promise.resolve(file);
		}
		if (file.ext != "bay")
		{
			return Promise.resolve(file);
		}
		if (file.content == "")
		{
			return Promise.resolve(file);
		}
		var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
		/* Parse file */
		var __v0 = use("Bayrell.Lang.LangBay.ParserBay");
		var parser = new __v0(ctx);
		var __v2 = use("Bayrell.Lang.Exceptions.ParserError");
		try
		{
			var __v1 = use("Bayrell.Lang.LangUtils");
			var ast = __v1.parse(ctx, parser, file.content);
			file = Runtime.rtl.setAttr(ctx, file, Runtime.Collection.from(["ast"]), ast);
		}
		catch (_ex)
		{
			if (_ex instanceof __v2)
			{
				var e = _ex;
				
				file = Runtime.rtl.setAttr(ctx, file, Runtime.Collection.from(["parse_error"]), e);
				output.writeln(ctx, "Parser error: " + use("Runtime.rtl").toStr(e.getErrorMessage(ctx)));
			}
			else
			{
				throw _ex;
			}
		}
		return Promise.resolve(file);
	},
	/**
	 * Save file
	 */
	saveFile: async function(ctx, file)
	{
		if (file.stop)
		{
			return Promise.resolve(file);
		}
		if (file.module == null)
		{
			return Promise.resolve(file);
		}
		if (file.ext != "bay")
		{
			return Promise.resolve(file);
		}
		if (file.ast == null)
		{
			return Promise.resolve(file);
		}
		var output = ctx.getDriver(ctx, "Runtime.Task.TaskDriver");
		/* Save file to other languages */
		for (var i = 0;i < file.languages.count(ctx);i++)
		{
			var lang = file.languages.item(ctx, i);
			var translator = this.getTranslator(ctx, lang);
			var file_path = this.getDestFilePath(ctx, file, lang);
			/* Translate */
			var __v0 = use("Bayrell.Lang.LangUtils");
			var content = __v0.translate(ctx, translator, file.ast);
			/* Save to file */
			var __v1 = use("Runtime.rs");
			var dir_name = __v1.dirname(ctx, file_path);
			var __v2 = use("Runtime.fs");
			await __v2.mkdir(ctx, dir_name, ctx.base_path);
			var __v3 = use("Runtime.fs");
			await __v3.saveFile(ctx, file_path, content, "utf8", ctx.base_path);
			if (file.log_files)
			{
				var __v4 = use("Runtime.fs");
				output.writeln(ctx, "=>" + use("Runtime.rtl").toStr(__v4.concat(ctx, ctx.base_path, file_path)));
			}
		}
		/* Output ok */
		if (file.log_files)
		{
			output.writeln(ctx, "Ok");
		}
		return Promise.resolve(file);
	},
	/**
	 * Get dest file path
	 */
	getDestFilePath: function(ctx, file, lang)
	{
		var __v0 = use("Runtime.fs");
		var file_path = __v0.concatArr(ctx, use("Runtime.Collection").from([file.module.getPath(ctx),lang,file.getBayPath(ctx)]));
		if (lang == "php")
		{
			var __v1 = use("Runtime.re");
			file_path = __v1.replace(ctx, "\\.bay$", ".php", file_path);
		}
		else if (lang == "es6")
		{
			var __v2 = use("Runtime.re");
			file_path = __v2.replace(ctx, "\\.bay$", ".js", file_path);
		}
		else if (lang == "nodejs")
		{
			var __v3 = use("Runtime.re");
			file_path = __v3.replace(ctx, "\\.bay$", ".js", file_path);
		}
		else
		{
			return "";
		}
		return file_path;
	},
	/**
	 * Get translator
	 */
	getTranslator: function(ctx, lang)
	{
		if (lang == "php")
		{
			var __v0 = use("Bayrell.Lang.LangPHP.TranslatorPHP");
			return new __v0(ctx, use("Runtime.Dict").from({}));
		}
		if (lang == "es6")
		{
			var __v0 = use("Bayrell.Lang.LangES6.TranslatorES6");
			return new __v0(ctx, use("Runtime.Dict").from({"use_module_name":false,"use_strict":true,"enable_async_await":true,"emulate_async_await":true}));
		}
		if (lang == "nodejs")
		{
			var __v0 = use("Bayrell.Lang.LangNode.TranslatorNode");
			return new __v0(ctx, use("Runtime.Dict").from({"use_module_name":true,"use_strict":true,"enable_async_await":true,"emulate_async_await":false}));
		}
		return null;
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler.Plugins";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.Plugins.BayLang";
	},
	getParentClassName: function()
	{
		return "Bayrell.Bundler.Plugin";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Bayrell.Bundler.Plugins.BayLang",
			"name": "Bayrell.Bundler.Plugins.BayLang",
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
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
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
});use.add(Bayrell.Bundler.Plugins.BayLang);
module.exports = Bayrell.Bundler.Plugins.BayLang;