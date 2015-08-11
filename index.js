#! /usr/bin/env node
'use strict';

var args = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version'
  }
});

if (args.help) {
  printHelp();
}

if (args.version) {
  printVersion();
}

// else
printHelp();

function printHelp () {
  var cmd = require('path').basename(process.argv[1]);
  console.log(
    require('fs')
      .readFileSync(__dirname+'/res/help.txt', 'utf-8')
      .replace(/\$0/g, cmd)
      .trim()
  );
  process.exit();
}

function printVersion () {
  console.log(require('./package.json').version);
  process.exit();
}

module.exports = {
  printHelp: printHelp,
  printVersion: printVersion
}
