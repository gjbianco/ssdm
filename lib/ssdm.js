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
    'list': list,
    'git': git
  };

  var commandToRun = availableCommands[commands[0]];
  if (commandToRun) {
    return commandToRun(commands, options);
  } else {
    return help();
  }

}

function help(commands, options) {
  var results = fs
                  .readFileSync(__dirname+'/../res/help.txt', 'utf-8')
                  .replace(/\$0/g, 'ssdm')
                  .trim()
  return results;
}

function version(commands, options) {
  var results = require('../package.json').version;
  return results;
}

function init(commands, options) {
  var results = '';
  _gitCommand('init');
  '*'.to('.gitignore');
  '\n!.gitignore'.toEnd('.gitignore');
  _exitContext();

  results += 'created .ssdm and .ssdmignore';
  return results;
}

function addfile(commands, options) {
  var results = '';
  _enterContext();
  _appendIgnore(commands.slice(1));
  results += 'added files ' + commands.slice(1);
  _exitContext();
  return results;
}

function commit(commands, options) {
  _enterContext();
  _gitCommand('add .');
  _gitCommand('commit -m \'' + new Date() + '\'');
  _exitContext();
}

function list(commands, options) {
  var ignore = fs.readFileSync('.ssdmignore').toString();
  return ignore;
}

function git(commands, options) {
  _enterContext();
  var response = _gitCommand(commands.slice(1), options);
  _exitContext();
  return response;
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
  if (Array.isArray(command)) {
    command = command.join(' ');
  }
  var cmdResponse = exec('git ' + command, {async: false, silent: true});
  if (cmdResponse.code !== 0) {
    echo('Error: \'git ' + command + '\' failed');
    return 1;
  }
  return cmdResponse.output.toString();
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
