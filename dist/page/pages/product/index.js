'use strict';

var _utils = require('../../../util/utils');

var _utils2 = _interopRequireDefault(_utils);

var _product = require('../../../model/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0,
    app = getApp();
Page({

  data: {
    base: [],
    func: [],
    selects: {},
    funcMap: {},
    product: {},
    pInfo: {},
    baseStore: [],
    cdn: app.globalData.cdn,
    baseSelect: [],
    funcSelect: [],
    len: 0
  },

  onLoad: function onLoad() {
    var _this = this;

    ctx = this;
    _utils2.default.setWhiteNavBar();
    var params = _utils2.default.getCurPageOpt();
    _product2.default.productInfo({
      productId: params.productId
    }).then(function (res) {
      var item = res.itemList;
      var base = [],
          func = [],
          type = void 0;
      item.forEach(function (item) {
        type = parseInt(item.conftype);
        if (type === 1 || type === 2) {
          base.push(item);
        } else if (type === 3) {
          func.push(item);
        }
      });
      _this.setValues(base, 'base');
      _this.setValues(func, 'func');
      func = ctx.funcHandler(func);
      ctx.setData({
        base: base,
        func: func,
        pInfo: {
          picUrl: res.picurl,
          classId: res.classid,
          productId: res.itemid,
          maxPrice: res.maxprice,
          productName: res.productname,
          standardPrice: res.standardprice
        }
      });
    });
  },


  /**
   * 生成功能选项对应的数据结构
   * 功能选项本质是一个具有默认值和可选值的单选框
   * @param {*} list
   */
  funcHandler: function funcHandler(list) {
    var func = [];
    list.map(function (item) {
      var kid = item.id,
          did = void 0,
          oid = void 0,
          desc = void 0,
          picture = void 0,
          otext = void 0,
          dtext = void 0;
      var ques = item.question;
      ques.map(function (q) {
        if (q.show == 0) {
          did = q.id;
          dtext = q.name;
        } else {
          oid = q.id;
          desc = q.name;
          picture = q.picture;
          otext = q.name;
        }
      });
      func.push({ kid: kid, did: did, oid: oid, desc: desc, picture: picture, otext: otext, dtext: dtext });
    });
    return func;
  },


  /**
   * 基本选项 外观选项 切换
   * @param {*} e
   */
  baseTapHandler: function baseTapHandler(e) {
    var dataset = e.currentTarget.dataset;
    var baseSelect = ctx.data.baseSelect;
    for (var i = 0; i < baseSelect.length; i++) {
      if (baseSelect[i]['pid'] === dataset.pid) {
        baseSelect[i]['cid'] = dataset.cid;
        baseSelect[i]['ctext'] = dataset.cname;
      }
    }
    ctx.setData({
      baseSelect: baseSelect
    });
    ctx.onSelectsChanged();
  },
  setValues: function setValues(data) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base';

    var select = [];
    data.map(function (item) {
      var temp = {};
      temp['pid'] = item.id;
      temp['ptext'] = item.name;
      temp['cid'] = "";
      temp['ctext'] = "";
      if (item.conftype == 3) {
        item.question.map(function (ques) {
          if (ques['show'] == 0) {
            temp['cid'] = ques.id;
            temp['ctext'] = ques.name;
          }
        });
      }
      select.push(temp);
    });
    if (type == 'base') ctx.setData({ baseSelect: select });
    if (type == 'func') ctx.setData({ funcSelect: select });
    ctx.onSelectsChanged();
  },


  /**
   * 功能选项切换
   * @param {*} e
   */
  funcTapHandler: function funcTapHandler(e) {
    var dataset = e.currentTarget.dataset;
    var funcSelect = ctx.data.funcSelect;
    console.log(dataset);
    for (var i = 0; i < funcSelect.length; i++) {
      if (funcSelect[i]['pid'] == dataset.kid) {
        var flag = funcSelect[i]['cid'];
        if (flag == dataset.oid) {
          funcSelect[i]['cid'] = dataset.did;
          funcSelect[i]['ctext'] = dataset.dtext;
        } else {
          funcSelect[i]['cid'] = dataset.oid;
          funcSelect[i]['ctext'] = dataset.otext;
        }
      }
    }
    ctx.setData({
      funcSelect: funcSelect
    });
    ctx.onSelectsChanged();
  },


  /**
   * 监听 selects 做一些猥琐的操作
   * 改变进度条 限制一些选项等等...
   */
  onSelectsChanged: function onSelectsChanged() {
    var len = 0,
        baseSelect = ctx.data.baseSelect;
    for (var i = 0; i < baseSelect.length; i++) {
      if (baseSelect[i]['cid'].length) len++;
    }
    ctx.setData({
      len: len
    });
  },


  /**
   * 估价
   */
  onSubmit: function onSubmit() {
    var pInfo = ctx.data.pInfo;
    var bs = ctx.data.baseSelect;
    var fs = ctx.data.funcSelect;
    var arr = bs.concat(fs);
    var ids = arr.map(function (item) {
      return item.cid;
    });
    var desc = arr.map(function (item) {
      return item.ctext;
    });
    _product2.default.evaluate({
      productId: ctx.data.pInfo.productId,
      selects: ids.join('-')
    }).then(function (data) {
      wx.navigateTo({
        url: '../price/index?price=' + data.quotation + '&ids=' + ids.join('-') + '&desc=' + desc.join('-') + '&productId=' + pInfo.productId + '&productName=' + pInfo.productName + '&classId=' + pInfo.classId
      });
    }, function (res) {
      console.log(res);
    });
  },
  showPictures: function showPictures(e) {
    console.log(e);
  }
});
//# sourceMappingURL=index.js.map