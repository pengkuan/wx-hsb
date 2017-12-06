'use strict';

var _user = require('../../../model/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0;
Page({
  onLoad: function onLoad(params) {
    ctx = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (!(userInfo && userInfo.tel && userInfo.us_uid)) ctx.login();
    wx.navigateTo({ url: '../test/index' });
  },
  login: function login() {
    _user2.default.getWxCode().then(function (code) {
      _user2.default.getWxOpenId(code).then(function (data) {
        _user2.default.login(data.openid).then(function (loginRes) {
          _user2.default.setUserInfo(loginRes);
        }, function (err) {
          // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
          wx.navigateTo({ url: '../bind/index?openid=' + data.openid + '&unionid=' + data.unionid });
        });
      });
    });
  }
});
//# sourceMappingURL=index.js.map