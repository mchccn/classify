"use strict";
exports.__esModule = true;
/**
 * Parses a string into a class.
 * Can be called either as a normal function or tagged template literal.
 */
function classify(strings) {
    var _a, _b;
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var code = (typeof strings === "string" ? strings : strings.map(function (s, i) { return s + (values[i] || ""); }).join(""))
        .split("\n")
        .map(function (l) { return l.trimEnd(); })
        .filter(function (l) { return l; });
    if (!/^[a-zA-Z$_][a-zA-Z0-9$_]*\s+\[([a-zA-Z$_][a-zA-Z0-9$_ ]*)?\]$/.test(code[0]))
        throw new Error("First line must be the constructor.");
    var constructorHeader = code.shift();
    if (!constructorHeader)
        throw new Error("Assertion failed: 'constructorHeader' is undefined.");
    var className = constructorHeader.split("[")[0].trim();
    var constructorParams = ((_a = constructorHeader
        .match(/\[(.*)\]/)) === null || _a === void 0 ? void 0 : _a[1].trim().split(/\s+/)) || [];
    var index = code.findIndex(function (l) { return !/^\s+/.test(l); });
    var constructor = code
        .splice(0, index < 0 ? code.length : index)
        .map(function (l) { return l.trim(); })
        .join("\n");
    var methods = "";
    var properties = "";
    while (code.length)
        if (/^(\+)?(=)?[a-zA-Z$_][a-zA-Z0-9$_]*\s+\[([a-zA-Z$_][a-zA-Z0-9$_ ]*)?\]$/.test(code[0])) {
            var methodHeader = code.shift();
            if (!methodHeader)
                throw new Error("Assertion failed: 'methodHeader' is undefined.");
            var methodName = methodHeader.split("[")[0].trim();
            var methodParams = (_b = methodHeader
                .match(/\[(.*)\]/)) === null || _b === void 0 ? void 0 : _b[1].trim().split(/\s+/);
            var index_1 = code.findIndex(function (l) { return !/^\s+/.test(l); });
            var method = code
                .splice(0, index_1 < 0 ? code.length : index_1)
                .map(function (l) { return l.trim(); })
                .join("\n");
            methods += (methodName.startsWith("+")
                ? "static " + (methodName.slice(1).startsWith("=") ? "async " + methodName.slice(2) : methodName.slice(1))
                : methodName.startsWith("=")
                    ? "async " + methodName.slice(1)
                    : methodName) + " (" + methodParams + ") {\n                " + method + "\n            }\n\n";
        }
        else if (/^\+?[a-zA-Z$_][a-zA-Z0-9$_]*\s+=\s+.+/.test(code[0])) {
            var propHeader = code.shift();
            if (!propHeader)
                throw new Error("Assertion failed: 'propHeader' is undefined.");
            var propName = propHeader.split("=")[0].trim();
            properties += (propName.startsWith("+") ? "static " + propName.slice(1) : propName) + " = " + propHeader
                .split("=")[1]
                .trim() + "\n\n";
        }
        else
            code.splice(0, 1);
    return new Function("\n        return class " + className + " {\n            constructor (" + constructorParams.join(", ") + ") {\n                " + constructor + "\n            }\n\n            " + properties + "\n\n            " + methods + "\n        }\n    ")();
}
exports["default"] = classify;
