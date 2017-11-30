import product from '../../../model/product';
const Chart = require('../../../util/chart');
let ctx, app = getApp();
Page({

  data: {
    desc: [],
    price: 0,
    months: [],
    values: [],
    selects: [],
    productName: '',
    productId: ''
  },

  onLoad () {
    ctx = this;
  },

  onShow () {
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 1];
    let params = curPage.options;
    let price = parseInt(params.price) / 100;
    let productId = params.productId;
    ctx.setData({
      price,
      productId,
      selects: params.ids,
      desc: params.desc.split('-'),
      productName: params.productName
    });
    product.priceHistory({
      price,
      productId
    }).then(data => {
      ctx.setData({
        months: data.months,
        values: data.prices,
      });
      this.refreshChart();
    })
  },

  // 价格走势图
  refreshChart: () => {
    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    let chart = new Chart({
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
        format: (val) => parseInt(val) + '元'
      }, {
        name: '市场均价',
        color: '#b967ea',
        data: ctx.data.values.map((item) => item * 0.8),
        format: (val) => parseInt(val) + '元'
      }],
      xAxis: {
        disableGrid: true,
        fontColor: '#cacee0'
      },
      yAxis: {
        fontColor: '#cacee0',
        gridColor: '#dddddd',
        format: (val) => parseInt(val),
        min: ctx.data.values[ctx.data.values.length - 1],
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
  switchTrade () {
    let selects = ctx.data.selects;
    let price = ctx.data.price;
    let productId = ctx.data.productId;
    wx.navigateTo({
      url: `../trade/index?selects=${selects}&price=${price}&productId=${productId}`
    })
  }
});