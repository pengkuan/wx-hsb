import coupon from '../../../model/coupon';
let ctx, app = getApp();
Page({

  data: {
    menuIndex: 0,
    left: 0,
    menuList: [{
      text: '未使用',
      length: 2
    }, {
      text: '已使用',
      length: 2
    }, {
      text: '已过期',
      length: 2
    }]
  },

  onShow () {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '我的优惠券'
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
    let userInfo = wx.getStorageSync('userInfo');
    coupon.coupons({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey
    }).then(cps => {
      console.log(cps);
    }, err => {
      console.log(err);
    });
  },

  setLeft () {
    let left = (ctx.data.menuIndex / 3) * 100;
    ctx.setData({
      left
    })
  },

  handleMenu(e) {
    let dataset = e.currentTarget.dataset;
    console.log(dataset);
    ctx.setData({
      menuIndex: dataset.index
    })
  }
});