import product from '../../../model/product';
let ctx, app = getApp();
Page({
  data: {
    imgUrls: [
      '../../../img/banner.png',
    ],
    iconSearch: '../../../img/icon-search.svg',
    cdn: app.globalData.cdn,
    productList: [],
    cateList: [{
      cid: 1,
      bid: -1,
      text: '手机回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-mobile.png',
    }, {
      cid: 3,
      bid: -1,
      text: '平板回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-pad.png'
    }, {
      cid: 2,
      bid: -1,
      text: '笔记本回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-notebook.png'
    }]
  },
  onLoad () {
    ctx = this;
    wx.setNavigationBarTitle({ title: '回收宝' });
    this.getProduct();
  },
  getProduct () {
    product.products({cid: 1, bid: -1, num: 8, pageSize: 8}).then(data => {
      let productList = data.productlist.splice(0, 8);
      ctx.setData({
        productList
      });
      wx.setStorage({
        key: 'hotList',
        data: productList
      })
    })
  },
  switchProducts (e) {
    let dataSet = e.currentTarget.dataset;
    app.globalData.cid = dataSet.cid;
    app.globalData.bid = dataSet.bid;
    wx.switchTab({
      url: '../products/index'
    })
  }
});