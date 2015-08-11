#! /usr/bin/env node
'use strict';

var fs = require('fs');
var _ = require('lodash');
require('shelljs/global');

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}

var args = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    a: 'addfile'
  }
});

console.log(args);

if (args.help) {
  printHelp();
}

if (args.version) {
  console.log(require('./package.json').version);
  process.exit();
}

if (args.init) {
  gitCommand('init');
  '*'.to('.gitignore');
  '\n!.gitignore'.toEnd('.gitignore');
  exitContext();
  echo('created .ssdm and .ssdmignore');
  process.exit();
}

if (args.addfile) {
  enterContext();
  appendIgnore(args.addfile);
  exitContext();
  process.exit();
}

if (args.git) {
  enterContext();
  gitCommand(args.git);
  exitContext();
  process.exit();
}

// else
printHelp();

function enterContext() {
  if (_.isEmpty(ls('.gitignore'))) {
    mv('.ssdmignore', '.gitignore');
  } else {
    fileExistsExit('.gitignore');
  }
  if (_.isEmpty(ls('.git'))) {
    mv('.ssdm', '.git');
  } else {
    fileExistsExit('.git');
  }
}

function exitContext() {
  if (_.isEmpty(ls('.ssdmignore'))) {
    mv('.gitignore', '.ssdmignore');
  } else {
    fileExistsExit('.ssdmignore');
  }
  if (_.isEmpty(ls('.ssdm'))) {
    mv('.git', '.ssdm');
  } else {
    fileExistsExit('.ssdm');
  }
}

function fileExistsExit(filename) {
  console.log(filename, ' already exists -- exiting without mv');
  exit(2);
}

function gitCommand(command) {
  if (exec('git ' + command).code !== 0) {
    echo('Error: \'git ' + command + '\' failed');
    exit(1);
  }
}

function appendIgnore(toAppend) {
  if (_.isEmpty(toAppend)) {
    return;
  }
  if (!Array.isArray(toAppend)) {
    toAppend = [ toAppend ];
  }
  for (var filename in toAppend) {
    ('\n!'+toAppend[filename]).toEnd('.gitignore');
  }
}

function printHelp() {
  var cmd = require('path').basename(process.argv[1]);
  console.log(
    fs
      .readFileSync(__dirname+'/res/help.txt', 'utf-8')
      .replace(/\$0/g, cmd)
      .trim()
  );
  process.exit();
}
