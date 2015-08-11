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
  console.log(require('./package.json').version);
  process.exit();
}

// else
printHelp();

function printHelp() {
  var cmd = require('path').basename(process.argv[1]);
  console.log(
    require('fs')
      .readFileSync(__dirname+'/res/help.txt', 'utf-8')
      .replace(/\$0/g, cmd)
      .trim()
  );
  process.exit();
}
