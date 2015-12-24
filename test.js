#!/usr/bin/env node

'use strict';

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
require('intel-jasmine-n-matchers');

if (process.env.RUNNER === 'CI') {
  var krustyJasmineReporter = require('krusty-jasmine-reporter');

  var junitReporter = new krustyJasmineReporter.KrustyJasmineJUnitReporter({
    specTimer: new jasmine.jasmine.Timer(),
    JUnitReportSavePath: process.env.SAVE_PATH || './',
    JUnitReportFilePrefix: process.env.FILE_PREFIX || 'fp-results-' +  process.version,
    JUnitReportSuiteName: 'FP Reports',
    JUnitReportPackageName: 'FP Reports'
  });

  jasmine.jasmine.getEnv().addReporter(junitReporter);
}

require('babel-register');

jasmine.loadConfig({
  spec_dir: 'test',
  spec_files: [
    '**/*.js'
  ],
  random: true
});

exports.jasmine = jasmine.jasmine;
exports.env = jasmine.jasmine.getEnv();

jasmine.execute();
