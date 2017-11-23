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
    let tel = ctx.data.tel;
    console.log(tel);
    user.getCode({ tel }).then(data => {
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

  telHandler (e) {
    let value = e.detail.value;
    this.setData({ tel: value })
  },

  codeHandler (e) {
    let value = e.detail.value;
    this.setData({ code: value })
  },

  submit () {
    let data = ctx.data;
    console.log(data);
    user.bindTelLogin({
      tel: data.tel,
      code: data.code,
      openid: data.openid,
      unionid: data.unionid,
    }).then(res => {
      if(res.retcode == 0) {
        wx.setStorage({
          key: userinfo,
          data: res.data,
          success () {
            wx.navigateBack();
          }
        });
      }
    }, err => {
      wx.showToast({ title: err })
    })
  }
});