import user from '../../../model/user';
let ctx, app = getApp();
Page({

  data: {
    openid: '',
    unionid: '',
    userInfo: {},
    wxOpenInfo: {},
    grid1Cols: [{
      text: '我的订单',
      path: '../orders/index',
      icon: '../../../img/icon-order.png',
    }, {
      text: '我的优惠券',
      path: '../coupons/index',
      icon: '../../../img/icon-coupon.png',
    }, {
      text: '邮寄地址',
      path: '../address/index',
      icon: '../../../img/icon-addr.png',
    }]
  },

  onLoad() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '个人中心'
    });
    user.getWxOpenInfo().then(res => {
      ctx.setData({
        wxOpenInfo: res
      })
    });
  },

  onShow() {
    let userInfo = user.getUserInfo();
    if (!(userInfo && userInfo.tel && userInfo.us_uid)) {
      ctx.login();
    } else {
      ctx.setData({
        userInfo
      });
    }
    let wxToken = user.getWxToken();
    ctx.setData({
      openid: wxToken.openid,
      unionid: wxToken.unionid,
    });
    if (Object.keys(wxToken).length === 0) {
      user.getWxOpenId().then(wxToken => {
        user.setWxToken(wxToken);
        ctx.setData({
          openid: wxToken.openid,
          unionid: wxToken.unionid
        });
      })
    }
  },

  login() {
    user.getWxOpenId().then(data => {
      // 保存wx票据 绑定和解绑都有用到
      user.setWxToken(data);
      user.login(data.openId, data.unionId).then(loginRes => {
        // 保存账户的回收宝信息
        user.setUserInfo(loginRes);
        ctx.setData({
          userInfo: loginRes
        });
      }, err => {
        // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
        console.log(err);
        ctx.setData({
          userInfo: {}
        });
        user.setUserInfo({});
        // wx.navigateTo({ url: `../bind/index?openid=${ data.openid }&unionid=${ data.unionid }` })
      })
    })
  },

  // 绑定解绑手机号
  switchBind(e) {
    let dataSet = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../bind/index?type=${dataSet.type}`
    })
  },

  // 页面跳转
  switchPage(e) {
    let dataSet = e.currentTarget.dataset;
    let userInfo = ctx.data.userInfo;
    if (dataSet.url === '../orders/index' || dataSet.url === '../coupons/index') {
      if (!userInfo.tel) {
          wx.showModal({
            title: '提示',
            content: '请先绑定手机号',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: `../bind/index?type=${dataSet.type}`
              });
            }
          })
      } else {
        wx.navigateTo({url: dataSet.url})
      }
    } else {
      wx.navigateTo({url: dataSet.url})
    }
  },

  /**
   * 解绑手机号需用用户登录
   * 解绑成功清除回收宝账户信息
   */
  unbindTel() {
    let data = ctx.data;
    let userInfo = user.getUserInfo();
    wx.showModal({
      title: '提示',
      content: '您真的要取消吗？',
      success: function (res) {
        if (!res.confirm) return false;
        user.authUserUnbindTel({
          uid: userInfo.us_uid,
          userkey: userInfo.userkey,
          openid: data.openid
        }).then(res => {
          user.setUserInfo({});
          ctx.setData({
            userInfo: {}
          })
        }, err => {
          console.log(err);
          wx.showModal({
            title: '提示',
            content: err,
            showCancel: false
          })
        })
      }
    });
  },

  dialNumber(e) {
    wx.makePhoneCall({
      phoneNumber: '4000809966'
    })
  }
});