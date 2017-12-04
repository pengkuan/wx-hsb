import user from './model/user';
App({
  globalData: {
    cid: 3,
    bid: -1,
    pid: 1196,
    cdn: 'http://s1.huishoubao.com/img/phone/'
  },
  // 用户切换到后台时 清除登录态
  onHide () {
    this.clearUserInfo();
  },
  // 清除登录态
  clearUserInfo () {
    wx.removeStorage({
      key: 'userInfo'
    });
  },
  onShow () {
    this.login();
  },
  login () {
    user.getWxCode().then(code => {
      user.getWxOpenId(code).then(data => {
        // 保存wx票据 绑定和解绑都有用到
        user.setWxToken(data);
        user.login(data.openid).then(loginRes => {
          // 保存账户的回收宝信息
          user.setUserInfo(loginRes);
        }, err => {
          // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
          console.log(err);
          user.setUserInfo({});
        })
      })
    })
  },
});