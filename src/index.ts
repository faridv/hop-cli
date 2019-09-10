#!/usr/bin/env node
':' //; exec "$(command -v node)" "--experimental-modules" "--no-warnings" "$0" "$@"

import chalk from 'chalk';
import * as fs from 'fs';

const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');
const shell = require("shelljs");
const inquirer = require('inquirer');
const exec = require('shell-exec');
const chdir = require('chdir-promise');
const download = require('download-git-repo');
const dashify = require('dashify');
const pascalcase = require('pascalcase');
const trim = require('str-trim');

const fileHelpers = require('./lib/utils');
const getLastLine = fileHelpers.getLastLine;
const handleAnswers = fileHelpers.handleAnswers;
const ensureDir = fileHelpers.ensureDir;
const insert = fileHelpers.insert;
const moduleTemplate = fileHelpers.moduleClassTemplate;

exec('node --no-warnings `which autorest`\n');

clear();
const welcome = chalk.red(figlet.textSync('͏HOP-CLI', {horizontalLayout: 'full'}));

program.version('0.0.1');
program
    .command('new <title>')
    .description('Create new HOP application')
    .action((title: any) => {
        setTimeout(() => {
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
                        message: "Project Locale:",
                        default: function () {
                            return 'fa';
                        }
                    },
                    {
                        type: 'list',
                        name: 'hd',
                        message: 'TV Type?',
                        choices: ['HD', 'SD'],
                        filter: function (val: any) {
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
                        filter: function (val: any) {
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
                        filter: function (val: any) {
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
                .then((answers: any) => {
                    const path = './' + dashify(title, {condensed: true});
                    ensureDir(path).then(() => {
                        console.log('1/3 - Downloading latest source code of HOP from GitHub.');
                        download('faridv/hop', path, function (error: any) {
                            console.log(error ? 'Error: ' + error : '      Repository downloaded successfully.');
                            chdir.to(path).then(function () {
                                answers = handleAnswers(answers);
                                console.log('2/3 - Updating config.json based on your inputs.');
                                const rawConfig: any = fs.readFileSync('config.json');
                                const config: any = JSON.parse(rawConfig);
                                const newConfig: any = {...config, ...answers};
                                fs.writeFile('config.json', JSON.stringify(newConfig, null, '\t'), function (err) {
                                    if (err) {
                                        console.log('Faced error while writing the config file.', err);
                                    } else {
                                        console.log('      Repository downloaded successfully.');
                                        console.log('3/3 - Installing HOP');
                                        exec('npm install').then(() => {
                                            console.log('      Project installed successfully.');
                                            chalk.green(figlet.textSync('Have fun!', {horizontalLayout: 'full'}));
                                        }).catch((err: any) => {
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
    .action((title: string, cmdObj: any) => {
        let moduleName = pascalcase(`${title}-Module`);
        const configPath = './config.json';
        const modulesPath = './src/modules.ts';
        const modulesFolder = './src/modules';
        console.log(`This process will guide you through building ${title} module`);
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
            .then((answers: any) => {
                const params = {
                    title: answers.title,
                    type: title,
                    icon: answers.icon
                };
                fs.readFile(configPath, function (err: any, data: any) {
                    if (err) throw err;
                    const config = JSON.parse(data);
                    if (typeof config.applications[0].modules === 'undefined')
                        config.applications[0]['modules'] = [];
                    let error: boolean = false;
                    config.applications[0]['modules'].forEach((moduleConf: any) => {
                        if (moduleConf.type === params.type) {
                            error = true;
                        }
                    });
                    if (error) {
                        console.log('Module with the same name already exists.');
                        process.exit(100);
                    }
                    config.applications[0]['modules'].push(params);
                    fs.writeFile(configPath, JSON.stringify(config, null, '\t'), function (err: any) {
                        // err || console.log('Data replaced \n', data);
                        console.log('1/3 - Config file updated.');
                        let fileLines = fs.readFileSync(modulesPath).toString().split("\n");
                        // import
                        let importsLastLine = 0;
                        for (let i in fileLines) {
                            let j = ~~i + 1;
                            if (fileLines[i].indexOf('import') !== -1 && fileLines[j].trim().length < 1) {
                                fileLines = insert(fileLines, j, `import ${moduleName} from "./modules/${params.type}/${params.type}.module";`);
                                importsLastLine = j;
                                break;
                            }
                        }
                        // definition
                        for (let k in fileLines) {
                            if (~~k > importsLastLine) {
                                let l = ~~k + 1;
                                if (fileLines[k].indexOf('Module') !== -1 && fileLines[l].trim().length < 3) {
                                    fileLines = insert(fileLines, l, `\t'${params.type}': ${moduleName},`);
                                    break;
                                }
                            }
                        }
                        fs.writeFile(modulesPath, fileLines.join('\n'), function (err: any) {
                            console.log('2/3 - Modules list updated.');

                            ensureDir(modulesFolder + `/${params.type}`).then(() => {
                                const templateData = {moduleName: moduleName, modulePascalCased: pascalcase(params.type)};
                                const fileContents = moduleTemplate.replace('{{moduleName}}', templateData.moduleName)
                                    .replace('{{modulePascalCased}}', templateData.modulePascalCased);
                                const moduleFileFullPath = modulesFolder + `/${params.type}/${params.type}.module.ts`;
                                fs.writeFile(moduleFileFullPath, fileContents, function (err: any) {
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
    .action((cmdObj: any) => {
        exec("npm run start");
    });

program
    .command('build')
    .description('Build existing HOP project for production use.')
    .action((cmdObj: any) => {
        exec("npm run build");
    });

program.on('command:*', () => {
    console.error(`Invalid command: ${program.args.join()}`);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    clear();
    console.log(welcome);
    program.outputHelp();
}