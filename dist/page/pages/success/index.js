'use strict';

var _utils = require('../../../util/utils');

var _utils2 = _interopRequireDefault(_utils);

var _order = require('../../../model/order');

var _order2 = _interopRequireDefault(_order);

var _user = require('../../../model/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0,
    app = getApp();

Page({

  data: {
    orderInfo: {},
    curTime: ''
  },

  onLoad: function onLoad() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '提交结果'
    });
  },
  onShow: function onShow() {
    var options = _utils2.default.getCurPageOpt();
    var curTimeObj = _utils2.default.formatDate();
    console.log(options.orderInfo);
    var orderInfo = {};
    if (options.orderInfo) orderInfo = JSON.parse(options.orderInfo);
    ctx.setData({
      orderInfo: orderInfo,
      curTime: curTimeObj.Y + '-' + curTimeObj.M + '-' + curTimeObj.D + ' ' + curTimeObj.h + ':' + curTimeObj.m + ':' + curTimeObj.s
    });
    if (orderInfo.ordertype !== 'post') return;
    _order2.default.takeSfOrder(orderInfo).then(function (data) {
      console.log(data);
      orderInfo.trackNum = 186451212345;
    }, function (err) {
      console.log(err);
    });
  },
  switchPage: function switchPage(e) {
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataset.url,
      fail: function fail(res) {
        console.log(res);
      },
      success: function success(res) {
        console.log(res);
      }
    });
  }
});
//# sourceMappingURL=index.js.map