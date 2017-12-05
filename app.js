import user from './model/user';
import partner from './model/partner';
App({
  globalData: {
    cid: 1,
    bid: -1,
    pid: 1196,
    cdn: 'http://s1.huishoubao.com/img/phone/'
  },
  // 用户切换到后台时 清除登录态
  onHide () {
    this.clearUserInfo();
    partner.setPartnerInfo({
      appId: '',
      extraData: {}
    })
  },
  // 清除登录态
  clearUserInfo () {
    wx.removeStorage({
      key: 'userInfo'
    });
  },
  onShow (data) {
    // 小程序打开小程序
    if(data.scene == 1037) {
      let appId = data.referrerInfo.appId;
      let extraData = JSON.parse(data.referrerInfo.extraData);
      partner.setPartnerInfo({
        appId,
        extraData
      });
      this.globalData.pid = extraData.pid;
    }
    this.login();
  },
  login () {
    user.getWxCode().then(code => {
      user.getWxOpenId(code).then(data => {
        // 保存wx票据 绑定和解绑都有用到
        user.setWxToken(data);
        console.log('setWxToken', data);
        user.login(data.openid).then(loginRes => {
          // 保存账户的回收宝信息
          user.setUserInfo(loginRes);
          console.log('setUserInfo', loginRes);
        }, err => {
          // C++不支持errCode识别，这里假设错误都是用户没有绑定手机号
          console.log(err);
          user.setUserInfo({});
        })
      })
    })
  },
});