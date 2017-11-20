'use strict';

var ctx = void 0;
Page({
  data: {
    userInfo: {}
  },
  onLoad: function onLoad() {
    ctx = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      withCredentials: false,
      success: function success(res) {
        console.log(res.userInfo);
        ctx.setData({ userInfo: res.userInfo });
      }
    });
  }
});
//# sourceMappingURL=index.js.map