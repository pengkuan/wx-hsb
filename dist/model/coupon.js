'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../config/index');

var _utils = require('../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  couponList: [],
  page: function page(_ref) {
    var uid = _ref.uid,
        userkey = _ref.userkey,
        pageIndex = _ref.pageIndex;

    var ctx = this;
    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.coupon + 'coupons',
        data: {
          uid: uid,
          userkey: userkey,
          pageIndex: pageIndex || 1
        },
        success: function success(res) {
          res = res.data;
          if (res.errcode == 0) {
            ctx.couponList = res.data;
            resolve(res.data);
          } else {
            reject(res.errmsg);
          }
        }
      });
    });
  },
  add: function add(_ref2) {
    var uid = _ref2.uid,
        token = _ref2.token;

    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.coupon + 'add/' + token,
        data: {
          uid: uid
        },
        success: function success(res) {
          res = res.data;
          if (res.errcode == 0) {
            resolve(res.data);
          } else {
            reject(res.errmsg);
          }
        },
        fail: function fail(err) {
          // reject();
          console.log(err);
        }
      });
    });
  }
};
//# sourceMappingURL=coupon.js.map