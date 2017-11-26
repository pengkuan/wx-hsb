App({
  globalData: {
    cid: undefined,
    bid: undefined,
    pid: 1196,
    userInfo: {},
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
  }
});