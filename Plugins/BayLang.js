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
		var __v1 = use("Bayrell.Bundler.BundlerController");
		var __v2 = use("Bayrell.Bundler.BundlerController");
		var __v3 = use("Runtime.Core.LambdaChain");
		var __v4 = use("Bayrell.Bundler.BundlerController");
		var __v5 = use("Bayrell.Bundler.BundlerController");
		var __v6 = use("Runtime.Core.LambdaChain");
		var __v7 = use("Bayrell.Bundler.BundlerController");
		var __v8 = use("Bayrell.Bundler.BundlerController");
		return entities.pushIm(ctx, new __v0(ctx, use("Runtime.Dict").from({"name":__v1.CHAIN_BUILD_FILE,"value":"Bayrell.Bundler.Plugins.BayLang::readFile","is_async":true,"pos":__v2.BUILD_FILE_READ_FILE}))).pushIm(ctx, new __v3(ctx, use("Runtime.Dict").from({"name":__v4.CHAIN_BUILD_FILE,"value":"Bayrell.Bundler.Plugins.BayLang::parseFile","is_async":true,"pos":__v5.BUILD_FILE_PARSE_FILE}))).pushIm(ctx, new __v6(ctx, use("Runtime.Dict").from({"name":__v7.CHAIN_BUILD_FILE,"value":"Bayrell.Bundler.Plugins.BayLang::saveFile","is_async":true,"pos":__v8.BUILD_FILE_SAVE_FILE})));
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
		if (file.ext != "bay" && file.ext != "ui")
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
	 * Parse file
	 */
	parseFile: async function(ctx, control, file)
	{
		if (!this.check(ctx, file))
		{
			return Promise.resolve(use("Runtime.Collection").from([control,file]));
		}
		if (file.content == "")
		{
			return Promise.resolve(use("Runtime.Collection").from([control,file]));
		}
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
				control.writeln(ctx, "Parser error: " + use("Runtime.rtl").toStr(e.getErrorMessage(ctx)));
			}
			else
			{
				throw _ex;
			}
		}
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
		if (file.ast == null)
		{
			return Promise.resolve(use("Runtime.Collection").from([control,file]));
		}
		/* Save file to other languages */
		for (var i = 0;i < control.languages.count(ctx);i++)
		{
			var lang = control.languages.item(ctx, i);
			var translator = this.getTranslator(ctx, control, file, lang);
			if (translator == null)
			{
				continue;
			}
			/* Get destination path */
			var file_path = this.getDestFilePath(ctx, control, file, lang);
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
			if (control.log_files)
			{
				var __v4 = use("Runtime.fs");
				control.writeln(ctx, "=>" + use("Runtime.rtl").toStr(__v4.concat(ctx, ctx.base_path, file_path)));
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
		if (lang == "php")
		{
			var __v1 = use("Runtime.re");
			file_path = __v1.replace(ctx, "\\.bay$", ".php", file_path);
			var __v2 = use("Runtime.re");
			file_path = __v2.replace(ctx, "\\.ui$", ".php", file_path);
		}
		else if (lang == "es6")
		{
			var __v3 = use("Runtime.re");
			file_path = __v3.replace(ctx, "\\.bay$", ".js", file_path);
			var __v4 = use("Runtime.re");
			file_path = __v4.replace(ctx, "\\.ui$", ".js", file_path);
		}
		else if (lang == "nodejs")
		{
			var __v5 = use("Runtime.re");
			file_path = __v5.replace(ctx, "\\.bay$", ".js", file_path);
			var __v6 = use("Runtime.re");
			file_path = __v6.replace(ctx, "\\.ui$", ".js", file_path);
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
	getTranslator: function(ctx, control, file, lang)
	{
		/* Get config */
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, control.config);
		__v1 = __v1.attr(ctx, "options");
		__v1 = __v1.attr(ctx, "Bayrell.Bundler.Plugins.BayLang");
		__v1 = __v1.attr(ctx, lang);
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(ctx, __v2.m_to(ctx, "Runtime.Dict", use("Runtime.Dict").from({})));
		var conf = __v1.value(ctx);
		var __v3 = use("Runtime.Monad");
		var __v4 = new __v3(ctx, Runtime.rtl.get(ctx, conf, "backend"));
		var __v5 = use("Runtime.rtl");
		__v4 = __v4.monad(ctx, __v5.m_to(ctx, "bool", false));
		var backend = __v4.value(ctx);
		var __v6 = use("Runtime.Monad");
		var __v7 = new __v6(ctx, Runtime.rtl.get(ctx, conf, "frontend"));
		var __v8 = use("Runtime.rtl");
		__v7 = __v7.monad(ctx, __v8.m_to(ctx, "bool", false));
		var frontend = __v7.value(ctx);
		var __v9 = use("Runtime.Monad");
		var __v10 = new __v9(ctx, Runtime.rtl.get(ctx, conf, "enable_context"));
		var __v11 = use("Runtime.rtl");
		__v10 = __v10.monad(ctx, __v11.m_to(ctx, "bool", false));
		var enable_context = __v10.value(ctx);
		var __v12 = use("Runtime.Monad");
		var __v13 = new __v12(ctx, Runtime.rtl.get(ctx, conf, "enable_check_types"));
		var __v14 = use("Runtime.rtl");
		__v13 = __v13.monad(ctx, __v14.m_to(ctx, "bool", false));
		var enable_check_types = __v13.value(ctx);
		var __v15 = use("Runtime.Monad");
		var __v16 = new __v15(ctx, Runtime.rtl.get(ctx, conf, "enable_async_await"));
		var __v17 = use("Runtime.rtl");
		__v16 = __v16.monad(ctx, __v17.m_to(ctx, "bool", true));
		var enable_async_await = __v16.value(ctx);
		var __v18 = use("Runtime.Monad");
		var __v19 = new __v18(ctx, Runtime.rtl.get(ctx, conf, "enable_introspection"));
		var __v20 = use("Runtime.rtl");
		__v19 = __v19.monad(ctx, __v20.m_to(ctx, "bool", false));
		var enable_introspection = __v19.value(ctx);
		var __v21 = use("Runtime.Monad");
		var __v22 = new __v21(ctx, Runtime.rtl.get(ctx, conf, "emulate_async_await"));
		var __v23 = use("Runtime.rtl");
		__v22 = __v22.monad(ctx, __v23.m_to(ctx, "bool", false));
		var emulate_async_await = __v22.value(ctx);
		var __v24 = use("Runtime.Monad");
		var __v25 = new __v24(ctx, Runtime.rtl.get(ctx, conf, "use_module_name"));
		var __v26 = use("Runtime.rtl");
		__v25 = __v25.monad(ctx, __v26.m_to(ctx, "bool", false));
		var use_module_name = __v25.value(ctx);
		var __v27 = use("Runtime.Monad");
		var __v28 = new __v27(ctx, Runtime.rtl.get(ctx, conf, "use_strict"));
		var __v29 = use("Runtime.rtl");
		__v28 = __v28.monad(ctx, __v29.m_to(ctx, "bool", false));
		var use_strict = __v28.value(ctx);
		if (lang == "php")
		{
			/* Create translator */
			var __v30 = use("Bayrell.Lang.LangPHP.TranslatorPHP");
			return new __v30(ctx, use("Runtime.Dict").from({"backend":backend,"frontend":frontend,"enable_context":enable_context,"enable_check_types":enable_check_types,"enable_introspection":enable_introspection}));
		}
		if (lang == "es6")
		{
			/* Create translator */
			var __v30 = use("Bayrell.Lang.LangES6.TranslatorES6");
			return new __v30(ctx, use("Runtime.Dict").from({"backend":backend,"frontend":frontend,"enable_context":enable_context,"enable_check_types":enable_check_types,"enable_async_await":enable_async_await,"enable_introspection":enable_introspection,"emulate_async_await":emulate_async_await,"use_module_name":use_module_name,"use_strict":use_strict}));
		}
		if (lang == "nodejs")
		{
			/* Create translator */
			var __v30 = use("Bayrell.Lang.LangNode.TranslatorNode");
			return new __v30(ctx, use("Runtime.Dict").from({"backend":backend,"frontend":frontend,"enable_context":enable_context,"enable_check_types":enable_check_types,"enable_async_await":enable_async_await,"enable_introspection":enable_introspection,"emulate_async_await":emulate_async_await,"use_module_name":use_module_name,"use_strict":use_strict}));
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
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
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
});use.add(Bayrell.Bundler.Plugins.BayLang);
module.exports = Bayrell.Bundler.Plugins.BayLang;