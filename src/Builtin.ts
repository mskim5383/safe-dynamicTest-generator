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

export function DefineOwnProperty(O, P, Desc, Throw) {
  try {
    return Object.defineProperty(O, P, Desc)
  } catch (e) {
    if (Throw) throw e
    else return false
  }
}

export function ToInteger(v) {
  // 1. Let number be the result of calling ToNumber on the input argument.
  var number = ToNumber(v)
  // 2. If number is NaN, return +0.
  if (isNaN(number)) return +0
  // 3. If number is +0, -0, +Infinity, or -Infinity, return number.
  if (Math.abs(number) === 0 || Math.abs(number) == Infinity) return number
  // 4. Return the result of computing sign(number) * floor(abs(number)).
  return Math.sign(number) * Math.floor(Math.abs(number))
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

export function IsCallable(f) {
    return f instanceof Function
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

// 15.4.4.7 Array.prototype.push ( [ item1 [ , item2 [ , ... ] ] ] )
map["Array.prototype.push"] = function() {
  // 1. Let O be the result of calling ToObject passing the this value as the argument.
  var O = ToObject(this)
  // 2. Let lenVal be the result of calling the [[Get]] internal method of O with argument "length".
  var lenVal = O["length"]
  // 3. Let n be ToUint32(lenVal).
  var n = ToUint32(lenVal)
  // 4. Let items be an internal List whose elements are,
  //    in left to right order, the arguments that were passed to this
  //    function invocation.
  var items = arguments
  // 5. Repeat, while items is not empty
  for (var i = 0; i < items.length; i++) {
    // a. Remove the first element from items and let E be the value of the element.
    var E = items[i]
    // b. Call the [[Put]] internal method of O with arguments ToString(n), E, and true.
    O[ToString(n)] = E
    // c. Increase n by 1.
    n++
  }
  // 6. Call the [[Put]] internal method of O with arguments "length", n, and true.
  O.length = n
  // 7. Return n.
  return n
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

// 15.4.4.10 Array.prototype.slice (start, end)
map["Array.prototype.slice"] = function(start, end) {
  // 1. Let O be the result of calling ToObject passing the this value as the argument.
  var O = ToObject(this)
  // 2. Let A be a new array created as if by the expression new Array() where Array is the standard built-in
  //    constructor with that name.
  var A = new Array()
  // 3. Let lenVal be the result of calling the [[Get]] internal method of O with argument "length".
  var lenVal = O.length
  // 4. Let len be ToUint32(lenVal).
  var len = ToUint32(lenVal)
  // 5. Let relativeStart be ToInteger(start).
  var relativeStart = ToInteger(start)
  // 6. If relativeStart is negative,
  var k
  if (relativeStart < 0) {
    // let k be max((len + relativeStart),0)
    k = Math.max((len + relativeStart), 0)
  } else {
    // else let k be min(relativeStart, len).
    k = Math.min(relativeStart, len)
  }
  // 7. If end is undefined,
  var relativeEnd
  if (end === undefined) {
    // let relativeEnd be len
    relativeEnd = len
  } else {
    // else let relativeEnd be ToInteger(end).
    relativeEnd = ToInteger(end)
  }
  // 8. If relativeEnd is negative,
  var final
  if (relativeEnd < 0) {
    // let final be max((len + relativeEnd),0)
    final = Math.max((len + relativeEnd), 0)
  } else {
    // else let final be min(relativeEnd, len).
    final = Math.min(relativeEnd, len)
  }
  // 9. Let n be 0.
  var n = 0
  // 10. Repeat, while k < final
  while (k < final) {
    // a. Let Pk be ToString(k).
    var Pk = ToString(k)
    // b. Let kPresent be the result of calling the [[HasProperty]] internal method of O with argument Pk.
    var kPresent = HasProperty(O, Pk)
    // c. If kPresent is true, then
    var kValue
    if (kPresent) {
      // i. Let kValue be the result of calling the [[Get]] internal method of O with argument Pk.
      kValue = O[Pk]
			// ii. Call the [[DefineOwnProperty]] internal method of A with arguments ToString(n), Property Descriptor {[[Value]]: kValue, [[Writable]]: true, [[Enumerable]]: true, [[Configurable]]: true}, and false.
      DefineOwnProperty(A, ToString(n), {
        value: kValue,
        writable: true,
        enumerable: true,
        configurable: true
      }, false)
    }
    // d. Increase k by 1.
    k++
    // e. Increase n by 1.
    n++
  }
  // 11. Return A.
  return A
}

// 15.4.4.12 Array.prototype.splice (start, deleteCount [ , item1 [ , item2 [ , ... ] ] ] )
map["Array.prototype.splice"] = function(start, deleteCount) {
  // 1. Let O be the result of calling ToObject passing the this value as the argument.
  var O = ToObject(this)
  // 2. Let A be a new array created as if by the expression new Array()where Array is the standard built-in
  //    constructor with that name.
  var A = new Array()
  // 3. Let lenVal be the result of calling the [[Get]] internal method of O with argument "length".
  var lenVal = O.length
  // 4. Let len be ToUint32(lenVal).
  var len = ToUint32(lenVal)
  // 5. Let relativeStart be ToInteger(start).
  var relativeStart = ToInteger(start)
  // 6. If relativeStart is negative, let actualStart be max((len + relativeStart),0); else let actualStart be
  //    min(relativeStart, len).
  var actualStart = 0
  if (relativeStart < 0) {
    actualStart = Math.max((len + relativeStart), 0)
  } else {
    actualStart = Math.min(relativeStart, len)
  }
  // 7. Let actualDeleteCount be min(max(ToInteger(deleteCount),0), len – actualStart).
  var actualDeleteCount = Math.min(Math.max(ToInteger(deleteCount), 0), len - actualStart)
  // 8. Let k be 0.
  var k = 0
  // 9. Repeat, while k < actualDeleteCount
  while (k < actualDeleteCount) {
    // a. Let from be ToString(actualStart+k).
    var from = ToString(actualStart + k)
    // b. Let fromPresent be the result of calling the [[HasProperty]] internal method of O with argument from.
    var fromPresent = HasProperty(O, from)
    // c. If fromPresent is true, then
    if (fromPresent) {
      // i. Let fromValue be the result of calling the [[Get]] internal method of O with argument from.
      var fromValue = O[from]
      // ii. Call the [[DefineOwnProperty]] internal method of A with arguments ToString(k), Property
      // Descriptor {[[Value]]: fromValue, [[Writable]]: true, [[Enumerable]]: true,
      // [[Configurable]]: true}, and false.
      DefineOwnProperty(A, ToString(k), {
        value: fromValue,
        writable: true,
        enumerable: true,
        configurable: true
      }, false)
    }
    // d. Increment k by 1.
    k++
  }
  // 10. Let items be an internal List whose elements are, in left to right order, the portion of the actual argument list starting with item1. The list will be empty if no such items are present.
  var items = []
  for (var i = 2; i < arguments.length; i++) items[i-2] = arguments[i]
  // 11. Let itemCount be the number of elements in items.
  var itemCount = items.length
  // 12. If itemCount < actualDeleteCount, then
  if (itemCount < actualDeleteCount) {
    // a. Let k be actualStart.
    k = actualStart
    // b. Repeat, while k < (len – actualDeleteCount)
    while (k < (len - actualDeleteCount)) {
      // i. Let from be ToString(k+actualDeleteCount).
      var from = ToString(k + actualDeleteCount)
      // ii. Let to be ToString(k+itemCount).
      var to = ToString(k + itemCount)
      // iii. Let fromPresent be the result of calling the [[HasProperty]] internal method of O with argument from.
      var fromPresent = HasProperty(O, from)
      // iv. If fromPresent is true, then
      if (fromPresent) {
        // 1. Let fromValue be the result of calling the [[Get]] internal method of O with
        // argument from.
        var fromValue = O[from]
        // 2. Call the [[Put]] internal method of O with arguments to, fromValue, and true.
        O[to] = fromValue
      }
      // v. Else, fromPresent is false
      else {
        // 1. Call the [[Delete]] internal method of O with arguments to and true.
        delete O[to]
      }
      // vi. Increase k by 1.
      k++
    }
    // c. Let k be len.
    k = len
    // d. Repeat, while k > (len – actualDeleteCount + itemCount)
    while (k > (len - actualDeleteCount + itemCount)) {
      // i. Call the [[Delete]] internal method of O with arguments ToString(k–1) and true.
      delete O[ToString(k-1)]
      // ii. Decrease k by 1.
      k--
    }
  }
  //   13. Else if itemCount > actualDeleteCount, then
  else {
    // a. Let k be (len – actualDeleteCount).
    var k = (len - actualDeleteCount)
    // b. Repeat, while k > actualStart
    while (k > actualStart) {
      // i. Let from be ToString(k + actualDeleteCount – 1).
      var from = ToString(k + actualDeleteCount - 1)
      // ii. Let to be ToString(k + itemCount – 1)
      var to = ToString(k + itemCount - 1)
      // iii. Let fromPresent be the result of calling the [[HasProperty]] internal method of O with argument from.
      var fromPresent = HasProperty(O, from)
      // iv. If fromPresent is true, then
      if (fromPresent) {
        // 1. Let fromValue be the result of calling the [[Get]] internal method of O with
        // argument from.
        var fromValue = O[from]
        //   2. Call the [[Put]] internal method of O with arguments to, fromValue, and true.
        O[to] = fromValue
      }
      // v. Else, fromPresent is false
      else {
        // 1. Call the [[Delete]] internal method of O with argument to and true.
        delete O[to]
      }
			// vi. Decrease k by 1.
			k--
    }
  }
	// 14. Let k be actualStart.
	var k = actualStart
	// 15. Repeat, while items is not empty
	for (var i = 0; i < items.length; i++) {
	  // a. Remove the first element from items and let E be the value of that element.
    var E = items[i]
	  // b. Call the [[Put]] internal method of O with arguments ToString(k), E, and true.
    O[ToString(k)] = E
	  // c. Increase k by 1.
    k++
  }
	// 16. Call the [[Put]] internal method of O with arguments "length", (len – actualDeleteCount + itemCount), and true.
  O.length = (len - actualDeleteCount + itemCount)
	// 17. Return A.
  return A
}

// 15.4.4.14 Array.prototype.indexOf ( searchElement [ , fromIndex ] )
map["Array.prototype.indexOf"] = function(searchElement, fromIndex) {
  // 1. Let O be the result of calling ToObject passing the this value as the argument.
  var O = ToObject(this)
  // 2. Let lenValue be the result of calling the [[Get]] internal method of O with the argument "length".
  var lenValue = O.length
  // 3. Let len be ToUint32(lenValue).
  var len = ToUint32(lenValue)
  // 4. If len is 0, return -1.
  if (len === 0) {
      return -1
  }
  // 5. If argument fromIndex was passed let n be ToInteger(fromIndex); else let n be 0.
  var n = 0
  if (fromIndex !== undefined) {
      n = ToInteger(fromIndex)
  }
  // 6. If n ≥ len, return -1.
  if (n >= len) {
      return -1
  }
  // 7. If n ≥ 0,then
  var k = 0
  if (n >= 0) {
    // a. Let k be n.
    k = n
  }
  // 8. Else, n < 0
  else {
    // a. Let k be len - abs(n).
    k = len - Math.abs(n)
    // b. If k is less than 0, then let k be 0.
    if (k < 0) k = 0
  }
  // 9. Repeat, while k < len
  while (k < len) {
    // a. Let kPresent be the result of calling the [[HasProperty]] internal method of O with argument ToString(k).
    var kPresent = HasProperty(O, ToString(k))
    // b. If kPresent is true, then
    if (kPresent) {
      // i. Let elementK be the result of calling the [[Get]] internal method of O with the argument
      // ToString(k).
      var elementK = O[ToString(k)]
      // ii. Let same be the result of applying the Strict Equality Comparison Algorithm to
      // searchElement and elementK.
      var same = searchElement === elementK
      // iii. If same is true, return k.
      if (same) {
          return k
      }
    }
    // c. Increase k by 1.
    k++
  }
  // 10. Return -1.
  return -1
}

// 15.4.4.15 Array.prototype.lastIndexOf ( searchElement [ , fromIndex ] )
map["Array.prototype.lastIndexOf"] = function(searchElement, fromIndex) {
  // 1. Let O be the result of calling ToObject passing the this value as the argument.
  var O = ToObject(this)
  // 2. Let lenValue be the result of calling the [[Get]] internal method of O with the argument "length".
  var lenValue = O.length
  // 3. Let len be ToUint32(lenValue).
  var len = ToUint32(lenValue)
  // 4. If len is 0, return -1.
  if (len === 0) {
      return -1
  }
  // 5. If argument fromIndex was passed let n be ToInteger(fromIndex); else let n be len-1.
  var n = len - 1
  if (fromIndex !== undefined) {
      n = ToInteger(fromIndex)
  }
  // 6. If n ≥ 0, then let k be min(n,len–1).
  var k = 0
  if (n >= 0) {
      k = Math.min(n, len - 1)
  }
  // 7. Else,n<0
  // a. Let k be len - abs(n).
  else {
      k = len - Math.abs(n)
  }
  // 8. Repeat, while k≥ 0
  while (k >= 0) {
    // a. Let kPresent be the result of calling the [[HasProperty]] internal method of O with argument ToString(k).
    var kPresent = HasProperty(O, ToString(k))
    // b. If kPresent is true, then
    if (kPresent) {
      // i. Let elementK be the result of calling the [[Get]] internal method of O with the argument
      // ToString(k).
      var elementK = O[ToString(k)]
      // ii. Let same be the result of applying the Strict Equality Comparison Algorithm to
      // searchElement and elementK.
      var same = searchElement === elementK
      // iii. If same is true, return k.
      if (same) {
          return k
      }
    }
    // c. Decrease k by 1.
    k--
  }
  // 9. Return -1.
  return -1
}
