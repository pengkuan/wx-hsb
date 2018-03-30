import order from '../../../model/order';
import user from '../../../model/user';
import Utils from '../../../util/utils.js';

let ctx, app = getApp();

Page({

  data: {
    userInfo: {},
    orderInfo: {},
    cdn: app.globalData.cdn,
  },

  onLoad(options) {
    let userInfo = user.getUserInfo();
    wx.setNavigationBarTitle({
      title: '订单详情',
    });
    Utils.setWhiteNavBar();
    order.order({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey,
      orderid: options.orderid,
    }).then(orderInfo => {
      orderInfo.sfRouteInfo = orderInfo.sfRouteInfo && orderInfo.sfRouteInfo.routelist && orderInfo.sfRouteInfo.routelist.reverse();
      this.setData({
        orderInfo
      });
    }, err => {
      console.log(err);
    });
  },
  showAll() {
    this.setData({
      showAll: true
    });
  },
  hideSome() {
    this.setData({
      showAll: false
    });
  },
});