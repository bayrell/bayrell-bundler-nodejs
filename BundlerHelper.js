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
Bayrell.Bundler.BundlerHelper = function(ctx)
{
};
Object.assign(Bayrell.Bundler.BundlerHelper.prototype,
{
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Bayrell.Bundler.BundlerHelper"))
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
		return "Bayrell.Bundler.BundlerHelper";
	},
});
Object.assign(Bayrell.Bundler.BundlerHelper,
{
	CHANGE_FILE_CHAIN: "Bayrell.Bundler.BundlerHelper::CHANGE_FILE_CHAIN",
	BUILD_PROJECT: "Bayrell.Bundler.BundlerHelper::BUILD_PROJECT",
	BUILD_MODULE: "Bayrell.Bundler.BundlerHelper::BUILD_MODULE",
	BUILD_FILE: "Bayrell.Bundler.BundlerHelper::BUILD_FILE",
	BUILD_FILE_CHECK: "Bayrell.Bundler.BundlerHelper::BUILD_FILE_CHECK",
	BUILD_FILE_FILTER: 1000,
	BUILD_FILE_READ_FILE: 2000,
	BUILD_FILE_PARSE_FILE: 3000,
	BUILD_FILE_SAVE_FILE: 4000,
	/**
	 * Returns modules from dirs
	 */
	getModules: async function(ctx)
	{
		/*
		Collection<string> items =
			@.config("Bayrell.Bundler")
			|> "modules"
			|> default []
			|> .map( curry fs::concat(@.base_path, ?) )
			|> await .mapAsync( curry fs::readDir(?, @.base_path) )
			|> .flat(1)
			|> default []
		;
		*/
		var json = ctx.config(ctx, "Bayrell.Bundler");
		var modules_dir = json.get(ctx, "modules", use("Runtime.Collection").from([]));
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
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Bayrell.Bundler";
	},
	getCurrentClassName: function()
	{
		return "Bayrell.Bundler.BundlerHelper";
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
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": "Bayrell.Bundler.BundlerHelper",
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
		if (field_name == "CHANGE_FILE_CHAIN") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_PROJECT") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_MODULE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_CHECK") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_FILTER") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_READ_FILE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_PARSE_FILE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "BUILD_FILE_SAVE_FILE") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Bayrell.Bundler.BundlerHelper",
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
});use.add(Bayrell.Bundler.BundlerHelper);
module.exports = Bayrell.Bundler.BundlerHelper;