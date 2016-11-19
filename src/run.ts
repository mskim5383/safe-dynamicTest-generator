/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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

"use strict"

import main = require('./main')
import Util = require('./util/Util')
import Random = require('./util/Random')
import Ansi = require('./util/Ansicolors')
import Data = require('./Data')
import Search = require('./Search')
import Recorder = require('./Recorder')
import StructureInference = require('./StructureInference')
import TestGen = require('./TestGen')
var fs = require('fs')

var log = Util.log
var print = Util.print
var line = Util.line

function error(message) {
    print(Ansi.red("Error: " + message))
    Util.exit(2)
}

Random.resetRandomness(-1)

var safe_path
if (Util.argvlength() < 2) {
	error('SAFE_PATH is not given')
} else {
	safe_path = Util.argv(2)
	if (safe_path == "") {
		error('SAFE_PATH is empty')
	}
	safe_path += '/'
}

var data
var dataList

try {
	data = fs.readFileSync('./function-list.json', 'utf8')
	dataList = JSON.parse(data)['function-list']
} catch (err) {
	if (err.code === 'ENOENT') {
		error('function-list.json not found')
	} else if (err instanceof SyntaxError) {
		error('Invaild json format')
	} else {
		throw err
	}
}

if (dataList == undefined) {
	error('funcion-list field does not exists')
} else if (!(dataList instanceof Array)) {
	error('function-list is not list')
}

var functionList = dataList.map(parseFunction)

var config = new Search.SearchConfig()


var inputSet = functionList.reduce(generateInputSet, [])

var jsonList = inputSet.map(generateJson)

var tests_path = safe_path + 'tests/dynamicTest/'
if (!fs.existsSync(tests_path)) {
	try {
		fs.mkdir(tests_path)
	} catch (err) {
		error('Could not create dynamicTest directory')
	}
}

jsonList.map(test => saveTests(tests_path, test))


Util.exit(0)





function parseFunction (e) {
	var name = e['name']
	var fstr = e['function-body']
	var args = []
	var thisVal

	try {
		thisVal = e['thisVal']
		if (thisVal == undefined) {
			thisVal = null
		} else {
			thisVal = eval(thisVal)
		}
	} catch (err) {
		error('Could not parse thisVal:\n' + e['thisVal'])
	}

	try {
		var arg = [thisVal].concat(eval('[' + e['args'] + ']'))
		args.push(arg)
	} catch (err) {
		error('args is not any[][]:\n' + arg)
	}

	if (name == undefined) {
		error('Function name does not exists:\n' + e.toString())
	}
	if (fstr == undefined) {
		error('Function body does not exists:\n' + e.toString())
	}

	var f
	try {
		f = eval('(' + fstr + ')')
	} catch (err) {
		error('Could not parse function:\n' + fstr)
	}

	var func = function(self) {
		f.apply(self, Array.prototype.slice.call(arguments, 1))
	}

	if (!(f instanceof Function)) {
		error('Function body is not javascript function:\n' + fstr)
	}
	return {'name': name, 'function': func, 'args': args, 'f': f}
}

function generateInputSet (inputSet, e) {
	e['inputs'] = []
	var inputs = Search.search(e['function'], e['args'], config)
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i]
		e.inputs.push({'thisVal': input[0], 'args': input.slice(1)})
	}
	inputSet.push(e)
	return inputSet
}

function generateJson (test) {
	for (var i = 0; i < test.inputs.length; i++) {
		var input = test.inputs[i]
		var testJson = TestGen.jsonGen(test['f'], input['thisVal'], input['args'])
		input.json = testJson
	}
	return test
}

function saveTests (tests_path, test) {
	var name = test.name
	var inputs = test.inputs

	var test_path = tests_path + name + '/'
	if (!fs.existsSync(test_path)) {
		try {
			fs.mkdir(test_path)
		} catch (err) {
			error('Could not create test directory: ' + test_path)
		}
	}

	for (var i = 0; i < inputs.length; i++) {
		var json_name = name + '_' + i + '.json'
		var input = inputs[i]
		try {
			fs.writeFileSync(test_path + json_name, input.json)
			Ansi.Green('Created ' + json_name)
		} catch (err) {
			error('Could not write test json: ' + json_name)
		}
	}
}
