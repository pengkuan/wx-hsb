'use strict';

var _order = require('../../../model/order');

var _order2 = _interopRequireDefault(_order);

var _user = require('../../../model/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0,
    app = getApp();
Page({
  data: {
    userInfo: {},
    orderInfo: {},
    cdn: app.globalData.cdn
  },
  onShow: function onShow() {
    var _this = this;

    wx.setNavigationBarTitle({
      title: '订单详情'
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
    // let userInfo = wx.getStorageSync('userInfo');
    var userInfo = _user2.default.getUserInfo();
    var pages = getCurrentPages();
    var options = pages[pages.length - 1].options;
    _order2.default.order({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey,
      orderid: options.orderid
    }).then(function (orderInfo) {
      _this.setData({
        orderInfo: orderInfo
      });
    }, function (err) {
      console.log(err);
    });
  }
});
//# sourceMappingURL=index.js.map