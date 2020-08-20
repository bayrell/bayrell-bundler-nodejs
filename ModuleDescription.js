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
Bayrell.Bundler.ModuleDescription = function(ctx)
{
};
Object.assign(Bayrell.Bundler.ModuleDescription.prototype,
{
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.ModuleDescription"))
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
		return "Bayrell.Bundler.ModuleDescription";
	},
});
Object.assign(Bayrell.Bundler.ModuleDescription,
{
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleName: function(ctx)
	{
		return "Bayrell.Bundler";
	},
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleVersion: function(ctx)
	{
		return "0.10.2";
	},
	/**
	 * Returns required modules
	 * @return Dict<string>
	 */
	requiredModules: function(ctx)
	{
		return use("Runtime.Dict").from({"Runtime":">=0.3","Runtime.Core":"*","Runtime.Task":"*"});
	},
	/**
	 * Returns enities
	 */
	entities: function(ctx)
	{
		var __v0 = use("Runtime.Core.LambdaChainDeclare");
		var __v1 = use("Bayrell.Bundler.BundlerHelper");
		var __v2 = use("Runtime.Core.LambdaChainDeclare");
		var __v3 = use("Bayrell.Bundler.BundlerHelper");
		var __v4 = use("Runtime.Core.LambdaChainDeclare");
		var __v5 = use("Bayrell.Bundler.BundlerHelper");
		var __v6 = use("Runtime.Core.LambdaChainDeclare");
		var __v7 = use("Bayrell.Bundler.BundlerHelper");
		var __v8 = use("Runtime.Core.Entity");
		var __v9 = use("Runtime.Core.LambdaChain");
		var __v10 = use("Bayrell.Bundler.BundlerHelper");
		var __v11 = use("Runtime.Core.LambdaChain");
		var __v12 = use("Bayrell.Bundler.BundlerHelper");
		return use("Runtime.Collection").from([new __v0(ctx, use("Runtime.Dict").from({"name":__v1.CHANGE_FILE_CHAIN})),new __v2(ctx, use("Runtime.Dict").from({"name":__v3.BUILD_PROJECT})),new __v4(ctx, use("Runtime.Dict").from({"name":__v5.BUILD_MODULE})),new __v6(ctx, use("Runtime.Dict").from({"name":__v7.BUILD_FILE})),new __v8(ctx, use("Runtime.Dict").from({"name":"Bayrell.Bundler.Tasks"})),new __v9(ctx, use("Runtime.Dict").from({"name":__v10.BUILD_MODULE,"value":"Bayrell.Bundler.Tasks::loadFiles","is_async":true,"pos":1000})),new __v11(ctx, use("Runtime.Dict").from({"name":__v12.BUILD_MODULE,"value":"Bayrell.Bundler.Tasks::build","is_async":true,"pos":2000}))]);
	},
	/**
	 * Returns context settings
	 * @return Dict<string>
	 */
	appSettings: function(ctx, env)
	{
		return use("Runtime.Dict").from({"config":use("Runtime.Dict").from({"Bayrell.Bundler":use("Runtime.Dict").from({})}),"secrets":use("Runtime.Dict").from({}),"providers":use("Runtime.Dict").from({})});
	},
	/**
	 * Init context
	 */
	appInit: function(ctx, c)
	{
		return c.constructor.init(ctx, c);
	},
	/**
	 * Start context
	 */
	appStart: async function(ctx, c)
	{
		/* Read project.json from base path */
		var __v0 = use("Runtime.Monad");
		var __v2 = use("Runtime.fs");
		var __v1 = new __v0(ctx, await __v2.readFile(ctx, "project.json", "utf8", ctx.base_path));
		var __v3 = use("Runtime.rtl");
		__v1 = __v1.call(ctx, __v3.json_decode.bind(__v3));
		var json = __v1.value(ctx);
		/* Set config */
		c = Runtime.rtl.setAttr(ctx, c, Runtime.Collection.from(["settings", "config", "Bayrell.Bundler"]), json);
		/* Get plugins */
		var __v4 = use("Runtime.Monad");
		var __v5 = new __v4(ctx, Runtime.rtl.get(ctx, json, "plugins"));
		var plugins = __v5.value(ctx);
		/* Extends entities by plugin */
		for (var i = 0;i < plugins.count(ctx);i++)
		{
			var plugin = plugins.item(ctx, i);
			var __v6 = use("Runtime.rtl");
			var f = __v6.method(ctx, plugin, "extendEntities");
			c = Runtime.rtl.setAttr(ctx, c, Runtime.Collection.from(["entities"]), f(ctx, c, c.entities));
		}
		/* Start */
		return Promise.resolve(await c.constructor.start(ctx, c));
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.ModuleDescription";
	},
	getParentClassName: function()
	{
		return "";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Bayrell.Bundler.ModuleDescription",
			"name": "Bayrell.Bundler.ModuleDescription",
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
			"appSettings",
			"appInit",
			"appStart",
		];
		return use("Runtime.Collection").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
	__implements__:
	[
		use("Runtime.Interfaces.ModuleDescriptionInterface"),
	],
});use.add(Bayrell.Bundler.ModuleDescription);
module.exports = Bayrell.Bundler.ModuleDescription;