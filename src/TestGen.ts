// generate a JSON for dynamic tests
// TODO extend it for functions.
// TODO extend it for non-pure function.
// TODO handling exception case.
export function jsonGen(func, thisVal, args, filename="") {
    // type checks
    if (typeof func !== "function") err("'func' should have a function type.");
    if (!Array.isArray(args)) err("'args' should have an array type.");

    // initial record
    var record = {};
    var addr_count = 0;

    // built-in locations
    // TODO fill out
    var predefLocs = {
        "#Object": Object,
        "#Object.prototype": Object.prototype,
        "#Function": Function,
        "#Function.prototype": Function.prototype,
        "#Array": Array,
        "#Array.prototype": Array.prototype,
        "#Array.prototype.push": Array.prototype.push
    };

    // generate input
    var input = {
        "thisVal": convert(thisVal),
        "arguments": convert(getArg(args)),
        "heap": getHeap()
    };

    // generate output
    var result = func.apply(thisVal, args);
    var output = {
        "value": convert(result),
        "heap": getHeap()
    };

    // final json
    var json = {
        "input": input,
        "output": output
    };

    // display or download the final JSON
    var data = JSON.stringify(json, null, 4);
    if (filename) {
    } else {
        return data;
    }

    // covert to possible formats
    function convert(value) {
        var type = typeof value;
        if (type === 'undefined') {
            return '@undef';
        } else if (type === 'boolean') {
            return value;
        } else if (type === 'number') {
            if (value === NaN) return '@NaN';
            else if (value === Infinity) return '@PosInf';
            else if (value === -Infinity) return '@NegInf';
            return value;
        } else if (type === 'string') {
            return value;
        } else if (type === 'object' || type === 'function') {
            if (value === null) {
                return null;
            } else {
                var loc = find(value, predefLocs);
                if (loc === null) loc = find(value, record);
                if (loc === null) {
                    loc = '#' + (++addr_count);
                    record[loc] = value;
                    var props = Object.getOwnPropertyNames(value);
                    for (var i = 0; i < props.length; i++){
                        convert(getDesc(value, props[i]).value);
                    }
                    convert(getProto(value));
                }
                return loc;
            }

            // TODO handling function
        } else {
            notSupport('to convert host object: ' + value);
        }
    }

    // find location in a given table
    function find(obj, table) {
        for (var loc in table) {
            if (table[loc] === obj)
                return loc;
        }
        return null;
    }

    // get heap from record
    function getHeap() {
        // check
        for (var loc in record) {
            convert(record[loc]);
        }

        // convert
        var heap = {};
        for (var loc in record) {
            var obj = {};
            var given = record[loc];
            var props = Object.getOwnPropertyNames(given);
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                var desc = getDesc(given, prop);
                if (desc.hasOwnProperty('value'))
                    desc.value = convert(desc.value);
                obj[prop] = desc;
            }
            obj["[[Class]]"] = getClass(given);
            obj["[[Prototype]]"] = convert(getProto(given));
            obj["[[Extensible]]"] = getIsExt(given);
            var primVal = getPrimVal(given);
            if (primVal) obj["[[PrimitiveValue"] = primVal;
            heap[loc] = obj;
        }
        return heap;
    }

    // get [[Class]]
    function getClass(obj) {
        var str = Object.prototype.toString.call(obj);
        return str.substring(8, str.length-1);
    }

    // get [[Prototype]]
    function getProto(obj) { return Object.getPrototypeOf(obj); }

    // get [[Extensible]]
    function getIsExt(obj) { return Object.isExtensible(obj); }

    // get [[PrimitiveValue]]
    function getPrimVal(obj) {
        if (obj instanceof Number ||
                obj instanceof String ||
                obj instanceof Boolean ||
                obj instanceof Date) return obj.valueOf();
        if (obj === Date.prototype) return NaN;
    }

    // get arguments
    function getArg(args) {
        var argObj;
        function f() { argObj = arguments; }
        f.apply(undefined, args);
        argObj.callee = func;
        return argObj;
    }

    // get descriptor
    function getDesc(obj, prop) {
        return Object.getOwnPropertyDescriptor(obj, prop);
    }

    // errors
    function err(msg) { throw Error(msg); }
    function notSupport(msg) { console.error('Not supported yet: ' + msg); }
}
