App({
  requireData: {
    products: require('page/hsb/modules/model/products.js'),
    plus: require('page/hsb/modules/plus.js'),
    cityHTTP: require('page/hsb/modules/model/city.js'),
    user: require('page/hsb/modules/model/user.js'),
    order: require('page/hsb/modules/model/order.js'),
    sfOther: require('page/hsb/modules/model/other.js'),
    url: require('page/hsb/modules/url.js'),
  },
  globalData: {
    cid: undefined,
    bid: undefined,
    pid: 1196,
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