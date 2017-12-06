'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../config/index');

var _utils = require('../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  // 微信开放信息
  wxOpenInfo: {},
  // 回收宝账户信息
  userInfo: {},
  // 微信票据
  wxToken: {}, // {openid, unionid}

  // 获取微信用户的 微信开发信息
  getWxOpenInfo: function getWxOpenInfo() {
    var _this = this;

    var ctx = this;
    return new Promise(function (resolve, reject) {
      if (Object.keys(_this.wxOpenInfo).length !== 0) resolve(_this.wxOpenInfo);
      wx.getUserInfo({
        lang: 'zh_CN',
        withCredentials: false,
        success: function success(res) {
          ctx.wxOpenInfo = res.userInfo;
          resolve(ctx.wxOpenInfo);
        }
      });
    });
  },


  // 获取code
  getWxCode: function getWxCode() {
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function success(res) {
          resolve(res.code);
        },
        fail: function fail(res) {
          resolve(res.errMsg);
        }
      });
    });
  },


  /**
   * 获取微信openid
   * @param code
   * @return {Promise}
   */
  getWxOpenId: function getWxOpenId(code) {
    return new Promise(function (resolve, reject) {
      _utils2.default.get({
        url: _index.url.wxOpenId + '/' + code,
        success: function success(res) {
          resolve(res.data.data);
        },
        fail: function fail(res) {
          reject(res.errMsg);
        }
      });
    });
  },


  /**
   * @param openid 开发授权id
   * @param auth_type 授权类型 1：微信公众号、2：微信小程序、3：支付宝 必填
   * @param appid 第三方应用号/公众号/生活号，可空 必填
   * @return {Promise}
   */
  login: function login(openid) {
    var auth_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _index.WX_AUTH_TYPE;
    var appid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _index.WX_APP_ID;

    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.authUserLogin,
        data: {
          appid: appid,
          openid: openid,
          auth_type: auth_type,
          valid_days: 0.1
        },
        success: function success(res) {
          res = res.data;
          if (res.retcode == 0) {
            resolve(res.data);
          } else {
            reject(res.retinfo);
          }
        },
        fail: function fail(res) {
          console.log(res);
        }
      });
    });
  },


  // 获取手机验证码
  getCode: function getCode(_ref) {
    var tel = _ref.tel;

    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.getCode,
        data: { tel: tel },
        success: function success(res) {
          resolve(res.data);
        }
      });
    });
  },


  /**
   * 绑定手机号并登录
   * @param tel 手机号码
   * @param code
   * @param openid
   * @param unionid
   * @param valid_days
   * @return {Promise}
   */
  bindTelLogin: function bindTelLogin(_ref2) {
    var tel = _ref2.tel,
        code = _ref2.code,
        openid = _ref2.openid,
        unionid = _ref2.unionid,
        valid_days = _ref2.valid_days;

    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.bindTelLogin,
        data: {
          tel: tel,
          code: code,
          openid: openid,
          unionid: unionid,
          appid: _index.WX_APP_ID,
          auth_type: _index.WX_AUTH_TYPE
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
   * 已经绑定手机号的用户解绑手机号
   * @param uid
   * @param userkey
   * @param openid
   * @return {Promise}
   */
  authUserUnbindTel: function authUserUnbindTel(_ref3) {
    var uid = _ref3.uid,
        userkey = _ref3.userkey,
        openid = _ref3.openid;

    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: _index.url.authUserUnbindTel,
        data: {
          uid: uid,
          openid: openid,
          userkey: userkey,
          auth_type: _index.WX_AUTH_TYPE
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
   * 将登录后的用户信息存到本地
   * @param params
   */
  setUserInfo: function setUserInfo() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // wx.setStorage({
    //   key: 'userInfo',
    //   data: params
    // });
    console.log('setUserInfo', params);
    this.userInfo = params;
  },


  /**
   * 获取用户的登录信息
   * @return {*}
   */
  getUserInfo: function getUserInfo() {
    return this.userInfo;
  },


  /**
   * 设置微信token {openid, unionid}
   */
  setWxToken: function setWxToken(wxToken) {
    this.wxToken = wxToken;
  },


  /**
   * 获取微信token
   */
  getWxToken: function getWxToken() {
    return this.wxToken;
  }
};
//# sourceMappingURL=user.js.map