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
    productId: '',
    isOpen: false
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
      productName: params.productName,
      classId: params.classId
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
    let months = ctx.data.months;
    months = months.map(item => item + '月')
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    let chart = new Chart({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: months,
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
        fontColor: '#cacee0',
        format: (val) => parseInt(val),
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
    let data = ctx.data;
    let selects = data.selects;
    let price = data.price;
    let productId = data.productId;
    let classId = data.classId;
    let productName = data.productName;
    wx.navigateTo({
      url: `../trade/index?selects=${selects}&price=${price}&productId=${productId}&classId=${classId}&productName=${productName}`
    })
  },

  toggleOptions () {
    ctx.setData({
      isOpen: !ctx.data.isOpen
    })
  },

  goBack () {
    wx.navigateBack()
  }
});