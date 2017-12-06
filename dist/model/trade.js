'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../config/index');

var _utils = require('../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  sfCity: function sfCity() {
    return new Promise(function (resolve, reject) {
      _utils2.default.get({
        url: _index.url.sfCity,
        success: function success(res) {
          res = res.data;
          if (res.ret == 0) {
            resolve(res.data);
          } else {
            reject(res.retinfo);
          }
        }
      });
    });
  },
  visitTime: function visitTime() {
    return new Promise(function (resolve, reject) {
      _utils2.default.get({
        url: _index.url.support_visit_time,
        success: function success(res) {
          res = res.data;
          if (res.errcode == 0) {
            resolve(res.data);
          } else {
            reject(res.errmsg);
          }
        }
      });
    });
  },
  hsbCity: function hsbCity() {
    return new Promise(function (resolve, reject) {
      _utils2.default.get({
        url: _index.url.hsbCity,
        success: function success(res) {
          res = res.data;
          if (res.errcode == 0) {
            resolve(res.data);
          } else {
            reject(res.errmsg);
          }
        }
      });
    });
  }
};
//# sourceMappingURL=trade.js.map