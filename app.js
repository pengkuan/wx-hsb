App({
  globalData: {
    cid: undefined,
    bid: undefined,
    pid: 1196,
    userInfo: {},
    cdn: 'http://s1.huishoubao.com/img/phone/'
  },
  onHide () {
    this.clearUserInfo();
  },
  clearUserInfo () {
    wx.removeStorage({key: 'userInfo'});
  },
  onShow () {
    wx.removeStorage({key: 'orderid'});
  }
});