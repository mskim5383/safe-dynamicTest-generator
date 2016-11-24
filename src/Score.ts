"use strict"

import Builtin = require('./Builtin')
import Ansi = require('./util/Ansicolors')

export function testInput(testSet) {
    var fName = testSet.name
    var f = Builtin.getFunction(fName)
    var score
    if (f === undefined) {
        score = -1
    } else {
        score = test(f, testSet.inputs)
    }

    Ansi.Red(fName + " score : " + score)

    testSet.score = score
    return testSet
}

export function test(f, args: any) {
    var fstr = f.toString()
    var fsplit = fstr.split(/{/)
    var len = fsplit.length

    var newfstr = fsplit[0] + '{' + fsplit[1]
    for (var i = 0; i < len - 2; i++) {
        newfstr += '{\n_score[' + i + '] = 1;\n' + fsplit[i + 2]
    }

    var _score = new Array(len - 2)

    var newFunc = eval('[' + newfstr + ']')[0]
    for (var i = 0; i < args.length; i++) {
        var arg = args[i]
        var thisVal = arg.thisVal
        var argument = arg.args
        newFunc.apply(thisVal, argument)
    }

    var scoreNum = 0
    for (var i = 0; i < len - 2; i++) {
        if (_score[i] == 1) {
            scoreNum++
        }
        // console.log('score[' + i + '] = ' + _score[i])
    }

    return scoreNum / (len - 2)
}

var ToObject = Builtin.ToObject
var ToString = Builtin.ToString
var ToNumber = Builtin.ToNumber
var ToInt32 = Builtin.ToInt32
var ToUint32 = Builtin.ToUint32
var HasProperty = Builtin.HasProperty
