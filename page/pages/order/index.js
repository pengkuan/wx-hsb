import order from '../../../model/order';
import user from '../../../model/user';
import Utils from '../../../util/utils.js';

let ctx, app = getApp();

Page({

  data: {
    userInfo: {},
    orderInfo: {},
    cdn: app.globalData.cdn,
    location: '',
    showAll: false,
    onlyOne: true,
    onlyTwo: true,
    alertTip: false,
    isIphoneX: app.globalData.isIphoneX
  },

  onLoad(options) {
    ctx = this;
    let userInfo = user.getUserInfo();
    wx.setNavigationBarTitle({
      title: '订单详情',
    });
    Utils.setWhiteNavBar();

    Utils.getLocation().then(res => {
      console.log(res)
      ctx.setData({
        location: res[0].longitude + ',' + res[0].latitude
      })
    });
    order.order({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey,
      orderid: options.orderid,
    }).then(orderInfo => {
      console.log(orderInfo)
      orderInfo.sfRouteInfo = orderInfo.sfRouteInfo && orderInfo.sfRouteInfo.routelist && orderInfo.sfRouteInfo.routelist.reverse();
      orderInfo.fcRouteInfo = orderInfo.fcRouteInfo && orderInfo.fcRouteInfo && orderInfo.fcRouteInfo[0].routeNodes
      this.setData({
        orderInfo,
        userInfo,
        onlyTwo: (orderInfo.sfRouteInfo && orderInfo.sfRouteInfo.length <= 2) || (orderInfo.fcRouteInfo && orderInfo.fcRouteInfo.length <= 2)
      });
    }, err => {
      console.log(err);
    });
  },
  closeMue(){
    this.setData({
      alertTip: false
    })
  },
  // handleCancel(){
  //   wx.showModal({
  //     title: '提示',
  //     content: '您真的要取消吗？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         let userInfo = ctx.data.userInfo;
  //         let orderInfo = ctx.data.orderInfo;
  //         order.cancelOrder({
  //           orderid: orderInfo.order_id,
  //           uid: userInfo.us_uid,
  //           userkey: userInfo.userkey,
  //           olduid: userInfo.old_uid
  //         }).then(res => {
  //           // console.log(res);
  //           order.order({
  //             uid: userInfo.us_uid,
  //             userkey: userInfo.userkey,
  //             orderid: orderInfo.order_id,
  //           }).then(orderInfo => {
  //             orderInfo.sfRouteInfo = orderInfo.sfRouteInfo.data.routelist && orderInfo.sfRouteInfo.data.routelist.reverse();
  //             orderInfo.fcRouteInfo = orderInfo.fcRouteInfo.data && orderInfo.fcRouteInfo.data[0].routeNodes
  //             ctx.setData({
  //               orderInfo
  //             });
  //           }, err => {
  //             console.log(err);
  //           });
  //         }, err => {
  //           wx.showModal({
  //             title: '提示',
  //             content: '取消订单失败，请联系客服',
  //             showCancel: false
  //           })
  //         })
  //       }
  //     }
  //   });
  // },
  showDetails(){
    let onlyOne = ctx.data.orderInfo.order_status_list.length <= 1;
    this.setData({
      alertTip: true,
      onlyOne
    })
  },
  showAll(){
    this.setData({
      showAll: true
    });
  },
  hideSome(){
    this.setData({
      showAll: false
    });
  },
  switchPage(e) {
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataset.url + '?location=' + ctx.data.location
    })
  }
});