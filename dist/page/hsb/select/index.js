'use strict';

var _product = require('../../../model/product');

var _product2 = _interopRequireDefault(_product);

var _index = require('../../../config/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0;
var sortOpt = function sortOpt() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
};

Page({
  data: {
    productName: '',
    item: [],
    base: [],
    func: [],
    select: {}
  },
  onLoad: function onLoad(params) {
    ctx = this;
    params = {
      productId: 38200,
      name: 'Iphone8'
    };
    ctx.setData({
      productName: 'Iphone8'
    });
    _product2.default.productInfo({
      productId: params.productId
    }).then(function (res) {
      console.log(res);
      var item = res.itemList;
      var base = [],
          outlook = [],
          func = [],
          type = void 0;
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
      console.log(item);
      ctx.setData({
        base: base, outlook: outlook, func: func
      });
    });
  },
  radioChange: function radioChange(event) {
    var select = ctx.data.select;
    var data = {
      value: event.detail.value,
      key: event.currentTarget.dataset.id,
      index: event.currentTarget.dataset.index
    };

    select[data.key] = data.value;
    ctx.setData({ select: select });
    ctx.onSelectChanged();
  },
  setClick: function setClick(event) {
    var dataSet = event.currentTarget.dataset;
    console.log(dataSet);
  },
  funcHandler: function funcHandler(data) {
    // console.log(data);
  },
  onSelectChanged: function onSelectChanged() {
    // console.log(ctx.data.select);
  }
});
//# sourceMappingURL=index.js.map