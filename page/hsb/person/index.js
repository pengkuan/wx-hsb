let ctx;
Page({
  data: {
    userInfo: {}
  },
  onLoad() {
    ctx = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      withCredentials: false,
      success(res) {
        console.log(res.userInfo);
        ctx.setData({ userInfo:  res.userInfo })
      }
    })
  }
});