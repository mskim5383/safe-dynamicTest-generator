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
    var fstr = whileUnroll(f.toString(), 2)
    var fsplit = fstr.split(/{/)
    var len = fsplit.length
    var scoreLen = 0

    var newfstr = fsplit[0]
    for (var i = 1; i < len; i++) {
        if ((fsplit[i-1].search('if') == -1) && (fsplit[i-1].search('else') == -1) && (fsplit[i-1].search('while') == -1) && (fsplit[i-1].search('for') == -1)) {
            newfstr += '{' + fsplit[i]
        } else {
            newfstr += '{\n_score[' + scoreLen + '] = 1;\n' + fsplit[i]
            scoreLen += 1
        }
    }
    console.log(newfstr)

    var _score = new Array(scoreLen)

    var newFunc = eval('[' + newfstr + ']')[0]
    for (var i = 0; i < args.length; i++) {
        var arg = args[i]
        var thisVal = arg.thisVal
        var argument = arg.args
        newFunc.apply(thisVal, argument)
    }

    var scoreNum = 0
    for (var i = 0; i < scoreLen; i++) {
        if (_score[i] == 1) {
            scoreNum++
        }
             console.log('score[' + i + '] = ' + _score[i])
    }

    return scoreNum / scoreLen
}

export function whileUnroll(fstr, depth) {
    var whileIdx = fstr.search('while')
    if (whileIdx == -1) {
        return fstr
    }

    var idx = whileIdx


    while (fstr[idx] != '(') {
        idx += 1
    }
    var startIdx = idx

    idx += 1
    var cnt = 1
    while (cnt > 0) {
        if (fstr[idx] == '(') {
            cnt += 1
        } else if (fstr[idx] == ')') {
            cnt -= 1
        }
        idx += 1
    }
    var endIdx = idx

    var condition = fstr.substring(startIdx, endIdx + 1)

    while (fstr[idx] != '{') {
        idx += 1
    }
    startIdx = idx

    idx += 1
    var cnt = 1
    while (cnt > 0) {
        if (fstr[idx] == '{') {
            cnt += 1
        } else if (fstr[idx] == '}') {
            cnt -= 1
        }
        idx += 1
    }
    endIdx = idx

    var fbody = fstr.substring(startIdx + 1, endIdx - 1)

    var newfstr = ''
    for (var i = 0; i < depth; i++) {
        newfstr += 'if ' + condition + '{\n' + fbody + '\n'
    }
    newfstr += 'while ' + condition + '{\n' + fbody + '\n'

    for (var i = 0; i < depth + 1; i++) {
        newfstr += '}\n'
    }

    return fstr.substring(0, whileIdx - 1) + newfstr + whileUnroll(fstr.substring(endIdx + 1), depth)
}




var ToObject = Builtin.ToObject
var ToString = Builtin.ToString
var ToNumber = Builtin.ToNumber
var ToInt32 = Builtin.ToInt32
var ToUint32 = Builtin.ToUint32
var HasProperty = Builtin.HasProperty
var ToInteger = Builtin.ToInteger
var DefineOwnProperty = Builtin.DefineOwnProperty
