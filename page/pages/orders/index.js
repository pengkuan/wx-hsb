import user from '../../../model/user';
let ctx;
Page({
  onLoad () {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '订单中心'
    });
    user.orders().then(res => {
      console.log(res);
    })
  }
});