"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.decompose = exports.decomposeBlock = exports.decomposeCompatibilityJamo = exports.compose = exports.composeBlock = exports.composeSyllable = exports.composeJamo = exports.finalJamoOffset = exports.medialJamoOffset = exports.initialJamoOffset = exports.isFinalJamo = exports.isMedialJamo = exports.isInitialJamo = exports.jamo = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var util_1 = require("./util");
// TODO: double type option for doubles (ㅃㅉㄸㄲㅆ)
// TODO: switch to bi directional maps
exports.jamo = {
    single: [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ',
        'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'
    ],
    initial: [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ],
    medial: [
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ',
        'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ',
        'ㅛ',
        'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ',
        'ㅠ',
        'ㅡ', 'ㅢ',
        'ㅣ'
    ],
    final: [
        'ㄱ', 'ㄲ', 'ㄳ',
        'ㄴ', 'ㄵ', 'ㄶ',
        'ㄷ',
        'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
        'ㅁ',
        'ㅂ', 'ㅄ',
        'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
    ],
    decompositionMaps: {
        'ㅘ': ['ㅗ', 'ㅏ'],
        'ㅙ': ['ㅗ', 'ㅐ'],
        'ㅚ': ['ㅗ', 'ㅣ'],
        'ㅝ': ['ㅜ', 'ㅓ'],
        'ㅞ': ['ㅜ', 'ㅔ'],
        'ㅟ': ['ㅜ', 'ㅣ'],
        'ㅢ': ['ㅡ', 'ㅣ'],
        'ㄳ': ['ㄱ', 'ㅅ'],
        'ㄵ': ['ㄴ', 'ㅈ'],
        'ㄶ': ['ㄴ', 'ㅎ'],
        'ㄺ': ['ㄹ', 'ㄱ'],
        'ㄻ': ['ㄹ', 'ㅁ'],
        'ㄼ': ['ㄹ', 'ㅂ'],
        'ㄽ': ['ㄹ', 'ㅅ'],
        'ㄾ': ['ㄹ', 'ㅌ'],
        'ㄿ': ['ㄹ', 'ㅍ'],
        'ㅀ': ['ㄹ', 'ㅎ'],
        'ㅄ': ['ㅂ', 'ㅅ']
    },
    complexMaps: {
        'ㅗ': {
            'ㅏ': 'ㅘ',
            'ㅐ': 'ㅙ',
            'ㅣ': 'ㅚ'
        },
        'ㅜ': {
            'ㅓ': 'ㅝ',
            'ㅔ': 'ㅞ',
            'ㅣ': 'ㅟ'
        },
        'ㅡ': {
            'ㅣ': 'ㅢ'
        },
        'ㄱ': {
            'ㅅ': 'ㄳ'
        },
        'ㄴ': {
            'ㅈ': 'ㄵ',
            'ㅎ': 'ㄶ'
        },
        'ㄹ': {
            'ㄱ': 'ㄺ',
            'ㅁ': 'ㄻ',
            'ㅂ': 'ㄼ',
            'ㅅ': 'ㄽ',
            'ㅌ': 'ㄾ',
            'ㅍ': 'ㄿ',
            'ㅎ': 'ㅀ'
        },
        'ㅂ': {
            'ㅅ': 'ㅄ'
        }
    }
};
function isInitialJamo(j) {
    return exports.jamo.initial.includes(j);
}
exports.isInitialJamo = isInitialJamo;
function isMedialJamo(j) {
    return exports.jamo.medial.includes(j);
}
exports.isMedialJamo = isMedialJamo;
function isFinalJamo(j) {
    return exports.jamo.final.includes(j);
}
exports.isFinalJamo = isFinalJamo;
function initialJamoOffset(j) {
    return exports.jamo.initial.indexOf(j);
}
exports.initialJamoOffset = initialJamoOffset;
function medialJamoOffset(j) {
    return exports.jamo.medial.indexOf(j);
}
exports.medialJamoOffset = medialJamoOffset;
function finalJamoOffset(j) {
    return exports.jamo.final.indexOf(j);
}
exports.finalJamoOffset = finalJamoOffset;
function composeJamo(prefix, postfix) {
    if (prefix === undefined)
        return undefined;
    if (postfix === undefined)
        return undefined;
    var prefixMap = exports.jamo.complexMaps[prefix];
    if (prefixMap === undefined)
        return undefined;
    var complex = prefixMap[postfix];
    if (complex === undefined)
        return undefined;
    return prefixMap[postfix];
}
exports.composeJamo = composeJamo;
function composeSyllable(initial, medial, final) {
    var i = initialJamoOffset(initial);
    var m = medialJamoOffset(medial);
    var f = final ? finalJamoOffset(final) + 1 : 0;
    var c = (i * 588 + m * 28 + f) + 0xac00;
    return 0xac00 <= c && c <= 0xD7A3 ? String.fromCodePoint(c) : undefined;
}
exports.composeSyllable = composeSyllable;
var composeBlock = function (input) {
    var data = Array.isArray(input) ? __spreadArray([], input, true) : input.split("");
    var i = undefined;
    var m = undefined;
    var f = undefined;
    var cc = undefined;
    var buf = (0, util_1.buffer)(data);
    while (!buf.isEmpty()) {
        var p = buf.peek();
        if (i === undefined) {
            if (isInitialJamo(p)) {
                var p2 = buf.peek(2);
                if (p2 === undefined)
                    break;
                if (!isMedialJamo(p2)) {
                    cc = buf.consume();
                    break;
                }
                i = buf.consume();
                continue;
            }
            if (isMedialJamo(p)) {
                var p2 = buf.peek(2);
                if (p2 === undefined)
                    break;
                cc = buf.consume();
                var cm = composeJamo(p, p2);
                if (cm === undefined)
                    break;
                cc = cm;
                buf.consume();
                break;
            }
        }
        if (m === undefined) {
            if (isMedialJamo(p)) {
                var c = buf.consume();
                var p_1 = buf.peek();
                if (p_1 === undefined) {
                    m = c;
                    break;
                }
                var cm = composeJamo(c, p_1);
                if (cm) {
                    buf.consume();
                    m = cm;
                    continue; // ?
                }
                m = c;
                continue;
            }
            break;
        }
        if (f === undefined) {
            if (!isFinalJamo(p))
                break;
            var p2 = buf.peek(2);
            if (p2 === undefined) {
                f = buf.consume();
                break;
            }
            var cf = composeJamo(p, p2);
            if (cf) {
                var p3 = buf.peek(3);
                var c = buf.consume();
                if (p3 && isMedialJamo(p3)) {
                    f = c;
                    break; // recursion??
                }
                f = cf;
                buf.consume();
                break;
            }
            if (isMedialJamo(p2))
                break;
            f = buf.consume();
            break;
        }
    }
    // deductive logic
    if (cc)
        return __spreadArray([cc], buf.data(), true);
    if (i && m) {
        var syl = composeSyllable(i, m, f);
        // TODO: consider throwing error (or alt fn that does)
        if (syl === undefined)
            return [''];
        if (buf.isEmpty())
            return [syl];
        return __spreadArray([syl], buf.data(), true);
    }
    if (buf.isEmpty())
        return [''];
    return __spreadArray([], buf.data(), true);
};
exports.composeBlock = composeBlock;
// TODO: dunno how I feel about this, promise version?
var compose = function (blocks, maxIterations) {
    if (maxIterations === void 0) { maxIterations = 1000; }
    var result = [];
    var b = blocks;
    var i = 0;
    while (b.length) {
        i++;
        if (i > maxIterations)
            break;
        var _a = composeBlock(b), block = _a[0], rest = _a.slice(1);
        result.push(block);
        b = rest;
    }
    return result;
};
exports.compose = compose;
var decomposeCompatibilityJamo = function (cjamo) {
    return exports.jamo.decompositionMaps[cjamo];
};
exports.decomposeCompatibilityJamo = decomposeCompatibilityJamo;
var decomposeBlock = function (block) {
    var code = block.charCodeAt(0);
    if (0xac00 <= code && code <= 0xD7A3) {
        var c = code - 0xac00;
        var fc = c % 28;
        var i = Math.floor(c / 588);
        var m = (c - fc) % 588 / 28;
        var f = fc ? fc - 1 : undefined;
        var initial = exports.jamo.initial[i];
        var decomposedMedial = decomposeCompatibilityJamo(exports.jamo.medial[m]);
        var medial = decomposedMedial !== null && decomposedMedial !== void 0 ? decomposedMedial : [exports.jamo.medial[m]];
        if (f !== undefined) {
            var decomposedFinal = decomposeCompatibilityJamo(exports.jamo.final[f]);
            var final = decomposedFinal !== null && decomposedFinal !== void 0 ? decomposedFinal : [exports.jamo.final[f]];
            return __spreadArray(__spreadArray([initial], medial, true), final, true);
        }
        return __spreadArray([initial], medial, true);
    }
    var decomposedCompatibilityJamo = decomposeCompatibilityJamo(block);
    return decomposedCompatibilityJamo !== null && decomposedCompatibilityJamo !== void 0 ? decomposedCompatibilityJamo : [block];
};
exports.decomposeBlock = decomposeBlock;
var decompose = function (blocks) {
    var result = [];
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        result.push.apply(result, decomposeBlock(block));
    }
    return result;
};
exports.decompose = decompose;
