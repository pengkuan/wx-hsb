import user from '../../../model/user';
import product from '../../../model/product';
import Utils from '../../../util/utils';
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
    }],
    curModel: 'iPhone5s', // 默认当前的设备名
    curModelInfo: null
  },

  onLoad () {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '回收宝'
    });
    Utils.setWhiteNavBar();
    this.getProduct();
    wx.getSystemInfo({
      success (res) {
        let name = res.model.split("<")[0];
        ctx.setData({
          curModel: name
        })
        ctx.getModelInfo(name);
      }
    })
  },

  // 获取热门机型
  getProduct () {
    // 先看本地有没有
    let hotList = wx.getStorageSync('hotList');
    if(hotList.length)
      ctx.setData({
        productList: hotList
      });
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

  // 跳转到选择机型页面
  switchProducts (e) {
    let dataSet = e.currentTarget.dataset;
    app.globalData.cid = dataSet.cid;
    app.globalData.bid = dataSet.bid;
    wx.switchTab({
      url: '../products/index'
    })
  },

  getModelInfo (key) {
    product.search({
      key: encodeURIComponent(key),
      pageIndex: 20
    }).then(res => {
      if (!(res.productlist && res.productlist.length)) return;
        let list = res.productlist;
        list.forEach(item => {
          if (item.productname === key) {
            ctx.setData({
              curModelInfo: item
            })
          }
        })
    }, err => {
      console.log(err);
    })
  },

  switchPage (e) {
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataset.url,
    })
  }
});