import user from '../../../model/user';
let ctx, app = getApp();

/**
 * 关于 storage userInfo 的使用预定
 * userInfo 为空对象说明用户未绑定手机号
 * userInfo 有key值说明用户已经绑定手机号
 */

Page({

  data: {
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

  onShow() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '个人中心'
    });
    user.getWxOpenInfo().then(res => {
      ctx.setData({
        wxOpenInfo: res
      })
    });

    let userInfo = user.getUserInfo();
    if (!(userInfo && userInfo.tel && userInfo.us_uid)) {
      ctx.login();
    } else {
      ctx.setData({
        userInfo
      });
    }
  },

  login () {
    user.getWxCode().then(code => {
      user.getWxOpenId(code).then(data => {
        // 保存wx票据 绑定和解绑都有用到
        user.setWxToken(data);
        user.login(data.openid).then(loginRes => {
          // 保存账户的回收宝信息
          user.setUserInfo(loginRes);
          ctx.setData({
            userInfo: loginRes
          });
        }, err => {
          // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
          console.log(err);
          user.setUserInfo({});
          // wx.navigateTo({ url: `../bind/index?openid=${ data.openid }&unionid=${ data.unionid }` })
        })
      })
    })
  },

  // 绑定解绑手机号
  switchBind (e) {
    let dataSet = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../bind/index?type=${dataSet.type}`
    })
  },

  // 页面跳转
  switchPage (e) {
    let dataSet = e.currentTarget.dataset;
    let userInfo = ctx.data.userInfo;
    if(dataSet.url === '../orders/index' || dataSet.url === '../coupons/index') {
      if(!userInfo.tel) {
        wx.showModal({
          title: '提示',
          content: '请先绑定手机号',
          showCancel: false
        })
      } else {
        wx.navigateTo({
          url: dataSet.url
        })
      }
    } else {
      wx.navigateTo({
        url: dataSet.url
      })
    }
  },

  dialNumber (e) {
    wx.makePhoneCall({
      phoneNumber: '4000809966'
    })
  }
});