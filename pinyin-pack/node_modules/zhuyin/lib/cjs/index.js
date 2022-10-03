"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPinyin = exports.toPinyinSyllable = exports.splitZhuyin = exports.fromPinyin = exports.fromPinyinSyllable = exports.toneMarks = void 0;
const pinyin_utils_1 = require("pinyin-utils");
const pinyin_split_1 = __importDefault(require("pinyin-split"));
const py2zy_1 = __importDefault(require("./py2zy"));
exports.toneMarks = ["", "ˊ", "ˇ", "`", "˙"];
const fromPinyinSyllable = (pinyin) => {
    let zy = py2zy_1.default[pinyin_utils_1.removeTone(pinyin).toLowerCase()];
    return zy + exports.toneMarks[pinyin_utils_1.getToneNumber(pinyin) - 1];
};
exports.fromPinyinSyllable = fromPinyinSyllable;
const fromPinyin = (input, everything = false) => {
    const translate = (pinyin) => {
        return pinyin_split_1.default(pinyin, everything).map(item => {
            if (everything) {
                if (typeof item === 'string')
                    return item;
                else {
                    return exports.fromPinyinSyllable(item[0]);
                }
            }
            else {
                return exports.fromPinyinSyllable(item);
            }
        });
    };
    if (typeof input === 'string')
        return translate(input);
    else
        return input.map(translate);
};
exports.fromPinyin = fromPinyin;
const splitZhuyin = (zhuyin, everything = false) => {
    const list = [];
    let index = 0;
    while (index < zhuyin.length) {
        let count = zhuyin.length - index;
        let wordFound = false;
        while (count > 1) {
            let word = zhuyin.substr(index, count);
            if (Object.values(py2zy_1.default).includes(word)) { // word found
                wordFound = true;
                if (exports.toneMarks.includes(zhuyin[index + count])) { // tone found after word
                    word += zhuyin[index + count];
                    count++;
                }
                list.push(everything ? [word] : word);
                index += count - 1;
                break;
            }
            count--;
        }
        if (!wordFound && everything) {
            if (index === 0 || typeof list[list.length - 1] === 'object') {
                list.push(zhuyin[index]);
            }
            else if (typeof list[list.length - 1] === 'string') {
                list[list.length - 1] += zhuyin[index];
            }
        }
        index++;
    }
    return list;
};
exports.splitZhuyin = splitZhuyin;
const toPinyinSyllable = (zhuyin) => {
    let tone = exports.toneMarks.indexOf(zhuyin[zhuyin.length - 1]) + 1;
    if (tone > 0) {
        zhuyin = zhuyin.substr(0, zhuyin.length - 1);
    }
    else {
        tone = 1;
    }
    let pinyinIndex = Object.values(py2zy_1.default).indexOf(zhuyin);
    if (pinyinIndex > -1) {
        return Object.keys(py2zy_1.default)[pinyinIndex] + tone;
    }
    else {
        return zhuyin;
    }
};
exports.toPinyinSyllable = toPinyinSyllable;
const toPinyin = (zhuyin, opts = {}) => {
    let list = exports.splitZhuyin(zhuyin, opts.everything);
    if (!opts.everything)
        list = list.filter(item => typeof item === 'string');
    list = list.map(item => {
        if (opts.everything && typeof item === 'string')
            return item;
        else if (typeof item !== 'string')
            item = item[0];
        const pinyin = exports.toPinyinSyllable(item);
        if (opts.numbered)
            return (opts.everything ? [pinyin] : pinyin);
        else if (opts.everything)
            return [pinyin_utils_1.numberToMark(pinyin)];
        else
            return pinyin_utils_1.numberToMark(pinyin);
    });
    return list;
};
exports.toPinyin = toPinyin;
exports.default = exports.fromPinyin;
