'use strict';

var fs = require('fs');
var expect = require('chai').expect;
var ssdm = require('../lib/ssdm.js');

describe ('#ssdm', function () {
  it ('should display usage on no command', function () {
    var result = ssdm ();
    var help = fs
                .readFileSync(__dirname+'/../res/help.txt', 'utf-8')
                .replace(/\$0/g, 'ssdm')
                .trim();
    expect(result).to.equal(help);
  })
});
