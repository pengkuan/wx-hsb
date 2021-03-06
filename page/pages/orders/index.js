import order from '../../../model/order';
import user from '../../../model/user';
let ctx, app = getApp();
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

  onLoad () {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '订单中心'
    });
  },

  onShow () {
    let userInfo = user.getUserInfo();
    ctx.setData({
      isShowLoadText: true,
      userInfo
    });
    ctx.loadMore();
  },

  // 获取订单列表
  loadMore () {
    if (!ctx.data.hasMore) {
      ctx.setData({
        isShowNoMoreText: true
      });
      setTimeout(() => {
        ctx.setData({
          isShowNoMoreText: false
        });
      }, 1000)
    }
    let userInfo = ctx.data.userInfo;
    let num = ++ctx.data.num;
    order.orders({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey,
      pageIndex: num
    }).then(res => {
      let orderList = ctx.data.orderList;
      let total = res.page_info.total;
      let hasMore = total > num;
      if (res.order_list.length) {
        orderList = orderList.concat(res.order_list);
        ctx.setData({
          total,
          hasMore,
          orderList,
          isShowLoadText: false
        });
      }
    }, err => {
      console.log(err);
    });
  },

  /**
   * 下拉刷新订单列表
   * 暂时不开启交互不是很好
   */
  refresh () {
    ctx.setData({
      num: 0,
      orderList: []
    });
    ctx.loadMore();
  },

  // 取消订单
  handleCancel (e) {
    let dataset = e.currentTarget.dataset;
    let orderList = ctx.data.orderList;
    wx.showModal({
      title: '提示',
      content: '您真的要取消吗？',
      success: function (res) {
        if (res.confirm) {
          let userInfo = ctx.data.userInfo;
          let dataset = e.currentTarget.dataset;
          order.cancelOrder({
            orderid: dataset.orderid,
            uid: userInfo.us_uid,
            userkey: userInfo.userkey,
            olduid: userInfo.old_uid
          }).then(res => {
            orderList[dataset.index].can_cancel = 0;
            orderList[dataset.index].order_status_name = '已取消';
            ctx.setData({
              orderList
            })
          }, err => {
            wx.showModal({
              title: '提示',
              content: '取消订单失败，请联系客服',
              showCancel: false
            })
          })
        }
      }
    });
  },

  // 套页面跳转
  switchPage (e) {
    let dataSet = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataSet.url
    })
  },

  //
  switchToTab (e) {
    let dataSet = e.currentTarget.dataset;
    wx.switchTab({
      url: dataSet.url
    })
  }
});