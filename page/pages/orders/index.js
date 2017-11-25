import order from '../../../model/order';
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
    let userInfo = wx.getStorageSync('userInfo');
    ctx.setData({
      isShowLoadText: true,
      userInfo
    });
    ctx.loadMore();
  },

  // 获取订单列表
  loadMore () {
    if (!ctx.data.hasMore) {
      ctx.setData({isShowNoMoreText: true});
      setTimeout(() => {
        ctx.setData({isShowNoMoreText: false});
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
    });
  },

  // 刷新订单列表
  refresh () {
    ctx.setData({
      num: 0,
      orderList: []
    });
    ctx.loadMore();
  },

  // 取消订单
  handleCancel (e) {
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success: function (res) {
        if (res.confirm) {
          let userInfo = ctx.data.userInfo;
          let dataset = e.currentTarget.dataset;
          order.cancelOrder({
            orderid: dataset.orderid,
            uid: userInfo.us_uid,
            userkey: userInfo.userkey
          }).then(res => {
            console.log(res);
          })
        }
      }
    });
  }
});