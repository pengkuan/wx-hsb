import product from '../../../model/product';
const Chart = require('../../../util/chart');
let ctx, app = getApp();
Page({

  data: {
    selectText: ['大陆国行', '64G', '保修一个月以上', '大陆国行', '64G', '保修一个月以上', '大陆国行', '64G'],
    price: 44500,
    months: [8, 9, 10, 11, 12],
    values: [601, 565, 520, 500, 464]
  },

  onLoad () {
    ctx = this;
  },

  onShow () {
    this.refreshChart();
    product.priceHistory({
      price: 500
    }).then(data => {
      ctx.setData({
        months: data.months,
        values: data.prices
      });
      this.refreshChart();
    }, err => {
      console.log(err);
      this.refreshChart();
    })
  },

  refreshChart: () => {
    let windowWidth = 320;
    let months = ctx.data.months;
    console.log(months);
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
});