'use strict';

var _utils = require('../../../util/utils');

var _utils2 = _interopRequireDefault(_utils);

var _coupon = require('../../../model/coupon');

var _coupon2 = _interopRequireDefault(_coupon);

var _user = require('../../../model/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0,
    app = getApp();

Page({

  data: {
    menuIndex: 0,
    left: 0,
    unUsedCoupon: [],
    usedCoupon: [],
    outTimeCoupon: [],
    menuList: [{
      text: '未使用',
      length: 2
    }, {
      text: '已使用',
      length: 2
    }, {
      text: '已过期',
      length: 2
    }],
    token: '',
    couponList: []
  },

  onShow: function onShow() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '我的优惠券'
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
    var userInfo = _user2.default.getUserInfo();
    ctx.setData({
      userInfo: userInfo
    });
    ctx.loadCoupons();
  },
  loadCoupons: function loadCoupons() {
    var userInfo = ctx.data.userInfo;
    var unUsedCoupon = [];
    var usedCoupon = [];
    var outTimeCoupon = [];
    var curTime = _utils2.default.curTimeStamp();
    var menuList = ctx.data.menuList;
    _coupon2.default.page({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey
    }).then(function (cps) {
      cps = cps.map(function (item) {
        var timeObj = _utils2.default.formatDate(parseInt(item.invalidTime) * 1000);
        item.deadline = timeObj.Y + '-' + timeObj.M + '-' + timeObj.D;
        item.value = parseInt(item.faceValue) / 1000;
        return item;
      });
      cps.map(function (item) {
        if (item.status != 10) {
          // 已经使用
          usedCoupon.push(item);
        } else if (parseInt(item.invalidTime) * 1000 < curTime) {
          // 已经过期
          outTimeCoupon.push(item);
        } else {
          unUsedCoupon.push(item);
        }
      });
      menuList[0]['data'] = unUsedCoupon;
      menuList[1]['data'] = usedCoupon;
      menuList[2]['data'] = outTimeCoupon;
      _utils2.default.sortByKey(cps, 'value');
      ctx.setData({
        couponList: cps,
        usedCoupon: usedCoupon,
        unUsedCoupon: unUsedCoupon,
        outTimeCoupon: outTimeCoupon,
        menuList: menuList
      });
    }, function (err) {
      console.log(err);
    });
  },
  setLeft: function setLeft() {
    var left = ctx.data.menuIndex / 3 * 100;
    ctx.setData({
      left: left
    });
  },
  handleMenu: function handleMenu(e) {
    var dataset = e.currentTarget.dataset;
    console.log(dataset);
    ctx.setData({
      menuIndex: dataset.index
    });
  },
  handleToken: function handleToken(e) {
    ctx.setData({
      token: e.detail.value
    });
  },
  addCoupon: function addCoupon() {
    _coupon2.default.add({
      token: ctx.data.token,
      uid: ctx.data.userInfo.us_uid
    }).then(function (res) {
      wx.showToast({
        title: '添加成功'
      });
      ctx.loadCoupons();
    }, function (err) {
      wx.showModal({
        title: '提示',
        content: err,
        showCancel: false
      });
    });
  }
});
//# sourceMappingURL=index.js.map