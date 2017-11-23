import product from '../../../model/product';
let ctx, app = getApp();
Page({

  data: {
    imgUrls: [
      '../../../img/icon1.png',
      '../../../img/icon1.png',
    ],
    cdn: app.globalData.cdn,
    productList: []
  },

  onLoad () {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '回收宝'
    });
    this.getProduct();
  },

  getProduct () {
    product.products({cid: 1, bid: -1, num: 8, pageSize: 8}).then(data => {
      ctx.setData({
        productList: data.productlist.splice(0, 8)
      })
    })
  }
});