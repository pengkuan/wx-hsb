import Utils from '../../../util/utils';
import order from '../../../model/order';
import user from '../../../model/user';
let ctx, app = getApp();

Page({

  data: {
    orderInfo: {},
    curTime: '',
  },

  onLoad () {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '提交结果'
    })
  },

  onShow () {
    let options = Utils.getCurPageOpt();
    let curTimeObj = Utils.formatDate();
    let orderInfo = JSON.parse(options.orderInfo);
    ctx.setData({
      orderInfo,
      curTime: `${curTimeObj.Y}-${curTimeObj.M}-${curTimeObj.D} ${curTimeObj.h}:${curTimeObj.m}:${curTimeObj.s}`,
    });
    if (orderInfo.ordertype !== 'post') return;
    order.takeSfOrder(orderInfo).then(data => {
      console.log(data);
      orderInfo.trackNum = 186451212345;
    }, err => {
      console.log(err);
    })
  },
});