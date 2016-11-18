/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Main entry point.
 *
 * @author Stefan Heule <stefanheule@gmail.com>
 */

"use strict";

import main = require('./main')
import Util = require('./util/Util')
import Random = require('./util/Random')
import Ansi = require('./util/Ansicolors')
import Data = require('./Data')
import Search = require('./Search')
import Recorder = require('./Recorder')
import StructureInference = require('./StructureInference')
var fs = require('fs')

var log = Util.log
var print = Util.print
var line = Util.line

function error(message) {
    print(Ansi.red("Error: " + message))
    Util.exit(2)
}

Random.resetRandomness(-1)

var f = function (self, a1, a2, a3) {
	return Array.prototype.pop.apply(self, [a1, a2, a3])
}
var args = [[[1, 2, 3, 4], 2, 3, 4]]

var data
var dataList

try {
	data = fs.readFileSync('./function-list.json', 'utf8');
	dataList = JSON.parse(data)['function-list'];
} catch (err) {
	if (err.code === 'ENOENT') {
		error('function-list.json not found');
	} else if (err instanceof SyntaxError) {
		error('Invaild json format');
	} else {
		throw err;
	}
}

if (dataList == undefined) {
	error('funcion-list field does not exists');
} else if (!(dataList instanceof Array)) {
	error('function-list is not list');
}

var functionList = dataList.map(function(e) {
	var name = e['name'];
	var fstr = e['function-body'];
	var args = []

	try {
		var arg = e['args'];
		args.push(eval(arg));
	} catch (err) {
		error('args is not any[][]');
	}

	if (name == undefined) {
		error('Function name does not exists:\n' + e.toString());
	}
	if (fstr == undefined) {
		error('Function body does not exists:\n' + e.toString());
	}

	var f;
	try {
		f = eval('(' + fstr + ')');
	} catch (err) {
		error('Could not parse function:\n' + fstr);
	}

	if (!(f instanceof Function)) {
		error('Function body is not javascript function:\n' + fstr);
	}
	return {'name': name, 'function': f, 'args': args};
})

var config = new Search.SearchConfig();
config.debug = 1;

functionList.map(function (e) {
	Ansi.Green(e['name']);
	Search.search(e['function'], e['args'], config);
});

Util.exit(0);
