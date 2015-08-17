'use strict';

exports = module.exports = ssdm;

var _ = require('lodash');
var fs = require('fs');
require('shelljs/global');

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}


function ssdm (args) {

  args = args || [];

  if (_.isEmpty(args)) {
    args.push('help');
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

  var commandToRun = availableCommands[args[0]];
  if (commandToRun) {
    return commandToRun(args);
  } else {
    return help();
  }

}

function help(args) {
  var results = fs
                  .readFileSync(__dirname+'/../res/help.txt', 'utf-8')
                  .replace(/\$0/g, 'ssdm')
                  .trim()
  return results;
}

function version(args) {
  var results = require('../package.json').version;
  return results;
}

function init(args) {
  var results = '';
  _gitCommand('init');
  '*'.to('.gitignore');
  '\n!.gitignore'.toEnd('.gitignore');
  _exitContext();

  results += 'created .ssdm and .ssdmignore';
  return results;
}

function addfile(args) {
  var results = '';
  _enterContext();
  _appendIgnore(args.slice(1));
  results += 'added files ' + args.slice(1);
  _exitContext();
  return results;
}

function commit(args) {
  _enterContext();
  _gitCommand('add .');
  _gitCommand('commit -m \'' + new Date() + '\'');
  _exitContext();

  // TODO list the committed changes
  return 'committed all changes';
}

function list(args) {
  var ignore = fs.readFileSync('.ssdmignore').toString();
  return ignore;
}

function git(args) {
  _enterContext();
  var response = _gitCommand(args.slice(1));
  _exitContext();
  return response;
}

function _enterContext() {
  mv('.ssdmignore', '.gitignore');
  if (error()) {
    exit(1);
  }
}

function _exitContext() {
  mv('.gitignore', '.ssdmignore');
  if (error()) {
    exit(1);
  }
}

function _gitCommand(command) {
  if (Array.isArray(command)) {
    command = command.join(' ');
  }
  var gitCommand = 'git --git-dir=.ssdm ' + command;
  console.log('running: ', gitCommand);
  var cmdResponse = exec(gitCommand, {async: false, silent: true});
  if (cmdResponse.code !== 0) {
    return 'Error: \'git ' + command + '\' failed';
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
