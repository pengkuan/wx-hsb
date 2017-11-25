import user from '../../../model/user';
let ctx, timeId, app = getApp();
Page({

  data: {
    type: 'bind',
    tel: '',
    code: "",
    openid: "",
    unionid: "",
    isValidTel: false,
    counter: 0 // 默认只需等待0秒
  },

  onLoad (params) {
    ctx = this;
    // 可能没有
    let tel = user.getUserInfo().tel;
    let title = params.type === 'bind' ? '绑定手机' : '解绑手机';
    wx.setNavigationBarTitle({
      title,
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      fail (err) {
        console.log(err)
      }
    });
    // 有可能没有token 比如直接编译当前页面
    let wxToken = user.getWxToken();
    ctx.setData({
      type: params.type,
      tel: tel ? tel : '',
      openid: wxToken.openid,
      unionid: wxToken.unionid,
      isValidTel: tel && tel.length === 11
    });
    if (Object.keys(wxToken).length === 0) {
      user.getWxCode().then(code => {
        user.getWxOpenId(code).then(wxToken => {
          user.setWxToken(wxToken);
          ctx.setData({
            openid: wxToken.openid,
            unionid: wxToken.unionid
          });
        })
      })
    }
  },

  /**
   * 获取短信验证码
   * tel 已经校验过了
   */
  getCode () {
    let tel = ctx.data.tel;
    ctx.setData({
      counter: 30
    });
    ctx.counting();
    user.getCode({tel}).then(data => {
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

  counting () {
    let counter = ctx.data.counter;
    if (counter === 0) return;
    timeId = setTimeout(() => {
      ctx.setData({
        counter: counter - 1
      });
      ctx.counting();
    }, 1000)
  },

  handleTel (e) {
    let tel = e.detail.value;
    this.setData({
      tel,
      isValidTel: tel && tel.length === 11
    })
  },

  handleCode (e) {
    let value = e.detail.value;
    this.setData({
      code: value
    })
  },

  clearTel () {
    ctx.setData({
      tel: '',
      isValidTel: false,
      code: ''
    })
  },

  /**
   * 解绑手机号
   * 需用用户登录
   */
  unbindTel () {
    let data = ctx.data;
    let userInfo = user.getUserInfo();
    console.log(userInfo);
    user.authUserUnbindTel({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey,
      openid: data.openid
    }).then(res => {
      console.log(res);
      // 解绑成功清除回收宝账户信息
      // user.setUserInfo({});
      app.globalData.userInfo = {};
      wx.reLaunch({
        url: '../person/index',
        success (err) {
          console.log(err)
        },
        fail (err) {
          console.log(err)
        }
      });
    })
  },

  // 绑定手机号
  submit () {
    let data = ctx.data;
    if (data.type == 'bind') ctx.bindTelLogin();
    if (data.type == 'unbind') ctx.unbindTel()
  },

  bindTelLogin () {
    let data = ctx.data;
    // 绑定手机号
    user.bindTelLogin({
      tel: data.tel,
      code: data.code,
      openid: data.openid,
      unionid: data.unionid,
    }).then(res => {
      app.globalData.userInfo = res.data;
      wx.reLaunch({
        url: '../person/index',
        success (err) {
          console.log(err)
        },
        fail (err) {
          console.log(err)
        }
      });
        // wx.setStorage({
        //   key: 'userInfo',
        //   data: res.data,
        //   success () {
        //     wx.reLaunch({
        //       url: '../person/index',
        //       success (err) {
        //         console.log(err)
        //       },
        //       fail (err) {
        //         console.log(err)
        //       }
        //     });
        //   }
        // });
    }, err => {
      wx.showToast({title: err})
    })
  },
});