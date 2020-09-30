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
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.Plugins.Bundle"))
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
		if (chain.lang != "es6")
		{
			return Promise.resolve(use("Runtime.Collection").from([control,chain]));
		}
		var __v0 = use("Runtime.Vector");
		var assets_content = new __v0(ctx);
		var modules = chain.modules;
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module = modules.item(ctx, i);
			var module_path = module.getPath(ctx);
			var __v1 = use("Runtime.fs");
			var module_json_path = __v1.concat(ctx, module_path, "module.json");
			/* Read module.json */
			var __v2 = use("Runtime.Monad");
			var __v4 = use("Runtime.fs");
			var __v3 = new __v2(ctx, await __v4.readFile(ctx, module_json_path, "utf8", ctx.base_path));
			var __v5 = use("Runtime.rtl");
			__v3 = __v3.call(ctx, __v5.json_decode.bind(__v5));
			var __v6 = use("Runtime.rtl");
			__v3 = __v3.monad(ctx, __v6.m_def(ctx, use("Runtime.Dict").from({})));
			var module_json = __v3.value(ctx);
			/* Get module assets */
			var __v7 = use("Runtime.Monad");
			var __v8 = new __v7(ctx, module_json);
			__v8 = __v8.attr(ctx, "assets");
			var __v9 = use("Runtime.rtl");
			__v8 = __v8.monad(ctx, __v9.m_to(ctx, "Runtime.Collection", use("Runtime.Collection").from([])));
			var assets = __v8.value(ctx);
			for (var j = 0;j < assets.count(ctx);j++)
			{
				var file_name = assets.item(ctx, j);
				var __v10 = use("Runtime.fs");
				var file_path = __v10.concatArr(ctx, use("Runtime.Collection").from([module_path,"es6",file_name])) + use("Runtime.rtl").toStr(".js");
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
		var __v1 = use("Runtime.rs");
		chain = Runtime.rtl.setAttr(ctx, chain, Runtime.Collection.from(["bundle_content"]), __v1.join(ctx, "\n", assets_content));
		return Promise.resolve(use("Runtime.Collection").from([control,chain]));
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
});use.add(Bayrell.Bundler.Plugins.Bundle);
module.exports = Bayrell.Bundler.Plugins.Bundle;