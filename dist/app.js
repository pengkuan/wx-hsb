'use strict';

var _user = require('./model/user');

var _user2 = _interopRequireDefault(_user);

var _partner = require('./model/partner');

var _partner2 = _interopRequireDefault(_partner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

App({
  globalData: {
    cid: 1,
    bid: -1,
    pid: 1196,
    cdn: 'http://s1.huishoubao.com/img/phone/'
  },
  // 用户切换到后台时 清除登录态
  onHide: function onHide() {
    this.clearUserInfo();
    _partner2.default.setPartnerInfo({
      appId: '',
      extraData: {}
    });
  },

  // 清除登录态
  clearUserInfo: function clearUserInfo() {
    wx.removeStorage({
      key: 'userInfo'
    });
  },
  onShow: function onShow(data) {
    // 小程序打开小程序
    if (data.scene == 1037) {
      var appId = data.referrerInfo.appId;
      var extraData = JSON.parse(data.referrerInfo.extraData);
      _partner2.default.setPartnerInfo({
        appId: appId,
        extraData: extraData
      });
      this.globalData.pid = extraData.pid;
    }
    this.login();
  },
  login: function login() {
    _user2.default.getWxCode().then(function (code) {
      _user2.default.getWxOpenId(code).then(function (data) {
        // 保存wx票据 绑定和解绑都有用到
        _user2.default.setWxToken(data);
        console.log('setWxToken', data);
        _user2.default.login(data.openid).then(function (loginRes) {
          // 保存账户的回收宝信息
          _user2.default.setUserInfo(loginRes);
        }, function (err) {
          // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
          console.log(err);
          _user2.default.setUserInfo({});
        });
      });
    });
  }
});
//# sourceMappingURL=app.js.map