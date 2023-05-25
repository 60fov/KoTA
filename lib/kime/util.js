"use strict";
exports.__esModule = true;
exports.buffer = void 0;
function buffer(_a) {
    var data = _a.slice(0);
    return {
        data: function () { return data; },
        isEmpty: function () { return data.length == 0; },
        consume: function () { return data.shift(); },
        peek: function (i) {
            if (i === void 0) { i = 1; }
            return data.length > i - 1 ? data[i - 1] : undefined;
        }
    };
}
exports.buffer = buffer;
