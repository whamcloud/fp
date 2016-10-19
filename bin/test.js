#!/usr/bin/env node

'use strict';

const Jasmine = require('jasmine');
const jasmine = new Jasmine();
require('@mfl/jasmine-n-matchers');

jasmine.loadConfig({
  spec_dir: 'dist/test',
  spec_files: ['**/*-test.js'],
  random: true
});

jasmine.execute();
