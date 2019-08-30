#!/usr/bin/env node
"use strict";
':'; //; exec "$(command -v node)" "--experimental-modules" "--no-warnings" "$0" "$@"
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs = __importStar(require("fs"));
var clear = require('clear');
var figlet = require('figlet');
var program = require('commander');
var shell = require("shelljs");
var inquirer = require('inquirer');
var exec = require('shell-exec');
var chdir = require('chdir-promise');
var download = require('download-git-repo');
var dashify = require('dashify');
var pascalcase = require('pascalcase');
var trim = require('str-trim');
var fileHelpers = require('./lib/utils');
var getLastLine = fileHelpers.getLastLine;
var handleAnswers = fileHelpers.handleAnswers;
var ensureDir = fileHelpers.ensureDir;
var insert = fileHelpers.insert;
var moduleTemplate = fileHelpers.moduleClassTemplate;
exec('node --no-warnings `which autorest`\n');
clear();
var welcome = chalk_1.default.red(figlet.textSync('͏HOP-CLI', { horizontalLayout: 'full' }));
program.version('0.0.1');
program
    .command('new <title>')
    .description('Create new HOP application')
    .action(function (title) {
    setTimeout(function () {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'title',
                message: "Project Description:"
            },
            {
                type: 'input',
                name: 'locale',
                message: "Project Description:",
                default: function () {
                    return 'fa';
                }
            },
            {
                type: 'list',
                name: 'hd',
                message: 'TV Type?',
                choices: ['HD', 'SD'],
                filter: function (val) {
                    return val.toLowerCase();
                }
            },
            {
                type: 'number',
                name: 'resolution',
                message: "TV Resolution?",
                default: function () {
                    return 720;
                },
                filter: function (val) {
                    return '' + parseInt(val);
                }
            },
            {
                type: 'input',
                name: 'timezone',
                message: 'Your Timezone:',
                default: function () {
                    return 'Asia/Tehran';
                }
            },
            {
                type: 'list',
                name: 'exitMethod',
                message: 'What should exit button do to application?',
                choices: ['Hide', 'Destroy'],
                filter: function (val) {
                    return val.toLowerCase();
                }
            },
            {
                type: 'confirm',
                name: 'autoStart',
                message: 'Should project be auto-start or show red button, etc. first?',
                default: function () {
                    return false;
                }
            }
        ])
            .then(function (answers) {
            var path = './' + dashify(title, { condensed: true });
            ensureDir(path).then(function () {
                console.log('1/3 - Downloading latest source code of HOP from GitHub.');
                download('faridv/hop', path, function (error) {
                    console.log(error ? 'Error: ' + error : '      Repository downloaded successfully.');
                    chdir.to(path).then(function () {
                        answers = handleAnswers(answers);
                        console.log('2/3 - Updating config.json based on your inputs.');
                        var rawConfig = fs.readFileSync('config.json');
                        var config = JSON.parse(rawConfig);
                        var newConfig = __assign({}, config, answers);
                        fs.writeFile('config.json', JSON.stringify(newConfig, null, '\t'), function (err) {
                            if (err) {
                                console.log('Faced error while writing the config file.', err);
                            }
                            else {
                                console.log('      Repository downloaded successfully.');
                                console.log('3/3 - Installing HOP');
                                exec('npm install').then(function () {
                                    console.log('      Project installed successfully.');
                                    chalk_1.default.green(figlet.textSync('Have fun!', { horizontalLayout: 'full' }));
                                }).catch(function (err) {
                                    console.log('Error installing application', err);
                                    console.log('Please manually run "npm install" or "yarn install"');
                                });
                            }
                        });
                    });
                });
            });
        });
    }, 1000);
});
program
    .command('module <title>')
    .description('generate a module')
    .option('-i, --inline', 'when not given a separate file for template will be generated.')
    .action(function (title, cmdObj) {
    var moduleName = pascalcase(title + "-Module");
    var configPath = './config.json';
    var modulesPath = './src/modules.ts';
    var modulesFolder = './src/modules';
    console.log("This process will guide you through building " + title + " module");
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'title',
            message: "Module Title:",
            default: function () {
                return title;
            }
        },
        {
            type: 'input',
            name: 'icon',
            message: "Module Icon:",
            default: function () {
                return 'square';
            }
        }
    ])
        .then(function (answers) {
        var params = {
            title: answers.title,
            type: title,
            icon: answers.icon
        };
        fs.readFile(configPath, function (err, data) {
            if (err)
                throw err;
            var config = JSON.parse(data);
            if (typeof config.applications[0].modules === 'undefined')
                config.applications[0]['modules'] = [];
            var error = false;
            config.applications[0]['modules'].forEach(function (moduleConf) {
                if (moduleConf.type === params.type) {
                    error = true;
                }
            });
            if (error) {
                console.log('Module with the same name already exists.');
                process.exit(100);
            }
            config.applications[0]['modules'].push(params);
            fs.writeFile(configPath, JSON.stringify(config, null, '\t'), function (err) {
                // err || console.log('Data replaced \n', data);
                console.log('1/3 - Config file updated.');
                var fileLines = fs.readFileSync(modulesPath).toString().split("\n");
                // import
                var importsLastLine = 0;
                for (var i in fileLines) {
                    var j = ~~i + 1;
                    if (fileLines[i].indexOf('import') !== -1 && fileLines[j].trim().length < 1) {
                        fileLines = insert(fileLines, j, "import " + moduleName + " from \"./modules/" + params.type + "/" + params.type + ".module\";");
                        importsLastLine = j;
                        break;
                    }
                }
                // definition
                for (var k in fileLines) {
                    if (~~k > importsLastLine) {
                        var l = ~~k + 1;
                        if (fileLines[k].indexOf('Module') !== -1 && fileLines[l].trim().length < 3) {
                            fileLines = insert(fileLines, l, "\t'" + params.type + "': " + moduleName + ",");
                            break;
                        }
                    }
                }
                fs.writeFile(modulesPath, fileLines.join('\n'), function (err) {
                    console.log('2/3 - Modules list updated.');
                    ensureDir(modulesFolder + ("/" + params.type)).then(function () {
                        var templateData = { moduleName: moduleName, modulePascalCased: pascalcase(params.type) };
                        var fileContents = moduleTemplate.replace('{{moduleName}}', templateData.moduleName)
                            .replace('{{modulePascalCased}}', templateData.modulePascalCased);
                        var moduleFileFullPath = modulesFolder + ("/" + params.type + "/" + params.type + ".module.ts");
                        fs.writeFile(moduleFileFullPath, fileContents, function (err) {
                            console.log('3/3 - Module folder and file created successfully.');
                            console.log('      Your module file is located here: ' + moduleFileFullPath);
                        });
                    });
                });
            });
        });
    });
});
program
    .command('serve')
    .description('Serve existing HOP project.')
    .action(function (cmdObj) {
    shell.exec("npm run start");
});
program
    .command('build')
    .description('Build existing HOP project for production use.')
    .action(function (cmdObj) {
    shell.exec("npm run build");
});
program.on('command:*', function () {
    console.error("Invalid command: " + program.args.join());
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    clear();
    console.log(welcome);
    program.outputHelp();
}
