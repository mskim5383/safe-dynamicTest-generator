"use strict"

export function getFunction(fName) {
  return map[fName]
}

var map = {}


export function ToObject(v) {
    if (v === null || v === undefined)
        throw TypeError
    return Object(v)
}

export function ToString(v) {
    return String(v)
}

export function ToNumber(v) {
    return Number(v)
}

export function ToInt32(v) {
    return v << 0
}

export function ToUint32(v) {
    return v >>> 0
}

export function HasProperty(o, p) {
    return p in o
}

// 15.4.4.6 Array.prototype.pop ( )
// The last element of the array is removed from the array and returned.
map["Array.prototype.pop"] = function() {
    // 1. Let O be the result of calling ToObject passing the this value as the argument.
    var O = ToObject(this)
    // 2. Let lenVal be the result of calling the [[Get]] internal method of O with argument "length".
    var lenVal = O["length"]
    // 3. Let len be ToUint32(lenVal).
    var len = ToUint32(lenVal)
    // 4. If len is zero,
    if (len === 0) {
        // a. Call the [[Put]] internal method of O with arguments "length", 0, and true.
        O.length = 0
        // b. Return undefined.
        return undefined
    // 5. Else, len > 0
    } else {
        // a. Let indx be ToString(len–1).
        var indx = ToString(len - 1)
        // b. Let element be the result of calling the [[Get]] internal method of O with argument indx.
        var element = O[indx]
        // c. Call the [[Delete]] internal method of O with arguments indx and true.
        delete O[indx]
        // d. Call the [[Put]] internal method of O with arguments "length", indx, and true.
        O["length"] = indx
        // e. Return element.
        return element
    }
}

// 15.4.4.8 Array.prototype.reverse ( )
// The elements of the array are rearranged so as to reverse their order. The object is returned as the result of the call.
map["Array.prototype.reverse"] = function() {
  // 1. Let O be the result of calling ToObject passing the this value as the argument.
  var O = ToObject(this)
  // 2. Let lenVal be the result of calling the [[Get]] internal method of O with argument "length".
  var lenVal = O["length"]
  // 3. Let len be ToUint32(lenVal).
  var len = ToUint32(lenVal)
  // 4. Let middle be floor(len/2).
  var middle = Math.floor(len/2)
  // 5. Let lower be 0.
  var lower = 0
  // 6. Repeat, while lower  middle
  while (lower != middle) {
    // a. Let upper be len lower 1.
    var upper = len - lower - 1
    // b. Let upperP be ToString(upper).
    var upperP = ToString(upper)
    // c. Let lowerP be ToString(lower).
    var lowerP = ToString(lower)
    // d. Let lowerValue be the result of calling the [[Get]] internal method of O with argument lowerP.
    var lowerValue = O[lowerP]
    // e. Let upperValue be the result of calling the [[Get]] internal method of O with argument upperP .
    var upperValue = O[upperP]
    // f. Let lowerExists be the result of calling the [[HasProperty]] internal method of O with argument lowerP.
    var lowerExists = HasProperty(O, lowerP)
    // g. Let upperExists be the result of calling the [[HasProperty]] internal method of O with argument upperP.
    var upperExists = HasProperty(O, upperP)
    // h. If lowerExists is true and upperExists is true, then
    if (lowerExists && upperExists) {
      // i. Call the [[Put]] internal method of O with arguments lowerP, upperValue, and true .
      O[lowerP] = upperValue
      // ii. Call the [[Put]] internal method of O with arguments upperP, lowerValue, and true .
      O[upperP] = lowerValue
    }
    // i. Else if lowerExists is false and upperExists is true, then
    else if (!lowerExists && upperExists) {
      // i. Call the [[Put]] internal method of O with arguments lowerP, upperValue, and true .
      O[lowerP] = upperValue
      // ii. Call the [[Delete]] internal method of O, with arguments upperP and true.
      delete O[upperP]
    }
    // j. Else if lowerExists is true and upperExists is false, then
    else if (lowerExists && !upperExists) {
      // i. Call the [[Delete]] internal method of O, with arguments lowerP and true .
      delete O[lowerP]
      // ii. Call the [[Put]] internal method of O with arguments upperP, lowerValue, and true . k.
      O[upperP] = lowerValue
    }
    // k. Else, both lowerExists and upperExists are false
    // i. No action is required.
    // l. Increase lower by 1.
    lower += 1
  }
  // 7. Return O 
  return O
}

// 15.4.4.9 rray.prototype.shift ( )
// The first element of the array is removed from the array and returned.
map["Array.prototype.shift"] = function() {
  // 1. Let O be the result of calling ToObject passing the this value as the argument.
  var O = ToObject(this)
  // 2. Let lenVal be the result of calling the [[Get]] internal method of O with argument "length".
  var lenVal = O["length"]
  // 3. Let len be ToUint32(lenVal).
  var len = ToUint32(lenVal)
  // 4. If len is zero, then
  if (len == 0) {
    // a. Call the [[Put]] internal method of O with arguments "length", 0, and true.
    O["length"] = 0
    // b. Return undefined.
    return undefined
  }
  // 5. Let first be the result of calling the [[Get]] internal method of O with argument "0".
  var first = O["0"]
  // 6. Let k be 1.
  var k = 1
  // 7. Repeat, while k < len
  while (k < len) {
    // a. Let from be ToString(k).
    var from_ = ToString(k)
    // b. Let to be ToString(k–1).
    var to_ = ToString(k - 1)
    // c. Let fromPresent be the result of calling the [[HasProperty]] internal method of O with argument from.
    var fromPresent = HasProperty(O, from_)
    // d. If fromPresent is true, then
    if (fromPresent) {
      // i. Let fromVal be the result of calling the [[Get]] internal method of O with argument from.
      var fromVal = O[from_]
      // ii. Call the [[Put]] internal method of O with arguments to, fromVal, and true.
      O[to_] = fromVal
    }
    // e. Else, fromPresent is false
    else {
      // i. Call the [[Delete]] internal method of O with arguments to and true.
      delete O[to_]
    }
    // f. Increase k by 1.
    k += 1
  }
  // 8. [[Delete]] internal method of O with arguments ToString(len–1) and true.
  delete O[ToString(len - 1)]
  // 9. [[Put]] internal method of O with arguments "length", (len–1) , and true.
  O["length"] = len - 1
  // 10. Return first.
  return first
}
