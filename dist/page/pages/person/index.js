'use strict';

var _user = require('../../../model/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0,
    app = getApp();

/**
 * 关于 storage userInfo 的使用预定
 * userInfo 为空对象说明用户未绑定手机号
 * userInfo 有key值说明用户已经绑定手机号
 */

Page({

  data: {
    userInfo: {},
    wxOpenInfo: {},
    grid1Cols: [{
      text: '我的订单',
      path: '../orders/index',
      icon: '../../../img/icon-order.png'
    }, {
      text: '我的优惠券',
      path: '../coupons/index',
      icon: '../../../img/icon-coupon.png'
    }, {
      text: '邮寄地址',
      path: '../address/index',
      icon: '../../../img/icon-addr.png'
    }]
  },

  onLoad: function onLoad() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '个人中心'
    });
    _user2.default.getWxOpenInfo().then(function (res) {
      ctx.setData({
        wxOpenInfo: res
      });
    });
  },
  onShow: function onShow() {
    var userInfo = _user2.default.getUserInfo();
    if (!(userInfo && userInfo.tel && userInfo.us_uid)) {
      ctx.login();
    } else {
      ctx.setData({
        userInfo: userInfo
      });
    }
  },
  login: function login() {
    _user2.default.getWxCode().then(function (code) {
      _user2.default.getWxOpenId(code).then(function (data) {
        // 保存wx票据 绑定和解绑都有用到
        _user2.default.setWxToken(data);
        _user2.default.login(data.openid).then(function (loginRes) {
          // 保存账户的回收宝信息
          _user2.default.setUserInfo(loginRes);
          ctx.setData({
            userInfo: loginRes
          });
        }, function (err) {
          // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
          console.log(err);
          _user2.default.setUserInfo({});
          // wx.navigateTo({ url: `../bind/index?openid=${ data.openid }&unionid=${ data.unionid }` })
        });
      });
    });
  },


  // 绑定解绑手机号
  switchBind: function switchBind(e) {
    var dataSet = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../bind/index?type=' + dataSet.type
    });
  },


  // 页面跳转
  switchPage: function switchPage(e) {
    var dataSet = e.currentTarget.dataset;
    var userInfo = ctx.data.userInfo;
    if (dataSet.url === '../orders/index' || dataSet.url === '../coupons/index') {
      if (!userInfo.tel) {
        wx.showModal({
          title: '提示',
          content: '请先绑定手机号',
          showCancel: false
        });
      } else {
        wx.navigateTo({
          url: dataSet.url
        });
      }
    } else {
      wx.navigateTo({
        url: dataSet.url
      });
    }
  },
  dialNumber: function dialNumber(e) {
    wx.makePhoneCall({
      phoneNumber: '4000809966'
    });
  }
});
//# sourceMappingURL=index.js.map