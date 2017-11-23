import user from '../../../model/user'
let ctx;
Page({
  onLoad (params) {
    ctx = this;
    let userInfo = wx.getStorageSync('userInfo');
    if(!(userInfo && userInfo.tel && userInfo.us_uid)) ctx.login();
    wx.navigateTo({ url: `../test/index` })
  },
  login () {
    user.getWxCode().then(code => {
      user.getWxOpenId(code).then(data => {
        user.login(data.openid).then(loginRes => {
          user.setUserInfo(loginRes);
        }, err => {
          // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
          wx.navigateTo({ url: `../bind/index?openid=${ data.openid }&unionid=${ data.unionid }` })
        })
      })
    })
  }
});