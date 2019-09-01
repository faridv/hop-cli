<h1 align="center">HOP-CLI</h1>
<h3 align="center">A command line interface for <a href="https://github.com/faridv/hop">HOP</a></h3>

[![Dependencies](https://david-dm.org/faridv/hop-cli/status.svg)](https://david-dm.org/faridv/hop-cli)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/faridv/hop-cli/raw/master/LICENSE)

## The idea
The HOP CLI creates, manages, builds and runs your HOP-based projects. The idea behind it was from Angular-CLI which helps developers create and manage their projects in no time. I created this project so you can easily install a HOP instance with your desired config with just one command.

## Prerequisites

Both the CLI and generated project have dependencies that require Node 10 or higher, together
with NPM 5.5.1 or higher. It is recommended to update your node Node and NPM to latest version before running this application.
Running the application using lower versions of Node and NPM has not been tested yet; It might work, but you might face some warnings about the experimental features of Node API.

## Table of Contents

* [Installation](#installation)
* [Generating and serving](#generating-and-serving-a-hop-project-via-a-development-server)
* [Compiling/Building](#compiling-the-application)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

### Install globally (recommended)
```bash
npm install -g @hbbtv/hop-cli
```

### Install locally
```bash
npm install @hbbtv/hop-cli
```

To run a locally installed version of the hop-cli, you can call `hop` commands directly by adding the `.bin` folder within your local `node_modules` folder to your PATH. The `node_modules` and `.bin` folders are created in the directory where `npm install @hbbtv/hop-cli` was run upon completion of the install command.

## Generating and serving a HOP project via a development server

```bash
hop new PROJECT-NAME
cd PROJECT-NAME
hop serve
```
Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

### Generating modules

You can use the `hop module` command to generate HOP modules:

```bash
hop module my-new-module

# your module will be generated in src/modules/my-new-module
```

To update HOP CLI to a new version, you must update both the global package and your project's local package.

Global package:
```bash
npm uninstall -g @hbbtv/hop-cli
npm cache verify
# if npm version is < 5 then use `npm cache clean`
npm install -g @hbbtv/hop-cli@latest
```

## Compiling the application

You can use the `hop build` command to build your HOP application:

```bash
hop build

# your built app will be in dist folder
```

After building your application, you can copy contents of `dist` folder to your web-server root folder and use the URL in AIT table of transponder.
