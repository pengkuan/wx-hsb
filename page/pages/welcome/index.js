import user from '../../../model/user';
import product from '../../../model/product';
import Utils from '../../../util/utils';
let ctx, app = getApp();

Page({

  data: {
    imgUrls: [
      '../../../img/banner-1.png',
    ],
    iconSearch: '../../../img/icon-search.svg',
    cdn: app.globalData.cdn,
    productList: [],
    cateList: [{
      cid: 1,
      bid: -1,
      text: '手机回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-mobile-1.png',
    }, {
      cid: 3,
      bid: -1,
      text: '平板回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-pad-1.png'
    }, {
      cid: 2,
      bid: -1,
      text: '笔记本回收',
      path: '../products/index',
      imgSrc: '../../../img/icon-notebook-1.png'
    }],
    curModel: 'iPhone5s', // 默认当前的设备名
    curModelInfo: null
  },

  onLoad () {
    ctx = this;
    this.getProduct();
    wx.getSystemInfo({
      success (res) {
        console.log(res);
        let brand = res.brand;
        let model = res.model;
        if (!brand) {
          brand = model.split(' ')[0];
        }
        //安卓&iPhone判断
        let curModelInfo = {};
        if (brand.toLowerCase() === 'iphone') {
          console.log(1);
          brand = 'APPLE';
          model = model.split('<')[1].slice(0, -1);//iphone 7<iphone9,1>
          ctx.brandMap(brand, model, function (data) {
            if (data && data.modelList.length){
              curModelInfo = data.modelList[0];
              ctx.setData({
                curModelInfo,
                curModel: model
              });
            }
          });
        } else {
          console.log(2);
          ctx.brandMap(brand, model, function (data) {
            if (!data || !data.modelList.length){
              console.log(4);
              ctx.brandMap(brand, (brand+' '+model), function (data) {
                if (!data || !data.modelList.length) {
                  console.log(6);
                  brand=brand.toUpperCase();
                  ctx.brandMap(brand, model, function (data) {
                    if (!data || !data.modelList.length) {
                      console.log(8);
                      ctx.brandMap(brand, (brand + ' ' + model), function (data) {
                        if (data && data.modelList.length) {
                          curModelInfo = data.modelList[0];
                          console.log(9);
                          ctx.setData({
                            curModelInfo,
                            curModel: model
                          });
                        }
                      });
                    }else{
                      curModelInfo = data.modelList[0];
                      console.log(7);
                      ctx.setData({
                        curModelInfo,
                        curModel: model
                      });
                    }
                  });
                }else{
                  curModelInfo = data.modelList[0];
                  console.log(5);
                  ctx.setData({
                    curModelInfo,
                    curModel: model
                  });
                }
              });
            }else{
              curModelInfo = data.modelList[0];
              console.log(3);
              console.log(curModelInfo);
              ctx.setData({
                curModelInfo,
                curModel: model
              });
            }
          });
          // var and1 = new Promise(function (resolve, reject) {
          //   ctx.brandMap(brand, model, function (data) {
          //     resolve(data);
          //   });
          // });
          // var and2 = new Promise(function (resolve, reject) {
          //   ctx.brandMap(brand, (brand + ' ' + model), function (data) {
          //     resolve(data);
          //   });
          // });

          // brand = brand.toUpperCase();
          // var and3 = new Promise(function (resolve, reject) {
          //   ctx.brandMap(brand, model, function (data) {
          //     resolve(data);
          //   });
          // });
          // var and4 = new Promise(function (resolve, reject) {
          //   ctx.brandMap(brand, (brand + ' ' + model), function (data) {
          //     resolve(data);
          //   });
          // });
          // var p = Promise.all([and1, and2, and3, and4]);
          // p.then(function (val) {
          //   console.log(val);
          // });//结果:['aaa','bbb']
        }
      }
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '回收宝',
      path: 'page/pages/welcome/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  // 获取热门机型
  getProduct () {
    // 先看本地有没有
    let hotList = wx.getStorageSync('hotList');
    if(hotList.length)
      ctx.setData({
        productList: hotList
      });
    product.products({cid: 1, bid: -1, num: 1, pageSize: 8}).then(data => {
      let productList = data.productlist.splice(0, 4);
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
    wx.navigateTo({
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

  brandMap (brand, model,fn) {
    console.log(brand);
    console.log(model);
    product.queryModel(brand, model).then(res=>{
      // console.log(res);
      // if (res && res.modelList.length){
      //   fn(res.modelList[0]);
      // }
      fn(res);
    });
  },

  switchPage (e) {
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataset.url,
    })
  }
});