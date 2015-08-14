'use strict';

exports = module.exports = ssdm;

var _ = require('lodash');
var fs = require('fs');
require('shelljs/global');

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}


function ssdm (commands, options) {

  commands = commands || [];
  options = options || {};

  if (_.isEmpty(commands)) {
    commands.push('help');
  }

  var availableCommands = {
    'help': help,
    'version': version,
    'init': init,
    'addfile': addfile,
    'commit': commit,
    'git': git
  };

  availableCommands[commands[0]](commands, options);

}

function help(commands, options) {
  console.log(
    fs
      .readFileSync(__dirname+'/../res/help.txt', 'utf-8')
      .replace(/\$0/g, 'ssdm')
      .trim()
  );
}

function version(commands, options) {
  console.log(require('../package.json').version);
}

function init(commands, options) {
  _gitCommand('init');
  '*'.to('.gitignore');
  '\n!.gitignore'.toEnd('.gitignore');
  _exitContext();
  echo('created .ssdm and .ssdmignore');
}

function addfile(commands, options) {
  _enterContext();
  _appendIgnore(commands.slice(1));
  _exitContext();
}

function commit(commands, options) {
  _enterContext();
  _gitCommand('add .');
  _gitCommand('commit -m \'' + new Date() + '\'');
  _exitContext();
}

function git(commands, options) {
  _enterContext();
  _gitCommand(commands.slice(1), options);
  _exitContext();
}

function _enterContext() {
  mv('.ssdmignore', '.gitignore');
  if (error()) {
    exit(1);
  }
  mv('.ssdm', '.git');
  if (error()) {
    exit(1);
  }
}

function _exitContext() {
  mv('.gitignore', '.ssdmignore');
  if (error()) {
    exit(1);
  }
  mv('.git', '.ssdm');
  if (error()) {
    exit(1);
  }
}

function _gitCommand(command) {
  if (exec('git ' + command).code !== 0) {
    echo('Error: \'git ' + command + '\' failed');
    return 1;
  }
}

function _appendIgnore(toAppend) {
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
