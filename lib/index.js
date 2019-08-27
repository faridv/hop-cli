#!/usr/bin/env node
"use strict";
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
var shell = require("shelljs");
clear();
var welcome = chalk.red(figlet.textSync('● ͏HOP-CLI', { horizontalLayout: 'full' }));
program.version('0.0.1');
program
    .command('new <title>')
    .description('create new HOP application with given title.')
    .action(function (title) {
    console.log("shall create new app called " + title + ".");
    // shell.exec("npm init");
});
program
    .command('module <title>')
    .description('generate a module width given title.')
    .option('-i, --inline', 'when not given a separate file for template will be generated.')
    .action(function (title, cmdObj) {
    console.log("shall create new " + title + " with arguments: " + cmdObj.inline);
});
// program
//     .description("This application will help you create new or manage existing hop application.")
//     .option('-n, --cheese <type>', 'Add the specified type of cheese [marble]')
//     .option('-p, --peppers', 'Add peppers')
//     .option('-P, --pineapple', 'Add pineapple')
//     .option('-b, --bbq', 'Add bbq sauce')
//     .option('-C, --no-cheese', 'You do not want any cheese')
//     .parse(process.argv);
//
// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbq) console.log('  - bbq');
//
// const cheese: string = true === program.cheese
//     ? 'marble'
//     : program.cheese || 'no';
//
// console.log('  - %s cheese', cheese);
program.on('command:*', function () {
    console.error("Invalid command: " + program.args.join());
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    clear();
    console.log(welcome);
    program.outputHelp();
}
