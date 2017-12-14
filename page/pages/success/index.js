import Utils from '../../../util/utils';
import order from '../../../model/order';
import user from '../../../model/user';
import partner from '../../../model/partner';
let ctx, app = getApp();

Page({

  data: {
    orderInfo: {},
    curTime: '',
  },

  onLoad() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '提交结果'
    })
  },

  onShow() {
    let options = Utils.getCurPageOpt();
    let curTimeObj = Utils.formatDate();
    console.log(options.orderInfo);
    let orderInfo = {};
    if (options.orderInfo) orderInfo = JSON.parse(options.orderInfo);
    ctx.setData({
      orderInfo,
      curTime: `${curTimeObj.Y}-${curTimeObj.M}-${curTimeObj.D} ${curTimeObj.h}:${curTimeObj.m}:${curTimeObj.s}`,
    });
    console.log(orderInfo);
    ctx.asyncSfOrder(orderInfo);
    ctx.asyncPartnerOrder(orderInfo);
  },

  asyncSfOrder (orderInfo) {
    if (orderInfo.ordertype !== 'post') return;
    order.takeSfOrder(orderInfo).then(data => {
      orderInfo.trackNum = mailno.data;
    }, err => {
      console.log(err);
    })
  },

  asyncPartnerOrder (orderInfo) {
    const partnerApi = partner.getPartnerApi();
    const extraData = partner.store.extraData;
    partnerApi.trade({
      sid: extraData.sid,
      uid: extraData.uid,
      pid: extraData.pid,
      orderNum: orderInfo.ordernum,
      tel: orderInfo.tel,
      productName: orderInfo.productName,
      productId: parseInt(orderInfo.itemid),
      price: orderInfo.price
    }).then(res => {
      console.log(res)
    }, err => {
      console.log(err);
    })
  },

  switchPage(e) {
    let dataSet = e.currentTarget.dataset;
    let userInfo = user.getUserInfo();
    if (dataSet.needlogin) {
      if (!userInfo.tel) {
        wx.navigateTo({
          url: `../bind/index?type=bind&redirectUrl=${encodeURIComponent(dataSet.url)}`
        })
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
});