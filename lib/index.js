'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorator = exports.connect = exports.Container = undefined;

var _Container = require('./Container');

Object.defineProperty(exports, 'Container', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Container).default;
  }
});

var _Hoc = require('./Hoc');

var _Hoc2 = _interopRequireDefault(_Hoc);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connect = exports.connect = (0, _connect2.default)(_Hoc2.default);
var decorator = exports.decorator = (0, _connect.decoratorFactory)(_Hoc2.default);
//# sourceMappingURL=index.js.map