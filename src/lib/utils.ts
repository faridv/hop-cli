// fileTools.js
const fs = require('fs');
const readline = require('readline');
const Stream = require('stream');
const fsPromises = require('fs').promises;

module.exports = {
    moduleClassTemplate: `import {Module} from '../../libs/module';

export default class {{moduleName}} extends Module {

    template = \`<section class="module info"><h1>Module {{modulePascalCased}} works!</h1></section>\`;

    constructor(config: any = {}, layoutInstance?) {
        super(config, layoutInstance);
        this.render();
        return this;
    }

    render(callback?): void {
        this.templateHelper.render(this.template, {}, this.$el, 'html');
    }

}`,
    getLastLine: function (fileName: any, minLength: any) {
        let inStream = fs.createReadStream(fileName);
        let outStream = new Stream;
        return new Promise(function (resolve, reject) {
            let rl = readline.createInterface(inStream, outStream);
            let lastLine = '';
            rl.on('line', function (line: any) {
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
    handleAnswers: function (answers: any) {
        answers.hd = answers.hd == 'hd';
        return answers;
    },
    ensureDir: function (path: any) {
        return fsPromises.mkdir(path, {recursive: true}, function (err: any) {
            if (err.code === 'EEXIST') {
                return Promise.resolve()
            } else {
                return Promise.reject(err)
            }
        })
    },
    insert: function(arr: any, index: number, newItem: any) {
        return [
            // part of the array before the specified index
            ...arr.slice(0, index),
            // inserted item
            newItem,
            // part of the array after the specified index
            ...arr.slice(index)
        ];
    }
};
