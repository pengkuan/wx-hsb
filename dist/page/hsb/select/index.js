'use strict';

var _product = require('../../../model/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0;
Page({
  data: {
    base: [],
    func: [],
    selects: {},
    funcMap: {},
    product: {}
  },
  onLoad: function onLoad(params) {
    var _this = this;

    ctx = this;
    params = { productId: 38200 };
    _product2.default.productInfo({
      productId: params.productId
    }).then(function (res) {
      var item = res.itemList;
      var base = [],
          outlook = [],
          func = [],
          type = void 0;
      _this.setInitValue(res.itemList);
      item.forEach(function (item, index) {
        type = parseInt(item.conftype);
        if (type === 1) {
          base.push(item);
        } else if (type === 2) {
          outlook.push(item);
        } else if (type === 3) {
          func.push(item);
        }
      });
      func = ctx.funcHandler(func);
      ctx.setData({
        base: base,
        outlook: outlook,
        func: func,
        product: {
          picUrl: res.picurl,
          classId: res.classid,
          productId: res.itemid,
          maxPrice: res.maxprice,
          productName: res.productname,
          standardPrice: res.standardprice
        }
      });
      console.log(ctx.data.product);
    });
  },


  /**
   * 生成功能选项对应的数据结构
   * 功能选项本质是一个具有默认值和可选值的单选框
   * @param {*} data
   */
  funcHandler: function funcHandler(list) {
    var func = [];
    list.map(function (item) {
      var kid = item.id,
          did = void 0,
          oid = void 0,
          desc = void 0,
          picture = void 0;
      var ques = item.question;
      ques.map(function (q, qindex) {
        if (q.show == 0) {
          did = q.id;
        } else {
          oid = q.id;
          desc = q.name;
          picture = q.picture;
        }
      });
      func.push({ kid: kid, did: did, oid: oid, desc: desc, picture: picture });
    });
    return func;
  },


  /**
   * 基本选项 外观选项 切换
   * @param {*} event
   */
  baseTapHandler: function baseTapHandler(event) {
    var selects = ctx.data.selects;
    var dataset = event.currentTarget.dataset;
    selects[dataset.pid] = dataset.cid;
    ctx.setData({ selects: selects });
    ctx.onSelectsChanged();
  },


  /**
   * 设置初始默认值 功能选项有key和value 非功能选项只有key
   * @param {*} list
   */
  setInitValue: function setInitValue(list) {
    var initData = {},
        funcItem = void 0;
    list.map(function (item, index) {
      if (item.conftype != 3) {
        initData[item.id] = "";
      } else {
        funcItem = item.question;
        funcItem.map(function (ques, qindex) {
          if (ques['show'] == 0) {
            initData[item.id] = ques.id;
          }
        });
      }
    });
    ctx.setData({ selects: initData });
    ctx.onSelectsChanged();
  },


  /**
   * 功能选项切换
   * @param {*} event
   */
  funcTapHandler: function funcTapHandler(event) {
    var dataset = event.currentTarget.dataset;
    var selects = ctx.data.selects;
    if (selects[dataset.kid] == dataset.did) {
      selects[dataset.kid] = dataset.oid;
    } else {
      selects[dataset.kid] = dataset.did;
    }
    ctx.setData({ selects: selects });
    ctx.onSelectsChanged();
  },


  /**
   * 监听 selects 做一些猥琐的操作
   * 改变进度条 限制一些选项等等...
   */
  onSelectsChanged: function onSelectsChanged() {
    console.log(ctx.data.selects);
  },


  /**
   * 估价
   */
  onSubmit: function onSubmit() {
    _product2.default.evaluate({
      productId: ctx.data.product.productId,
      selects: Object.values(ctx.data.selects).join('-')
    }).then(function (res) {
      console.log(res);
    }, function (res) {
      console.log(res);
    });
  }
});
//# sourceMappingURL=index.js.map