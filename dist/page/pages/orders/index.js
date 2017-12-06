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
    orderList: [],
    cdn: app.globalData.cdn,
    num: 0,
    total: 0,
    userInfo: {},
    hasMore: true,
    isShowLoadText: true,
    isShowNoMoreText: false
  },

  onShow: function onShow() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '订单中心'
    });
    // let userInfo = wx.getStorageSync('userInfo');
    var userInfo = _user2.default.getUserInfo();
    ctx.setData({
      isShowLoadText: true,
      userInfo: userInfo
    });
    ctx.loadMore();
  },


  // 获取订单列表
  loadMore: function loadMore() {
    if (!ctx.data.hasMore) {
      ctx.setData({
        isShowNoMoreText: true
      });
      setTimeout(function () {
        ctx.setData({
          isShowNoMoreText: false
        });
      }, 1000);
    }
    var userInfo = ctx.data.userInfo;
    var num = ++ctx.data.num;
    _order2.default.orders({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey,
      pageIndex: num
    }).then(function (res) {
      var orderList = ctx.data.orderList;
      var total = res.page_info.total;
      var hasMore = total > num;
      if (res.order_list.length) {
        orderList = orderList.concat(res.order_list);
        ctx.setData({
          total: total,
          hasMore: hasMore,
          orderList: orderList,
          isShowLoadText: false
        });
      }
    });
  },


  /**
   * 下拉刷新订单列表
   * 暂时不开启交互不是很好
   */
  refresh: function refresh() {
    ctx.setData({
      num: 0,
      orderList: []
    });
    ctx.loadMore();
  },


  // 取消订单
  handleCancel: function handleCancel(e) {
    wx.showModal({
      title: '提示',
      content: '您真的要取消吗？',
      success: function success(res) {
        if (res.confirm) {
          var userInfo = ctx.data.userInfo;
          var dataset = e.currentTarget.dataset;
          _order2.default.cancelOrder({
            orderid: dataset.orderid,
            uid: userInfo.us_uid,
            userkey: userInfo.userkey,
            olduid: userInfo.old_uid
          }).then(function (res) {
            ctx.loadMore();
          }, function (err) {
            wx.showModal({
              title: '提示',
              content: '取消订单失败，请联系客服',
              showCancel: false
            });
          });
        }
      }
    });
  },


  // 套页面跳转
  switchPage: function switchPage(e) {
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataset.url
    });
  }
});
//# sourceMappingURL=index.js.map