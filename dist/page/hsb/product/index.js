'use strict';

var _product = require('../../../model/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0;

Page({
  data: {
    cateList: [], // 类目列表
    brandList: [], // 品牌列表
    productList: [], // 机型列表
    cid: 1, // 类目id
    bid: undefined, // 品牌id
    num: 0, // 机型分页
    hasMore: true, //是否具有更多
    brandScrollTop: 0,
    productScrollTop: 0
  },
  onLoad: function onLoad(params) {
    ctx = this;
    // params.bid = 3;
    _product2.default.category().then(function (category) {
      ctx.setData({
        cateList: category.classlist,
        cid: category.classlist[0]['classid']
      });
      if (params.cid) ctx.setData({ cid: params.cid });
      ctx.onCidChanged(params.bid);
    });
  },


  /**
   * category item Change handler
   */
  cateTapHandler: function cateTapHandler(event) {
    var dataSet = event.currentTarget.dataset;
    ctx.setData({ cid: dataSet.cid });
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
  onProductNumChanged: function onProductNumChanged() {},
  refreshProduct: function refreshProduct() {
    console.log('upper');
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
  },

  upper: function upper(e) {
    console.log(e);
  },
  lower: function lower(e) {
    console.log(e);
  },
  scroll: function scroll(e) {
    console.log(e);
  },
  scrollToTop: function scrollToTop(e) {
    this.setAction({
      scrollTop: 0
    });
  },
  tap: function tap(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        });
        break;
      }
    }
  },
  tapMove: function tapMove(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    });
  }
});
//# sourceMappingURL=index.js.map