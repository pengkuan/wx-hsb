import product from '../../../model/product';
let ctx, app = getApp();
Page({

  data: {
    selectText: ['大陆国行', '64G', '保修一个月以上', '大陆国行', '64G', '保修一个月以上', '大陆国行', '64G'],
    price: 44500,
    month: [],
    values: []
  },

  onShow () {

  },

  refreshChart: (price) => {
    price = parseFloat(price);
    let x4 = price;
    let x5 = x4 / (1 - 0.07);
    let x3 = x4 / (1 - 0.04);
    let x2 = x3 / (1 - 0.08);
    let x1 = x2 / (1 - 0.06);
    let month = new Date().getMonth();
    let x3month = (month - 1 + 12) % 12 + 1;
    let x2month = (month - 2 + 12) % 12 + 1;
    let x1month = (month - 3 + 12) % 12 + 1;
    let x5month = (month + 1) % 12 + 1 ;
    let x4month = month + 1;
    ctx.data.month = [];
    ctx.data.month.push(x1month);
    ctx.data.month.push(x2month);
    ctx.data.month.push(x3month);
    ctx.data.month.push(x4month);
    ctx.data.month.push(x5month);

    ctx.data.values = [];
    ctx.data.values.push(parseInt(x1));
    ctx.data.values.push(parseInt(x1 * 3 / 4));
    ctx.data.values.push(parseInt(x1 / 2));
    ctx.data.values.push(parseInt(x1 / 4));
    ctx.setData({
      month: ctx.data.month,
      values: ctx.data.values
    })
  },
});