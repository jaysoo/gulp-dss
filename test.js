'use strict';

var dss = require('./index');
var path = require('path');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
require('mocha');
var expect = require('chai').expect;

describe('gulp-dss', function() {
  var stream, file;

  beforeEach(function() {
    stream = dss({ output: 'output.css' });

    file = {
      contents: '/* @name fooBarModule */',
      cwd: 'folder',
      base: 'folder',
      path: 'folder/file'
    };
  });

  it('outputs rendered file', function() {
    stream.on('data', function(newFile) {
      expect(newFile.contents.toString()).to.contain('fooBarModule');
    });

    stream.write(file);
    stream.end();
  });

  it('outputs with output file name', function() {
    stream.on('data', function(newFile) {
      expect(newFile.path).to.eq('folder/output.css');
    });

    stream.write(file);
    stream.end();
  });
});
