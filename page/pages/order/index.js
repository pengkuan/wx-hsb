import order from '../../../model/order';
let ctx, app = getApp();
Page({
  data: {
    userInfo: {},
    orderInfo: {},
    cdn: app.globalData.cdn,
  },
  onShow () {
    wx.setNavigationBarTitle({
      title: '订单详情',
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
    let userInfo = wx.getStorageSync('userInfo');
    let pages = getCurrentPages();
    let options = pages[pages.length - 1].options;
    order.order({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey,
      orderid: options.orderid,
    }).then(orderInfo => {
      this.setData({
        orderInfo
      });
    }, err => {
      console.log(err);
    });
  }
});