"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// fileTools.js
var fs = require('fs');
var readline = require('readline');
var Stream = require('stream');
var fsPromises = require('fs').promises;
module.exports = {
    moduleClassTemplate: "import {Module} from '../../libs/module';\n\nexport default class {{moduleName}} extends Module {\n\n    template = `<section class=\"module info\"><h1>Module {{modulePascalCased}} works!</h1></section>`;\n\n    constructor(config: any = {}, layoutInstance?) {\n        super(config, layoutInstance);\n        this.render();\n        return this;\n    }\n\n    render(callback?): void {\n        this.templateHelper.render(this.template, {}, this.$el, 'html');\n    }\n\n}",
    getLastLine: function (fileName, minLength) {
        var inStream = fs.createReadStream(fileName);
        var outStream = new Stream;
        return new Promise(function (resolve, reject) {
            var rl = readline.createInterface(inStream, outStream);
            var lastLine = '';
            rl.on('line', function (line) {
                if (line.length >= minLength) {
                    lastLine = line;
                }
            });
            rl.on('error', reject);
            rl.on('close', function () {
                resolve(lastLine);
            });
        });
    },
    handleAnswers: function (answers) {
        answers.hd = answers.hd == 'hd';
        return answers;
    },
    ensureDir: function (path) {
        return fsPromises.mkdir(path, { recursive: true }, function (err) {
            if (err.code === 'EEXIST') {
                return Promise.resolve();
            }
            else {
                return Promise.reject(err);
            }
        });
    },
    insert: function (arr, index, newItem) {
        return __spreadArrays(arr.slice(0, index), [
            // inserted item
            newItem
        ], arr.slice(index));
    }
};
