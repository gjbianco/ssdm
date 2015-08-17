'use strict';

var fs = require('fs');
var expect = require('chai').expect;
var assert = require('chai').assert;
var ssdm = require('../lib/ssdm.js');
require('shelljs/global');

describe ('#ssdm-basic', function () {

  it ('should display usage on no command', function () {
    var result = ssdm ();
    var help = fs
                .readFileSync(__dirname+'/../res/help.txt', 'utf-8')
                .replace(/\$0/g, 'ssdm')
                .trim();
    expect(result).to.equal(help);
  });

  it ('should display version on version command', function () {
    var result = ssdm (['version']);
    var version = require('../package.json').version;
    expect(result).to.equal(version);
  });

  it ('should initialize a new git repo on init', function () {
    // basic setup
    mkdir('test-dir');
    cd('test-dir');

    var readSsdm = function () {
      return fs.readdirSync('.ssdm');
    }
    var readSsdmIgnore = function () {
      return fs.readFileSync('.ssdmignore');
    }

    expect(readSsdm).to.throw(/.*ENOENT.*/);
    expect(readSsdmIgnore).to.throw(/.*ENOENT.*/);
    var cmdResponse = ssdm (['init']);
    expect(readSsdm).to.be.ok;
    expect(readSsdmIgnore).to.be.ok;

    // basic teardown
    // make sure we are in test-dir before we start changing dirs
    var testDirPattern = /.*\/test-dir\/?$/;
    if (testDirPattern.test(process.cwd())) {
      cd('..');
    }
    rm('-rf', 'test-dir');
  });

});

describe('#ssdm-util', function () {

  beforeEach(_setUpTestDir);

  it ('should list whitelisted files for list', function () {
    var cmdResponse = ssdm(['list']);
    var expected = '*\n!.gitignore';
    expect(cmdResponse).to.equal(expected);
  });

  it ('should pass through git commands within the context', function () {
    var cmdResponse = ssdm(['git', 'status']);

    // need to start with wildcard to account for
    // some testrunners (e.g. the one used by Travis)
    // automatically prepending each line with format chars
    var responsePattern = /^.*On branch master[\s\S]*$/;

    assert.match(cmdResponse, responsePattern);
  });

  it ('should fail on git pass through with bad git command', function () {
    var cmdResponse = ssdm(['git', 'foo']); // bad command
    var expected = 'Error: \'git foo\' failed';
    expect(cmdResponse).to.equal(expected);
  });

  afterEach(_tearDownTestDir);

});

describe('#ssdm-adding', function () {

  beforeEach(_setUpTestDir);

  it ('should add file pattern to whitelist', function () {
    var cmdResponse = ssdm (['addfile', '.bashrc']);
    var result = fs.readFileSync('.ssdmignore').toString();
    var expected = '*\n!.gitignore\n!.bashrc';
    expect(result).to.equal(expected);
  });

  it ('should add multiple file patterns to whitelist', function () {
    var cmdResponse = ssdm (['addfile', '.bashrc', '.vimrc', '.gitconfig']);
    var result = fs.readFileSync('.ssdmignore').toString();
    var expected = '*\n!.gitignore\n!.bashrc\n!.vimrc\n!.gitconfig';
    expect(result).to.equal(expected);
  });

  afterEach(_tearDownTestDir);

});

describe('#ssdm-committing', function () {

  beforeEach(_setUpTestDir);

  it ('should commit changes ', function () {
    var gitCount = function () {
      return exec('git --git-dir=.ssdm rev-list HEAD --count', {async: false, silent: false})
                  .output
                  .trim();
    }
    var expected = '1';

    expect(gitCount()).to.not.equal(expected);
    var cmdResponse = ssdm(['commit']);
    expect(gitCount()).to.equal(expected);
  });

  afterEach(_tearDownTestDir);

});

function _setUpTestDir() {
  mkdir('test-dir');
  cd('test-dir');
  if (exec('git init', {silent: true}).code !== 0) {
    echo('Error: \'git init\' failed');
    return 1;
  } else {
    mv('.git', '.ssdm');
  }
  '*\n!.gitignore'.to('.ssdmignore');
}

function _tearDownTestDir() {
  // make sure we are in test-dir before we start changing dirs
  var testDirPattern = /.*\/test-dir\/?$/;
  if (testDirPattern.test(process.cwd())) {
    cd('..');
  }
  rm('-rf', 'test-dir');
}
