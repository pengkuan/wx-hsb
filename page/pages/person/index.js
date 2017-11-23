import user from '../../../model/user';
let ctx;
Page({
  data: {
    userInfo: {}
  },
  onLoad() {
    ctx = this;
    user.getWxOpenInfo().then(res => {
      ctx.setData({
        userInfo: res
      })
    });
  }
});