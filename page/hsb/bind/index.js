import user from '../../../model/user';
let ctx;
Page({

  data: {
    tel: "",
    code: "",
    openid: "",
    unionid: "",
  },

  onLoad (params) {
    ctx = this;
    wx.setNavigationBarTitle({title: '绑定手机号'});
    ctx.setData({
      openid: params.openid,
      unionid: params.unionid
    });
  },

  // 获取短信验证码
  getCode () {
    user.getCode().then(data => {
      let showInfo = {
        title: '提示',
        icon: 'loading',
      };
      if (data.retcode == 0) {
        showInfo.title = "发送短信成功";
        showInfo.icon = 'success'
      } else {
        showInfo.title = data.retinfo;
      }
      wx.showToast(showInfo);
    })
  },

  onTelChanged (e) {
    let value = e.detail.value;
    this.setData({
      tel: value
    })
  },

  onSubmit () {
    console.log(this.data);
  }
});