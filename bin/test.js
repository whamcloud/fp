#!/usr/bin/env node

'use strict';

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
require('@mfl/jasmine-n-matchers');

jasmine.loadConfig({
  spec_dir: 'dist/test',
  spec_files: ['**/*-test.js'],
  random: true
});

jasmine.execute();
