// import amapFile from '../../../util/amap-wx';
import { gdKey } from '../../../config/index';
import Utils from '../../../util/utils';
import cabinet from '../../../model/cabinet';
// import 'http://webapi.amap.com/maps?v=1.4.5&key=19932279131320c2dbbbd31c7a8a05e7';
// import 'http://cache.amap.com/lbs/static/addToolbar.js';
let ctx;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: [],
    includePoints: [],
    scale: 16,
    open: false,
    textData: [],
    mapHeight: 0,
    footerMaxHeight: 500,
    winHeight: 0,
    // scrollTop: 0,
    // startTop: 0,
    // startTime: 0,
    // scrollY: true,
    controls: [{
      id: 1,
      iconPath: '../../../img/fcmap/dingweitu.png',
      position: {
        left: 1.5,
        top: 6.5,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    toSelf: true,
    devicePer: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let longitude, latitude;
    ctx = this;
    if (options.location) {
      longitude = options.location.split(',')[0];
      latitude = options.location.split(',')[1];
      ctx.setData({
        longitude,
        latitude
      })
    } else {
      Utils.getLocation().then(res => {
        console.log(res)
        let longitude = res[0].longitude;
        let latitude = res[0].latitude;
        ctx.setData({
          longitude,
          latitude
        })
      });
    }
  },
  controltap(e) {
    let controls = ctx.data.controls;
    if(ctx.data.toSelf){
      controls[0].iconPath = '../../../img/fcmap/dangqianweizhi.png'
      ctx.mapCtx.moveToLocation();
      ctx.setData({
        toSelf: false,
        controls
      })
    }else{
      controls[0].iconPath = '../../../img/fcmap/dingweitu.png'
      ctx.mapCtx.includePoints({
        padding: [50,50,50,50],
        points: ctx.data.includePoints
        // points: [{
        //   latitude: ctx.data.latitude,
        //   longitude: ctx.data.longitude,
        // }]
      })
      ctx.setData({
        toSelf: true,
        scale: 16,
        controls
      })
    }
  },
  // touchStart(e){
  //   // if (ctx.data.scrollY == true) return;
  //   console.log(e);
  //   ctx.setData({
  //     scrollTop: e.changedTouches[0].clientY,
  //     startTop: e.changedTouches[0].clientY,
  //     startTime: +new Date()
  //   })
  // },
  // touchMove(e) {
  //   if (ctx.data.scrollY == true) return;
  //   let scrollHeight = ctx.data.startTop - e.changedTouches[0].clientY;
  //   let scrollDir = ctx.data.scrollTop - e.changedTouches[0].clientY;
  //   let timelong = +new Date() -  ctx.data.startTime;
  //   if (ctx.fullH <= ctx.data.footerMaxHeight && scrollDir > 0) scrollHeight = 0;
  //   ctx.setData({
  //       mapHeight: ctx.data.mapHeight - scrollHeight,
  //       footerMaxHeight: ctx.data.footerMaxHeight + scrollHeight,
  //       startTop: e.changedTouches[0].clientY
  //     })
  // },
  // touchEnd(e){
  //   // if (ctx.data.scrollY == true) return;
  //   let scrollHeight = ctx.data.startTop - e.changedTouches[0].clientY;
  //   let scrollDir = ctx.data.scrollTop - e.changedTouches[0].clientY;
  //   let timelong = +new Date() - ctx.data.startTime;
  //   let length = ctx.data.textData.length;
  //   let fullH = 40 + 172 * length;
  //   if (fullH > 1000) {
  //     fullH = 1000;
  //   }
  //   ctx.fullH = fullH;
  //   if (scrollDir > 0 && ctx.data.footerMaxHeight > 500 && ctx.data.footerMaxHeight < fullH && fullH < 1000){
  //     ctx.setData({
  //       mapHeight: ctx.data.winHeight - fullH,
  //       footerMaxHeight: fullH,
  //       scrollTop: e.changedTouches[0].clientY,
  //       startTop: e.changedTouches[0].clientY
  //     })
  //   } else if (scrollDir > 0 && ctx.data.footerMaxHeight > 500 && ctx.data.footerMaxHeight < fullH && fullH == 1000) {
  //     ctx.setData({
  //       mapHeight: ctx.data.winHeight - fullH,
  //       footerMaxHeight: fullH,
  //       scrollTop: e.changedTouches[0].clientY,
  //       startTop: e.changedTouches[0].clientY,
  //       scrollY: true
  //     })
  //   } else if (scrollDir < 0 && ctx.data.footerMaxHeight > 500 && ctx.data.footerMaxHeight < fullH) {
  //     ctx.setData({
  //       mapHeight: ctx.data.winHeight - 500,
  //       footerMaxHeight: 500,
  //       scrollTop: e.changedTouches[0].clientY,
  //       startTop: e.changedTouches[0].clientY
  //     })
  //   } else if (scrollDir < 0 && ctx.data.footerMaxHeight < 500) {
  //     ctx.setData({
  //       open: false,
  //       mapHeight: ctx.data.winHeight - 90,
  //       footerMaxHeight: 90,
  //       scale: 15,
  //       scrollTop: e.changedTouches[0].clientY,
  //       startTop: e.changedTouches[0].clientY
  //     })
  //   } 
    // ctx.setData({
    //   // open: false,
    //   mapHeight: ctx.data.mapHeight - scrollHeight,
    //   footerMaxHeight: ctx.data.footerMaxHeight + scrollHeight,
    //   scale: 15,
    //   scrollTop: e.changedTouches[0].clientY
    // })
    // console.log(ctx.data.scrollTop);
  // },
 
  takeOpen(e){
    let length = ctx.data.textData.length;
    if(length===0) return;
    ctx.setData({
      open: true,
      mapHeight: ctx.data.winHeight - 500 - 20 * ctx.data.devicePer,
      footerMaxHeight: 500,
      scale: 15
    })
  },
  takeMarker(e) {
    let dataset = e.currentTarget.dataset;
    let markers = ctx.data.markers;
    let devicePer = ctx.data.devicePer;
    markers.forEach((item,index)=>{
      if(index > 0){
        if (index == dataset.id+1){
          markers[index].iconPath = '../../../img/fcmap/fengchao-dt-xuanzhong.png';
          markers[index].width = 35;
          markers[index].height = 35;
        }else{
          markers[index].iconPath = '../../../img/fcmap/fengchao-dt.png';
          markers[index].width = 28;
          markers[index].height = 28;
        }
      }
    })
    
    ctx.setData({
      markers,
      open: false,
      mapHeight: ctx.data.winHeight - 45 * devicePer,
      footerMaxHeight: 45 * devicePer,
      scale: 16
    })
    

    let controls = ctx.data.controls;
    controls[0].iconPath = '../../../img/fcmap/dingweitu.png'
    ctx.mapCtx.includePoints({
      padding: [50,50,50,50],
      points: ctx.data.includePoints
    })
    ctx.setData({
      toSelf: true,
      controls
    })
    
  },
  regionchange(e){
    // console.log(e)
  },
  switchPage(e) {
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataset.url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    ctx.mapCtx = wx.createMapContext('myMap')

    ctx.mapCtx.getScale({
      success(res) {
        console.log(res)
        ctx.setData({
          scale: res.scale
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let longitude = ctx.data.longitude, 
        latitude = ctx.data.latitude;

    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let controls = ctx.data.controls;
        controls[0].position.left = res.windowWidth - 53;
        let devicePer = 750 / res.screenWidth;
        let winHeight = res.windowHeight * devicePer - 55 * devicePer;
        ctx.setData({
          winHeight,
          mapHeight: winHeight - 45 * devicePer,
          controls,
          open: false,
          devicePer
        })
      }
    })

    let markers = [];
    let includePoints = [];
    let textData = [];
    markers.push({
      longitude,
      latitude,
      iconPath: '../../../img/fcmap/dingwei.png',
      width: 21,
      height: 30
    })
    includePoints.push({
      longitude,
      latitude
    })
    ctx.setData({
      longitude,
      latitude
    });
    let distanceRange = 500;
    cabinet.getBoxInfo(longitude, latitude, distanceRange).then(res => {
      console.log(res);
      if (res && res.length != 0) {
        res.forEach((item, key) => {
          markers.push({
            longitude: item.longitude,
            latitude: item.latitude,
            iconPath: '../../../img/fcmap/fengchao-dt.png',
            width: 28,
            height: 28
          })
          includePoints.push({
            longitude: item.longitude,
            latitude: item.latitude
          })
          textData.push({
            name: item.address,
            bigBoxCount: item.bigBoxCount,
            middleBoxCount: item.middleBoxCount,
            smallBoxCount: item.smallBoxCount
          })
        })
      }
      ctx.setData({
        markers,
        includePoints,
        textData
      })
      // 使用 wx.createMapContext 获取 map 上下文
      ctx.mapCtx = wx.createMapContext('myMap')

      ctx.mapCtx.getScale({
        success(res) {
          console.log(res)
          ctx.setData({
            scale: res.scale
          })
        }
      })
    })

    ctx.setData({
      markers,
      includePoints,
      textData
    })
    // 使用 wx.createMapContext 获取 map 上下文
    ctx.mapCtx = wx.createMapContext('myMap')

    ctx.mapCtx.getScale({
      success(res) {
        console.log(res)
        ctx.setData({
          scale: res.scale
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})