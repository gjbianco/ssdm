'use strict';

var expect = require('chai').assert;
var ssdm = require('../index');

describe('#ssdm', function () {

  it('should print help info', function () {
    var result = ssdm.printHelp();
    assert.isTrue(result.indexOf('Usage:') > -1);
  });

  it('should print version info', function () {
    var result = ssdm.printVersion();
  })

})
