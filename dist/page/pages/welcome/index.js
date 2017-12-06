'use strict';

var _user = require('../../../model/user');

var _user2 = _interopRequireDefault(_user);

var _product = require('../../../model/product');

var _product2 = _interopRequireDefault(_product);

var _utils = require('../../../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0,
    app = getApp();

Page({

  data: {
    imgUrls: ['../../../img/banner.png'],
    iconSearch: '../../../img/icon-search.svg',
    cdn: app.globalData.cdn,
    productList: [],
    cateList: [{
      cid: 1,
      bid: -1,
      text: '手机回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-mobile.png'
    }, {
      cid: 3,
      bid: -1,
      text: '平板回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-pad.png'
    }, {
      cid: 2,
      bid: -1,
      text: '笔记本回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-notebook.png'
    }]
  },

  onLoad: function onLoad() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '回收宝'
    });
    _utils2.default.setWhiteNavBar();
    this.getProduct();
  },


  // 获取热门机型
  getProduct: function getProduct() {
    // 先看本地有没有
    var hotList = wx.getStorageSync('hotList');
    if (hotList.length) ctx.setData({
      productList: hotList
    });
    _product2.default.products({ cid: 1, bid: -1, num: 8, pageSize: 8 }).then(function (data) {
      var productList = data.productlist.splice(0, 8);
      ctx.setData({
        productList: productList
      });
      wx.setStorage({
        key: 'hotList',
        data: productList
      });
    });
  },


  // 跳转到选择机型页面
  switchProducts: function switchProducts(e) {
    var dataSet = e.currentTarget.dataset;
    app.globalData.cid = dataSet.cid;
    app.globalData.bid = dataSet.bid;
    wx.switchTab({
      url: '../products/index'
    });
  }
});
//# sourceMappingURL=index.js.map