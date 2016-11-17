'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _esEtcd = require('es-etcd');

var _esEtcd2 = _interopRequireDefault(_esEtcd);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _toolkit = require('@esayemm/toolkit');

var toolkit = _interopRequireWildcard(_toolkit);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = {
  template: function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
      var src = _ref.src,
          dest = _ref.dest,
          data = _ref.data;
      var compiled, rendered;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              (0, _invariant2.default)(toolkit.fileExists(src), '\'src\' must be a valid filepath');

              compiled = _lodash2.default.template(_fs2.default.readFileSync(src, { encoding: 'utf8' }), {
                imports: { _: _lodash2.default }
              });
              rendered = compiled(data);

              console.log(data);
              _fs2.default.writeFileSync(dest, rendered, { encoding: 'utf8' });

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function template(_x) {
      return _ref2.apply(this, arguments);
    }

    return template;
  }()
};

function verifyConfig(config) {
  (0, _invariant2.default)(config.keys.constructor === Array, '\'keys\' must be an Array');
  for (var i = 0; i < config.keys.length; i++) {
    (0, _invariant2.default)(typeof config.keys[i].key === 'string', '\'key\' must be String');
    (0, _invariant2.default)(config.keys[i].commands, '\'commands\' must be provided');
    (0, _invariant2.default)(config.keys[i].commands.constructor === Array, '\'commands\' must be an Array');
    for (var j = 0; j < config.keys[i].commands; j++) {
      (0, _invariant2.default)(typeof config.keys[i].commands[j] === 'string', '\'commands\' element must be a String or Function');
      (0, _invariant2.default)(typeof config.keys[i].commands[j] === 'function', '\'commands\' element must be a String or Function');
    }
  }
}

exports.default = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref3) {
    var _this = this;

    var options = _ref3.options;
    var configFilepath, config, defaultEtcdConfigs, etcdConfigs, agentOpts, esEtcd;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            configFilepath = _path2.default.resolve(options.config);
            config = require(configFilepath).default || require(configFilepath);

            verifyConfig(config);

            defaultEtcdConfigs = {
              scheme: 'http',
              host: '0.0.0.0',
              port: 2379
            };
            etcdConfigs = (0, _assign2.default)({}, defaultEtcdConfigs, config.etcd);
            agentOpts = {};

            if (config.etcd && config.etcd.agentOpts) {
              (0, _keys2.default)(config.etcd.agentOpts).forEach(function (key) {
                var filepath = config.etcd.agentOpts[key];
                agentOpts[key] = _fs2.default.readFileSync(_path2.default.resolve(filepath));
              });
            }
            etcdConfigs.agentOpts = agentOpts;
            esEtcd = new _esEtcd2.default(etcdConfigs);


            config.keys.forEach(function (_ref5) {
              var key = _ref5.key,
                  commands = _ref5.commands;

              esEtcd.watch(key, function () {
                var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(data) {
                  var i;
                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          i = 0;

                        case 1:
                          if (!(i < commands.length)) {
                            _context2.next = 21;
                            break;
                          }

                          if (!(commands[i].constructor === Function)) {
                            _context2.next = 15;
                            break;
                          }

                          _context2.t0 = commands;
                          _context2.t1 = i;
                          _context2.next = 7;
                          return esEtcd.get('/', { recursive: true });

                        case 7:
                          _context2.t2 = _context2.sent;
                          _context2.t3 = data;
                          _context2.t4 = api;
                          _context2.t5 = {
                            root: _context2.t2,
                            data: _context2.t3,
                            api: _context2.t4
                          };
                          _context2.next = 13;
                          return _context2.t0[_context2.t1].call(_context2.t0, _context2.t5);

                        case 13:
                          _context2.next = 18;
                          break;

                        case 15:
                          if (!(commands[i].constructor === String)) {
                            _context2.next = 18;
                            break;
                          }

                          _context2.next = 18;
                          return toolkit.execPromise(commands[i], { log: true });

                        case 18:
                          i++;
                          _context2.next = 1;
                          break;

                        case 21:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this);
                }));

                return function (_x3) {
                  return _ref6.apply(this, arguments);
                };
              }());
            });

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  function changeHandler(_x2) {
    return _ref4.apply(this, arguments);
  }

  return changeHandler;
}();