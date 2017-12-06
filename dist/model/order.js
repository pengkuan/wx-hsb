'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../util/utils');

var _utils2 = _interopRequireDefault(_utils);

var _index = require('../config/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  // 查询订单列表
  orders: function orders(params) {
    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.orders,
        data: {
          uid: params.uid,
          userkey: params.userkey,
          pageSize: params.pageSize || 6,
          pageIndex: params.pageIndex || 1
        },
        success: function success(res) {
          res = res.data;
          if (res.retcode == 0) {
            resolve(res.data);
          } else {
            reject(res.retinfo);
          }
        }
      });
    });
  },

  // 取消订单
  cancelOrder: function cancelOrder(_ref) {
    var orderid = _ref.orderid,
        uid = _ref.uid,
        userkey = _ref.userkey,
        olduid = _ref.olduid;

    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.cancelOrder,
        data: {
          orderid: orderid,
          uid: uid,
          userkey: userkey,
          olduid: olduid
        },
        success: function success(res) {
          res = res.data;
          if (res.retcode == 0) {
            resolve(res.data);
          } else {
            reject(res.retinfo);
          }
        }
      });
    });
  },

  // 订单详情
  order: function order(_ref2) {
    var orderid = _ref2.orderid,
        uid = _ref2.uid,
        userkey = _ref2.userkey;

    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.order,
        data: {
          uid: uid,
          userkey: userkey,
          order_id: orderid
        },
        success: function success(res) {
          res = res.data;
          if (res.retcode == 0) {
            resolve(res.data);
          } else {
            reject(res.retinfo);
          }
        }
      });
    });
  },


  /**
   * 关于用户信息 没有登录时可以为空字符串
   * 但是 openid绝对不能为空
   * @param params
   * @return {Promise}
   */
  take: function take(params) {
    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.takeOrder,
        data: {
          uid: params.uid || "",
          userkey: params.userkey || "",
          tel: params.tel,
          openid: params.openid,
          type: 9,
          regionid: params.regionId || "",
          sendMsgFlag: 0,
          csrfToken: new Date(),
          selects: params.selects,
          itemid: params.itemid,
          olduid: params.olduid || "",
          ordertype: params.ordertype || 'post',
          visitTime: params.visitTime,
          address: params.address,
          couponId: params.couponId || "",
          wechatpayouttype: "9" // 区分小程序
        },
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
  takeSfOrder: function takeSfOrder(_ref3) {
    var orderid = _ref3.orderid,
        nickname = _ref3.nickname,
        tel = _ref3.tel,
        province = _ref3.province,
        city = _ref3.city,
        county = _ref3.county,
        addr = _ref3.addr,
        sendtime = _ref3.sendtime;

    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.takeSfOrder,
        data: {
          tel: tel,
          orderid: orderid,
          nickname: nickname,
          province: province,
          city: city,
          county: county,
          addr: addr,
          sendtime: sendtime
        },
        success: function success(res) {
          res = res.data;
          if (res.errcode == 0) {
            resolve(res.data);
          } else {
            // reject(res.errmsg);
          }
        }
      });
    });
  }
};
//# sourceMappingURL=order.js.map