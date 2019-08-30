"use strict";
// fileTools.js
var fs = require('fs');
var readline = require('readline');
var Stream = require('stream');
var fsPromises = require('fs').promises;
module.exports = {
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
    }
};
