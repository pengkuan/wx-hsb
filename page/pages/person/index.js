import user from '../../../model/user';
let ctx;
Page({
  data: {
    userInfo: {},
    grid1Cols: [{
      text: '我的订单',
      path: '',
      icon: '../../../img/icon-order.png',
    }, {
      text: '我的优惠券',
      path: '',
      icon: '../../../img/icon-coupon.png',
    }, {
      text: '邮寄地址',
      path: '',
      icon: '../../../img/icon-addr.png',
    }],
    grid2Cols: [{
      text: '帮助中心',
      path: '',
      icon: '../../../img/icon_help.svg',
    }, {
      text: '400-080-9966',
      path: '',
      icon: '../../../img/icon_phone.svg',
    }, {
      text: '在线客服',
      path: '',
      icon: '../../../img/icon_contact.svg',
    }, {
      text: '关于我们',
      path: '',
      icon: '../../../img/icon_about.svg',
    }]
  },
  onLoad() {
    ctx = this;
    wx.setNavigationBarTitle({title: '个人中心'});
    user.getWxOpenInfo().then(res => {
      console.log(res);
      ctx.setData({
        userInfo: res
      })
    });
  }
});