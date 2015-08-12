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

if (args.version) {
  console.log(require('./package.json').version);
} else if (args.init) {
  gitCommand('init');
  '*'.to('.gitignore');
  '\n!.gitignore'.toEnd('.gitignore');
  exitContext();
  echo('created .ssdm and .ssdmignore');
} else if (args.addfile) {
  enterContext();
  appendIgnore(args.addfile);
  exitContext();
} else if (args.commit) {
  enterContext();
  gitCommand('add .');
  gitCommand('commit -m \'' + new Date() + '\'');
  exitContext();
} else if (args.git) {
  enterContext();
  gitCommand(args.git);
  exitContext();
} else {
  printHelp();
}

function enterContext() {
  mv('.ssdmignore', '.gitignore');
  if (error()) {
    exit(1);
  }
  mv('.ssdm', '.git');
  if (error()) {
    exit(1);
  }
}

function exitContext() {
  mv('.gitignore', '.ssdmignore')
  if (error()) {
    exit(1);
  }
  mv('.git', '.ssdm');
  if (error()) {
    exit(1);
  }
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
}
