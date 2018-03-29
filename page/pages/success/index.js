import Utils from '../../../util/utils';
import order from '../../../model/order';
import user from '../../../model/user';
import partner from '../../../model/partner';
let ctx, app = getApp();

Page({

  data: {
    orderInfo: {},
    curTime: '',
    isIphoneX: app.globalData.isIphoneX,
    location: ''
  },

  onLoad(options) {
    ctx = this;
    let curTimeObj = Utils.formatDate();
    let orderInfo = {};
    if (options.orderInfo) {
      orderInfo = JSON.parse(options.orderInfo);
    }

    Utils.getLocation().then(res => {
      console.log(res)
      ctx.setData({
        location: res[0].longitude + ',' + res[0].latitude
      })
    });

    ctx.setData({
      orderInfo,
      curTime: `${curTimeObj.Y}-${curTimeObj.M}-${curTimeObj.D} ${curTimeObj.h}:${curTimeObj.m}:${curTimeObj.s}`,
    });
    console.log(orderInfo);
    ctx.asyncSfOrder(orderInfo);
    ctx.asyncFcOrder(orderInfo);
    ctx.asyncPartnerOrder(orderInfo);
  },

  asyncSfOrder (orderInfo) {
    // console.log(orderInfo);
    if (orderInfo.way != 'shunfeng') return;
    order.takeSfOrder(orderInfo).then(data => {
      orderInfo.trackNum = data.mailno;
      ctx.setData({
        orderInfo
      })
    }, err => {
      console.log(err);
    })
  },

  asyncFcOrder(orderInfo) {
    // console.log(orderInfo);return;
    if (orderInfo.way != 'fengchao') return;
    order.takeFcOrder(orderInfo).then(data => {
      console.log(data);
      orderInfo.sendCode = data.sendCode;
      orderInfo.sendId = data.sendId;
      ctx.setData({
        orderInfo
      })
    }, err => {
      console.log(err);
    })
  },

  asyncPartnerOrder (orderInfo) {
    const partnerApi = partner.getPartnerApi();
    const extraData = partner.store.extraData;
    if (!partnerApi) return false;
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
        url: dataSet.url + '?location=' + ctx.data.location
      });
    }
  },
});