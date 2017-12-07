import order from '../../../model/order';
import user from '../../../model/user';

let ctx, app = getApp();

Page({

  data: {
    userInfo: {},
    orderInfo: {},
    cdn: app.globalData.cdn,
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '订单详情',
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
  },

  onShow() {
    let userInfo = user.getUserInfo();
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 1];
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