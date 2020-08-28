/*!
 *  Bayrell Runtime Library
 *
 *  (c) Copyright 2016-2018 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.bayrell.org/licenses/APACHE-LICENSE-2.0.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


var exports = {
	VERSION: '0.10.3',
	MODULE_NAME: 'Bayrell.Bundler',
}

function add(name)
{
	var module_name = exports.MODULE_NAME;
	
	name = name
		.substr(module_name.length + 1)
		.replace(".", "/")
	;
	
	var path = __dirname + "/" + name + ".js";
	var obj = require(path);
}

add("Bayrell.Bundler.BundlerController");
add("Bayrell.Bundler.ChainBundle");
add("Bayrell.Bundler.ChainFile");
add("Bayrell.Bundler.ChainModule");
add("Bayrell.Bundler.Inotify");
add("Bayrell.Bundler.Module");
add("Bayrell.Bundler.Plugin");
add("Bayrell.Bundler.Tasks");
add("Bayrell.Bundler.Plugins.BayLang");
add("Bayrell.Bundler.Plugins.Bundle");
add("Bayrell.Bundler.ModuleDescription");

module.exports = exports;