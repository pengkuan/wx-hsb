'use strict';

var _product = require('../../../model/product');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Chart = require('../../../util/chart');
var ctx = void 0,
    app = getApp();
Page({

  data: {
    desc: [],
    price: 0,
    months: [],
    values: [],
    selects: [],
    productName: '',
    productId: '',
    isOpen: false
  },

  onLoad: function onLoad() {
    ctx = this;
  },
  onShow: function onShow() {
    var _this = this;

    var pages = getCurrentPages();
    var curPage = pages[pages.length - 1];
    var params = curPage.options;
    var price = parseInt(params.price) / 100;
    var productId = params.productId;
    ctx.setData({
      price: price,
      productId: productId,
      selects: params.ids,
      desc: params.desc.split('-'),
      productName: params.productName,
      classId: params.classId
    });
    _product2.default.priceHistory({
      price: price,
      productId: productId
    }).then(function (data) {
      ctx.setData({
        months: data.months,
        values: data.prices
      });
      _this.refreshChart();
    });
  },


  // 价格走势图
  refreshChart: function refreshChart() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var chart = new Chart({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ctx.data.months,
      animation: true,
      legend: false,
      dataLabel: false,
      series: [{
        name: '回收宝价',
        color: '#fabe00',
        data: ctx.data.values,
        format: function format(val) {
          return parseInt(val) + '元';
        }
      }, {
        name: '市场均价',
        color: '#b967ea',
        data: ctx.data.values.map(function (item) {
          return item * 0.8;
        }),
        format: function format(val) {
          return parseInt(val) + '元';
        }
      }],
      xAxis: {
        disableGrid: true,
        fontColor: '#cacee0'
      },
      yAxis: {
        fontColor: '#cacee0',
        gridColor: '#dddddd',
        format: function format(val) {
          return parseInt(val);
        },
        min: ctx.data.values[ctx.data.values.length - 1]
      },
      width: windowWidth,
      height: 200,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  // 跳转到下单页面
  switchTrade: function switchTrade() {
    var selects = ctx.data.selects;
    var price = ctx.data.price;
    var productId = ctx.data.productId;
    var classId = ctx.data.classId;
    wx.navigateTo({
      url: '../trade/index?selects=' + selects + '&price=' + price + '&productId=' + productId + '&classId=' + classId
    });
  },
  toggleOptions: function toggleOptions() {
    ctx.setData({
      isOpen: !ctx.data.isOpen
    });
  }
});
//# sourceMappingURL=index.js.map