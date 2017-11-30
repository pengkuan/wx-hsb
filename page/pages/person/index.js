import user from '../../../model/user';
let ctx, app = getApp();
Page({
  data: {
    userInfo: {},
    wxOpenInfo: {},
    grid1Cols: [{
      text: '我的订单',
      path: '../orders/index',
      icon: '../../../img/icon-order.png',
    }, {
      text: '我的优惠券',
      path: '../coupons/index',
      icon: '../../../img/icon-coupon.png',
    }, {
      text: '邮寄地址',
      path: '../address/index',
      icon: '../../../img/icon-addr.png',
    }],
    grid2Cols: [{
      text: '帮助中心',
      path: '../help/index',
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
      path: '../about/index',
      icon: '../../../img/icon_about.svg',
    }]
  },
  onLoad() {
      console.log(111);
    ctx = this;
    wx.setNavigationBarTitle({title: '个人中心'});
    user.getWxOpenInfo().then(res => {
      ctx.setData({ wxOpenInfo: res })
    });
    let userInfo = user.getUserInfo();
    if (!(userInfo && userInfo.tel && userInfo.us_uid))
      ctx.login();
    else
      ctx.setData({ userInfo });
  },
  login () {
    user.getWxCode().then(code => {
      user.getWxOpenId(code).then(data => {
        // 保存wx票据 绑定和解绑都有用到
        user.setWxToken(data);
        user.login(data.openid).then(loginRes => {
          // 保存账户的回收宝信息
          user.setUserInfo(loginRes);
          ctx.setData({ userInfo: loginRes });
        }, err => {
          // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
          // wx.navigateTo({ url: `../bind/index?openid=${ data.openid }&unionid=${ data.unionid }` })
        })
      })
    })
  },
  switchBind (e) {
    let dataSet = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../bind/index?type=${dataSet.mark}`
    })
  },
  // 页面跳转
  switchPage (e) {
    let dataSet = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataSet.url
    })
  }
});