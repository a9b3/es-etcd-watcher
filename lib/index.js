#!/usr/bin/env node
'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _commanderShepard = require('commander-shepard');

var _commanderShepard2 = _interopRequireDefault(_commanderShepard);

var _changeHandler = require('./change-handler.js');

var _changeHandler2 = _interopRequireDefault(_changeHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require('../package.json');
var binName = (0, _keys2.default)(pkg.bin)[0];
var commander = new _commanderShepard2.default({
  pkg: pkg,
  usage: binName + ' [command] [flags]',
  description: '',
  globalOptions: {
    config: {
      name: '--config',
      help: 'file path of the configuration',
      required: true
    }
  },
  command: _changeHandler2.default
});

commander.start();