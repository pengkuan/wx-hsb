'use strict';

var _product = require('../../../model/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0,
    app = getApp();

Page({

  data: {
    cateList: [], // 类目列表
    brandList: [], // 品牌列表
    productList: [], // 机型列表
    cid: 1, // 类目id
    bid: -1, // 品牌id
    num: 0, // 机型分页
    hasMore: true, //是否具有更多
    brandScrollTop: 0,
    productScrollTop: 0,
    left: 0,
    iconSearch: '../../../img/icon-search.svg'
  },

  onLoad: function onLoad() {
    ctx = this;
    _product2.default.category().then(function (category) {
      ctx.setData({
        cateList: category.classlist
      });
    });
  },
  onShow: function onShow() {
    var cid = app.globalData.cid;
    var bid = app.globalData.bid;
    var cateList = ctx.data.cateList;
    var index = 0;
    for (var i = 0; i < cateList.length; i++) {
      if (cateList[i]['classid'] == cid) {
        index = i;
        break;
      }
    }
    ctx.setData({
      cid: cid,
      bid: bid,
      left: index / cateList.length * 100 + '%'
    });
    ctx.onCidChanged(bid);
  },


  /**
   * category item Change handler
   */
  cateTapHandler: function cateTapHandler(event) {
    var dataSet = event.currentTarget.dataset;
    ctx.setData({
      cid: dataSet.cid,
      left: dataSet.index / ctx.data.cateList.length * 100 + '%'
    });
    ctx.onCidChanged();
  },


  /**
   * cid change listener
   * this bid from url
   */
  onCidChanged: function onCidChanged(bid) {
    _product2.default.brands({
      cid: ctx.data.cid
    }).then(function (brands) {
      ctx.setData({
        brandList: brands.brandlist,
        bid: brands.brandlist[0]['brandid'],
        brandScrollTop: 0
      });
      bid !== undefined && ctx.setData({ bid: bid });
      var num = 1;
      _product2.default.products({
        cid: ctx.data.cid,
        bid: ctx.data.bid,
        num: 1
      }).then(function (products) {
        ctx.setData({
          productList: products.productlist,
          hasMore: num < products.pagenum,
          num: num,
          productScrollTop: 0
        });
      });
    });
  },


  /**
   * On Brand Change
   * @param event
   */
  brandTapHandler: function brandTapHandler(event) {
    var dataSet = event.currentTarget.dataset;
    ctx.setData({
      bid: dataSet.bid
    });
    ctx.onBrandIdChanged();
  },


  /**
   * cid change listener
   */
  onBrandIdChanged: function onBrandIdChanged() {
    var num = 1;
    _product2.default.products({
      cid: ctx.data.cid,
      bid: ctx.data.bid,
      num: num
    }).then(function (products) {
      ctx.setData({
        productList: products.productlist,
        num: num,
        hasMore: num < products.pagenum,
        productScrollTop: 0
      });
    });
  },
  loadMoreProduct: function loadMoreProduct() {
    if (!ctx.data.hasMore) {
      return;
    }
    var num = ++ctx.data.num;
    _product2.default.products({
      cid: ctx.data.cid,
      bid: ctx.data.bid,
      num: num
    }).then(function (products) {
      var oriProd = ctx.data.productList;
      ctx.setData({
        productList: oriProd.concat(products.productlist),
        hasMore: num < products.pagenum,
        num: num
      });
    });
  }
});
//# sourceMappingURL=index.js.map