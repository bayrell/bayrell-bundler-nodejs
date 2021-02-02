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
Bayrell.Bundler.Plugins.Bundle = function(ctx)
{
	use("Bayrell.Bundler.Plugin").apply(this, arguments);
};
Bayrell.Bundler.Plugins.Bundle.prototype = Object.create(use("Bayrell.Bundler.Plugin").prototype);
Bayrell.Bundler.Plugins.Bundle.prototype.constructor = Bayrell.Bundler.Plugins.Bundle;
Object.assign(Bayrell.Bundler.Plugins.Bundle.prototype,
{
	getClassName: function(ctx)
	{
		return "Bayrell.Bundler.Plugins.Bundle";
	},
});
Object.assign(Bayrell.Bundler.Plugins.Bundle, use("Bayrell.Bundler.Plugin"));
Object.assign(Bayrell.Bundler.Plugins.Bundle,
{
	/**
	 * Extend entities
	 */
	extendEntities: function(ctx, c, entities)
	{
		var __v0 = use("Runtime.Core.LambdaChain");
		var __v1 = use("Bayrell.Bundler.BundlerController");
		var __v2 = use("Runtime.Core.LambdaChain");
		var __v3 = use("Bayrell.Bundler.BundlerController");
		return entities.pushIm(ctx, new __v0(ctx, use("Runtime.Dict").from({"name":__v1.CHAIN_BUNDLE,"value":"Bayrell.Bundler.Plugins.Bundle::bundle","is_async":true,"pos":1000}))).pushIm(ctx, new __v2(ctx, use("Runtime.Dict").from({"name":__v3.CHAIN_BUNDLE,"value":"Bayrell.Bundler.Plugins.Bundle::saveFile","is_async":true,"pos":2000})));
	},
	/**
	 * Bundle
	 */
	bundle: async function(ctx, control, chain)
	{
		var __v0 = use("Runtime.Vector");
		var assets_content = new __v0(ctx);
		var modules = chain.modules;
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module = modules.item(ctx, i);
			/* if module */
			var __v1 = use("Bayrell.Bundler.Module");
			var __v11 = use("Bayrell.Bundler.ModuleFile");
			if (module instanceof __v1)
			{
				var module_path = module.getPath(ctx);
				var __v2 = use("Runtime.fs");
				var module_json_path = __v2.concat(ctx, module_path, "module.json");
				/* Read module.json */
				var __v3 = use("Runtime.Monad");
				var __v5 = use("Runtime.fs");
				var __v4 = new __v3(ctx, await __v5.readFile(ctx, module_json_path, "utf8", ctx.base_path));
				var __v6 = use("Runtime.rtl");
				__v4 = __v4.call(ctx, __v6.json_decode.bind(__v6));
				var __v7 = use("Runtime.rtl");
				__v4 = __v4.monad(ctx, __v7.m_def(ctx, use("Runtime.Dict").from({})));
				var module_json = __v4.value(ctx);
				/* Get module assets */
				var __v8 = use("Runtime.Monad");
				var __v9 = new __v8(ctx, module_json);
				__v9 = __v9.attr(ctx, "assets");
				var __v10 = use("Runtime.rtl");
				__v9 = __v9.monad(ctx, __v10.m_to(ctx, "Runtime.Collection", use("Runtime.Collection").from([])));
				var assets = __v9.value(ctx);
				for (var j = 0;j < assets.count(ctx);j++)
				{
					var file_name = assets.item(ctx, j);
					var file_path = "";
					if (Runtime.rtl.get(ctx, file_name, 0) == "@")
					{
						var __v11 = use("Runtime.rs");
						file_name = __v11.substr(ctx, file_name, 1);
						var __v12 = use("Runtime.fs");
						file_path = __v12.concat(ctx, module_path, "resources", file_name);
					}
					else
					{
						var __v13 = use("Runtime.fs");
						file_path = __v13.concat(ctx, module_path, "es6", file_name) + use("Runtime.rtl").toStr(".js");
					}
					/* Check file */
					if (!this.checkFile(ctx, chain, file_path))
					{
						continue;
					}
					/* Read file */
					var __v11 = use("Runtime.fs");
					var file_exists = await __v11.exists(ctx, file_path, ctx.base_path);
					if (file_exists)
					{
						var __v12 = use("Runtime.fs");
						var file_content = await __v12.readFile(ctx, file_path, "utf8", ctx.base_path);
						if (file_content != "")
						{
							assets_content.push(ctx, file_content);
						}
					}
				}
			}
			else if (module instanceof __v11)
			{
				var file_path = module.getPath(ctx);
				/* Check file */
				if (!this.checkFile(ctx, chain, file_path))
				{
					continue;
				}
				/* Read file */
				var __v12 = use("Runtime.fs");
				var file_exists = await __v12.exists(ctx, file_path, ctx.base_path);
				if (file_exists)
				{
					var __v13 = use("Runtime.fs");
					var file_content = await __v13.readFile(ctx, file_path, "utf8", ctx.base_path);
					if (file_content != "")
					{
						assets_content.push(ctx, file_content);
					}
				}
			}
		}
		var __v1 = use("Runtime.rs");
		chain = Runtime.rtl.setAttr(ctx, chain, Runtime.Collection.from(["bundle_content"]), __v1.join(ctx, "\n", assets_content));
		return Promise.resolve(use("Runtime.Collection").from([control,chain]));
	},
	/**
	 * Check file
	 */
	checkFile: function(ctx, chain, file_path)
	{
		var __v0 = use("Runtime.rs");
		var ext = __v0.extname(ctx, file_path);
		if (chain.lang == "es6" && ext == "js")
		{
			return true;
		}
		if (chain.lang == "css" && ext == "css")
		{
			return true;
		}
		return false;
	},
	/**
	 * Save file
	 */
	saveFile: async function(ctx, control, chain)
	{
		var file_dest_path = chain.dest;
		var __v0 = use("Runtime.rs");
		var file_dest_dir_name = __v0.dirname(ctx, file_dest_path);
		var bundle_content = chain.bundle_content;
		/* Make dir */
		var __v1 = use("Runtime.fs");
		await __v1.mkdir(ctx, file_dest_dir_name, ctx.base_path);
		/* Save file */
		var __v2 = use("Runtime.fs");
		await __v2.saveFile(ctx, file_dest_path, bundle_content, "utf8", ctx.base_path);
		/* Output */
		control.writeln(ctx, "Bundle to => " + use("Runtime.rtl").toStr(file_dest_path));
		return Promise.resolve(use("Runtime.Collection").from([control,chain]));
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler.Plugins";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.Plugins.Bundle";
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
			"class_name": "Bayrell.Bundler.Plugins.Bundle",
			"name": "Bayrell.Bundler.Plugins.Bundle",
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
});use.add(Bayrell.Bundler.Plugins.Bundle);
module.exports = Bayrell.Bundler.Plugins.Bundle;