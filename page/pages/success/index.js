import Utils from '../../../util/utils';
import order from '../../../model/order';
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
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 1];
    let options = curPage.options;
    let curTimeObj = Utils.getCurDate();
    let orderInfo = JSON.parse(options.orderInfo);
    console.log(orderInfo);
    ctx.setData({
      orderInfo,
      curTime: `${curTimeObj.Y}-${curTimeObj.M}-${curTimeObj.D} ${curTimeObj.h}:${curTimeObj.m}:${curTimeObj.s}`,
    });
    order.takeSfOrder(orderInfo).then(data => {
      console.log(data);
    }, err => {

    })
  },
});