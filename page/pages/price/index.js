import product from '../../../model/product';
// const Chart = require('../../../util/chart');

import trade from '../../../model/trade';
import order from '../../../model/order';
import user from '../../../model/user';
import coupon from '../../../model/coupon';
import Utils from '../../../util/utils';
let ctx, app = getApp();
Page({

  data: {
    firstTap: 0,
    desc: [],
    price: 0,
    months: [],
    values: [],
    selects: [],
    productName: '',
    productId: '',
    isOpen: false,
    modelStatus: false,
    animationData: {},
    animationShowHeight: 0,
    submitNow: false,
    ways: [{
      name: '快递回收(包邮)',
      way: 'post',
      iconBlack: '../../../img/price/kuaidi.svg',
      iconWhite: '../../../img/price/kuaidi-f.svg'
      }, {
      name: '上门回收',
      way: 'visit',
      iconBlack: '../../../img/price/shangmen.svg',
      iconWhite: '../../../img/price/shangmen-f.svg'
      }, {
        name: '丰巢回收',
        way: 'fengchao',
        iconBlack: '../../../img/price/fengchao.svg',
        iconWhite: '../../../img/price/fengchao-f.svg'
      },],
    way: 'post',
    postway: 'sf',
    sf: {
      addr: {
        data: [],
        indexs: [0, 0, 0],
        selects: [[], [], []],
        value: '',
      },
      date: {
        data: [],
        indexs: [0, 0],
        selects: [[], []],
        value: ''
      },
      street: '',
    },
    hsb: {
      addr: {
        data: [],
        indexs: [0, 0],
        selects: [[], []],
        value: '',
      },
      date: {
        data: [],
        indexs: [0, 0],
        selects: [[], []],
        value: ''
      },
      street: '',
    },
    fc: {
      cardid: '',
      addr: {
        data: [],
        indexs: [0, 0, 0],
        selects: [[], [], []],
        value: '',
      },
      street: ''
    },
    nickname: '',
    tel: '',
    coupon: {}, // 选中的优惠券
    userInfo: {},
    telFocus: false,
    nicknameFocus: false,
    options: {},
    initCityData:{
      province: '',
      city: '',
      district: ''
    },
    location: '' ,
    isIphoneX: app.globalData.isIphoneX
  },
  
  onLoad(params) {
    ctx = this;
    wx.getSetting({
      success(res) {
        console.log(res);
        if (res.authSetting['scope.userLocation']===false) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function (res) { 
              console.log(res);
            },
            fail: function (res) { 
              wx.showModal({
                title: '温馨提醒',
                content: '需要获取您的地理位置才能使用小程序',
                cancelText: '不使用',
                confirmText: '获取位置',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function(res){
                        res.authSetting = {
                          "scope.userLocation": true
                        }
                      },
                      complete: function(res){
                        
                      }
                    })
                  }
                }
              })
            },
            complete: function (res) { 
              console.log(res);
            }
          })
        }
      }
    })
    // console.log(ctx);
    // console.log(params);
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
      // this.refreshChart();
    });
    Utils.getLocation().then(res=>{
      console.log(res)
      // let addressComponent = res.result.address_component;
      let addressComponent = res[0].regeocodeData.addressComponent;
      let initCityData = ctx.data.initCityData;
      initCityData.province = addressComponent.province;
      initCityData.city = addressComponent.city;
      initCityData.district = addressComponent.district;
      ctx.setData({
        initCityData,
        location: res[0].longitude + ',' + res[0].latitude
      })
      let sf = ctx.data.sf;
      let hsb = ctx.data.hsb;
      let fc = ctx.data.fc;
      // 获取顺丰城市
      trade.sfCity().then(data => {
        // console.log(data)
        let temp = {};
        sf.addr.data = data;
        sf.addr.selects[0] = data;
        temp = data[0];
        if (temp.sub) sf.addr.selects[1] = temp.sub;
        temp = temp.sub[0];
        if (temp.sub) sf.addr.selects[2] = temp.sub;
        sf.addr.value = ctx.sfAddrFormat(sf);
        ctx.setData({
          sf
        });
        let initCityData = ctx.data.initCityData;
        if (initCityData.city) {
          if (initCityData.province == initCityData.city) {
            initCityData.city = initCityData.district;
          }
          console.log(initCityData);
          sf.addr.indexs[0] = ctx.provinceToIndex(initCityData.province, data);
          console.log(sf.addr.indexs[0]);
          temp = data[sf.addr.indexs[0]];
          if (temp.sub) sf.addr.selects[1] = temp.sub;
          sf.addr.indexs[1] = ctx.cityToIndex(initCityData.city, data);
          console.log(sf.addr.indexs[1]);
          temp = temp.sub[sf.addr.indexs[1]];
          if (temp.sub) sf.addr.selects[2] = temp.sub;
          sf.addr.indexs[2] = ctx.districtToIndex(initCityData.district, data);
          console.log(sf.addr.indexs[2]);
          sf.addr.value = ctx.sfAddrFormat(sf);
          console.log(sf);
          ctx.setData({
            sf
          });
        }

      });

      // 获取丰巢的顺丰城市
      trade.sfCity().then(data => {
        // console.log(data)
        let temp = {};
        fc.addr.data = data;
        fc.addr.selects[0] = data;
        temp = data[0];
        if (temp.sub) fc.addr.selects[1] = temp.sub;
        temp = temp.sub[0];
        if (temp.sub) fc.addr.selects[2] = temp.sub;
        fc.addr.value = ctx.sfAddrFormat(fc);
        ctx.setData({
          fc
        });
        let initCityData = ctx.data.initCityData;
        if (initCityData) {
          if (initCityData.province == initCityData.city) {
            initCityData.city = initCityData.district;
          }
          fc.addr.indexs[0] = ctx.provinceToIndex(initCityData.province, data);
          temp = data[fc.addr.indexs[0]];
          if (temp.sub) fc.addr.selects[1] = temp.sub;
          fc.addr.indexs[1] = ctx.cityToIndex(initCityData.city, data);
          temp = temp.sub[fc.addr.indexs[1]];
          if (temp.sub) fc.addr.selects[2] = temp.sub;
          fc.addr.indexs[2] = ctx.districtToIndex(initCityData.district, data);
          fc.addr.value = ctx.sfAddrFormat(fc);
          ctx.setData({
            fc
          });
        }
      });
      // 回收宝城市
      trade.hsbCity().then(data => {
        hsb.addr.data = data;
        hsb.addr.selects[0] = data;
        hsb.addr.selects[1] = data[0]['sub'];
        hsb.addr.value = ctx.hsbAddrFormat(hsb);
        ctx.setData({
          hsb
        });
        let initCityData = ctx.data.initCityData;
        if (initCityData) {
          hsb.addr.indexs[0] = ctx.provinceToIndex(initCityData.city, data);
          hsb.addr.indexs[1] = ctx.cityToIndex(initCityData.district, data);
          hsb.addr.selects[1] = data[hsb.addr.indexs[0]]['sub'];
          hsb.addr.value = ctx.hsbAddrFormat(hsb);
          ctx.setData({
            hsb
          });
        }
      });

      // 获取上门时间
      trade.visitTime().then(res => {
        sf.date.data = res.sf;
        sf.date.selects[0] = res.sf.date;
        sf.date.selects[1] = res.sf.time[0];
        sf.date.value = ctx.formatSfDate(sf);
        hsb.date.data = res.hsb;
        hsb.date.selects[0] = res.hsb.date;
        hsb.date.selects[1] = res.hsb.time[0];
        hsb.date.value = ctx.formatHsbDate(hsb);
        ctx.setData({
          sf,
          hsb
        });
      });
    })
    

    ctx.setData({
      options: params
    })
  },
  // 价格走势图
  // refreshChart: () => {
  //   let windowWidth = 320;
  //   let months = ctx.data.months;
  //   months = months.map(item => item + '月')
  //   try {
  //     let res = wx.getSystemInfoSync();
  //     windowWidth = res.windowWidth;
  //   } catch (e) {
  //     console.error('getSystemInfoSync failed!');
  //   }
  //   let chart = new Chart({
  //     canvasId: 'lineCanvas',
  //     type: 'line',
  //     categories: months,
  //     animation: true,
  //     legend: false,
  //     dataLabel: false,
  //     series: [{
  //       name: '回收宝价',
  //       color: '#fabe00',
  //       data: ctx.data.values,
  //       format: (val) => parseInt(val) + '元'
  //     }, {
  //       name: '市场均价',
  //       color: '#b967ea',
  //       data: ctx.data.values.map((item) => item * 0.8),
  //       format: (val) => parseInt(val) + '元'
  //     }],
  //     xAxis: {
  //       disableGrid: true,
  //       fontColor: '#cacee0',
  //       format: (val) => parseInt(val),
  //     },
  //     yAxis: {
  //       fontColor: '#cacee0',
  //       gridColor: '#f0f1f7',
  //       format: (val) => parseInt(val),
  //       min: ctx.data.values[ctx.data.values.length - 1],
  //     },
  //     width: windowWidth,
  //     height: 200,
  //     dataPointShape: true,
  //     extra: {
  //       lineStyle: 'curve'
  //     }
  //   });
  // },

  // 跳转到下单页面
  // switchTrade () {
  //   let data = ctx.data;
  //   let selects = data.selects;
  //   let price = data.price;
  //   let productId = data.productId;
  //   let classId = data.classId;
  //   let productName = data.productName;
  //   wx.navigateTo({
  //     url: `../trade/index?selects=${selects}&price=${price}&productId=${productId}&classId=${classId}&productName=${productName}`
  //   })
  // },
  switchPage(e){
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: dataset.url+'?location='+ctx.data.location
    })
  },
  toggleOptions () {
    ctx.setData({
      isOpen: !ctx.data.isOpen
    })
  },

  goBack () {
    wx.navigateBack()
  },

  onShow() {
    let userInfo = user.getUserInfo();
    let tel = ctx.data.tel;
    if (userInfo && userInfo.tel) {
      ctx.setData({
        userInfo,
        tel: userInfo.tel
      });
    } else {
      ctx.setData({
        userInfo
      });
    }
    if (userInfo.tel) {
      coupon.page({
        uid: userInfo.us_uid,
        userkey: userInfo.userkey,
      }).then(cps => {
        let option = Utils.getCurPageOpt();
        let coupon = cps && Utils.getAvailableCoupon(cps, parseInt(option.price));
        if (coupon)
          ctx.setData({
            coupon
          })
      })
    }
    // 需要登陆
    // if (app.globalData.pid === '1173' && !userInfo.tel) {
    //   wx.navigateTo({
    //     url: '../bind/index?type=bind',
    //   })
    // }
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    ctx.animation = animation;
    wx.getSystemInfo({
      success: function (res) {
        ctx.animationShowHeight = res.windowHeight;
      }
    })  
  },
  //判断表单填写完毕
  submitFull(e){
    switch (ctx.data.way){
      case 'visit': 
        let hsbFullFlag = ctx.data.nickname && ctx.data.tel && ctx.data.hsb.street
        ctx.setData({
          submitNow: hsbFullFlag
        })
        break;
      case 'post': 
        if (ctx.data.postway == 'sf') {
          let sfFullFlag = ctx.data.nickname && ctx.data.tel && ctx.data.sf.street
          ctx.setData({
            submitNow: sfFullFlag
          })
        } else {
          let selfFullFlag = ctx.data.nickname && ctx.data.tel
          ctx.setData({
            submitNow: selfFullFlag
          })
        }
        break;
      case 'fengchao': 
        let fcFullFlag = ctx.data.nickname && ctx.data.tel && ctx.data.fc.cardid && ctx.data.fc.street
        ctx.setData({
          submitNow: fcFullFlag
        })
        break;
    }
  },
  animationShow: function () {
    // 上滑
    ctx.animation.translateY(-ctx.animationShowHeight).step();
    ctx.setData({
      animationData: ctx.animation.export(),
      modalStatus: true
    });
  },
  animationHide: function () {
    // 下滑
    ctx.animation.translateY(ctx.animationShowHeight).step();
    ctx.setData({
      animationData: ctx.animation.export(),
      modalStatus: false
    });
  },


  // 格式化顺丰地址
  sfAddrFormat(sf) {
    console.log(sf);
    let temp = [];
    for (let i = 0; i < 3; i++) {
      if (sf.addr.selects[i].length) temp.push(sf.addr.selects[i][sf.addr.indexs[i]]['name']);
    }
    return temp.join(" ");
  },
  // 省转index
  provinceToIndex(province, data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i]['name'] == province) return i;
    }
    return 0;
  },
  // 市转index
  cityToIndex(city, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i]['sub'].length; j++) {
        if (data[i]['sub'][j]['name'] == city) return j;
      }
    }
    return 0;
  },
  // 区转index
  districtToIndex(district,data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i]['sub'].length; j++){
        if(!!data[i]['sub'][j]['sub']){
          for (let k = 0; k < data[i]['sub'][j]['sub'].length; k++) {
            if (data[i]['sub'][j]['sub'][k]['name'] == district) return k;
          }
        }
      }
    }
    return 0;
  },

  // 格式化回收宝地址
  hsbAddrFormat(hsb) {
    let temp = [];
    for (let i = 0; i < 2; i++) {
      if (hsb.addr.selects[i].length) temp.push(hsb.addr.selects[i][hsb.addr.indexs[i]]['name']);
    }
    return temp.join(" ");
  },

  // 确认顺丰地址
  handleSfAddr(e) {
    let sf = this.data.sf;
    sf.addr.indexs = e.detail.value;
    this.setData({
      sf
    });
  },

  // 确认丰巢的顺丰地址
  handleFcAddr(e) {
    let fc = this.data.fc;
    fc.addr.indexs = e.detail.value;
    this.setData({
      fc
    });
  },

  // 监听pickerCol变化
  handleSfAddrCol(event) {
    let sf = ctx.data.sf;
    let index = event.detail.value;
    let column = event.detail.column;
    switch (column) {
      case 0:
        sf.addr.selects[1] = sf.addr.data[index]['sub'];
        if (sf.addr.selects[1][0]['sub']) {
          sf.addr.selects[2] = sf.addr.selects[1][0]['sub']
        } else {
          sf.addr.selects[2] = [];
        }
        sf.addr.indexs[column + 1] = 0;
        sf.addr.indexs[column + 2] = 0;
        break;
      case 1:
        if (sf.addr.selects[column][index]['sub']) {
          sf.addr.selects[2] = sf.addr.selects[column][index]['sub']
        } else {
          sf.addr.selects[2] = [];
        }
        sf.addr.indexs[column + 1] = 0;
        break;
    }
    sf.addr.indexs[column] = index;
    sf.addr.value = ctx.sfAddrFormat(sf);
    this.setData({
      sf,
    });
  },
  // 监听丰巢的pickerCol变化
  handleFcAddrCol(event) {
    let fc = ctx.data.fc;
    let index = event.detail.value;
    let column = event.detail.column;
    switch (column) {
      case 0:
        fc.addr.selects[1] = fc.addr.data[index]['sub'];
        if (fc.addr.selects[1][0]['sub']) {
          fc.addr.selects[2] = fc.addr.selects[1][0]['sub']
        } else {
          fc.addr.selects[2] = [];
        }
        fc.addr.indexs[column + 1] = 0;
        fc.addr.indexs[column + 2] = 0;
        break;
      case 1:
        if (fc.addr.selects[column][index]['sub']) {
          fc.addr.selects[2] = fc.addr.selects[column][index]['sub']
        } else {
          fc.addr.selects[2] = [];
        }
        fc.addr.indexs[column + 1] = 0;
        break;
    }
    fc.addr.indexs[column] = index;
    fc.addr.value = ctx.sfAddrFormat(fc);
    this.setData({
      fc,
    });
  },

  // 监听pickerCol变化
  handleHsbAddrCol(e) {
    let hsb = ctx.data.hsb;
    let index = e.detail.value;
    let column = e.detail.column;
    switch (column) {
      case 0:
        hsb.addr.selects[1] = hsb.addr.data[index]['sub'];
        hsb.addr.indexs[column] = index;
        hsb.addr.indexs[column + 1] = 0;
        break;
      case 1:
        hsb.addr.indexs[1] = index;
        break;
    }
    hsb.addr.value = ctx.hsbAddrFormat(hsb);
    this.setData({
      hsb
    });
  },

  // 监听pickerCol变化
  handleSfDateCol(e) {
    let sf = ctx.data.sf;
    let index = e.detail.value;
    let column = e.detail.column;
    if (column == 0) sf.date.selects[1] = sf.date.data.time[index];
    sf.date.indexs[column] = index;
    sf.date.value = ctx.formatSfDate(sf);
    this.setData({
      sf
    });
  },

  // 监听pickerCol变化
  handleHsbDateCol(e) {
    let hsb = ctx.data.hsb;
    let index = e.detail.value;
    let column = e.detail.column;
    if (column == 0) hsb.date.selects[1] = hsb.date.data.time[index];
    hsb.date.indexs[column] = index;
    hsb.date.value = this.formatHsbDate(hsb);
    this.setData({
      hsb
    });
  },

  // 格式化顺丰日期
  formatSfDate(sf) {
    let temp = [];
    for (let i = 0; i < 2; i++) {
      if (sf.date.selects[i].length) temp.push(sf.date.selects[i][sf.date.indexs[i]]);
    }
    return temp.join(" ");
  },

  formatHsbDate(hsb) {
    let temp = [];
    for (let i = 0; i < 2; i++) {
      if (hsb.date.selects[i].length) temp.push(hsb.date.selects[i][hsb.date.indexs[i]]);
    }
    return temp.join(" ");
  },

  // 更换回收方式
  switchWay(e) {
    let dataset = e.currentTarget.dataset;
    let options = ctx.data.options;

    if (dataset.way === 'visit') {
      console.log(options);
      // 放假了不支持上门回收
      var deadline = (new Date("Feb 22, 2018 00:00:00")).getTime();
      var curTime = (new Date()).getTime();
      if (curTime < deadline) {
        ctx.showModel('由于春节放假，2018年2月22号以前无工作人员上门，回收宝祝您春节快乐，阖家幸福！');
        return;
      }
      if (parseInt(options.price) < 10000) {
        ctx.showModel('未满100元不支持上门回收');
        return;
      }
      if (options.classId == 2) {
        ctx.showModel('笔记本暂不支持上门回收');
        return;
      }
    }
    ctx.setData({
      way: dataset.way
    })
    ctx.submitFull();
  },
  // 更换邮寄方式
  switchPostWay(e) {
    let dataset = e.currentTarget.dataset;
    let options = ctx.data.options;
    ctx.setData({
      postway: dataset.postway
    })
    ctx.submitFull();
  },
  validParam(val) {
    return val && val.length > 0;
  },

  showModel(ctn) {
    wx.showModal({
      title: '提示',
      content: ctn,
      showCancel: false
    });
  },

  // 下回收宝上门单
  takeHsbVisitOrder(params) {

    let hsb = ctx.data.hsb;

    let street = hsb.street;
    let address = hsb.addr.value + street;
    let date = hsb.date.value;

    if (!ctx.validParam(street)) {
      ctx.showModel('请填写详细地址');
      return false;
    }

    if (!ctx.validParam(address)) {
      ctx.showModel('请选择城市');
      return false;
    }

    if (!ctx.validParam(date)) {
      ctx.showModel('请选择预约时间');
      return false;
    }

    let regionId = hsb.addr.selects[0][hsb.addr.indexs[0]]['id'];
    let visitTime = new Date((date.substr(0, 16) + ':00').replace(/-/g, '/')).getTime() / 1000;

    params['ordertype'] = 'visit';
    params['address'] = address;
    params['regionId'] = regionId;
    params['visitTime'] = visitTime;
    params['address'] = address;
    params['displayVisitTime'] = date; // 前端展示上门时间
    params['way'] = 'shangmen'; // 回收方式

    order.take(params).then(data => {
      Object.assign(params, data);
      wx.reLaunch({
        url: `../success/index?orderInfo=${JSON.stringify(params)}`
      })
    }, err => {
      console.log(err);
    });
  },

  // 下顺丰单
  takeSfOrder(params) {
    let sf = ctx.data.sf;
    let street = sf.street;
    let address = sf.addr.value;
    let date = sf.date.value;
    if (!ctx.validParam(street)) {
      return ctx.showModel('请填写详细地址');
    }
    if (!ctx.validParam(address)) {
      return ctx.showModel('请选择城市');
    }
    if (!ctx.validParam(date)) {
      return ctx.showModel('请选择预约时间');
    }
    console.log(date);
    let sendtime = new Date((date.substring(0, 16) + ':00').replace(/-/g, '/')).getTime() / 1000;
    let addrArr = address.split(' ');
    params['ordertype'] = 'post';
    order.take(params).then(data => {
      params['ordernum'] = data.ordernum;
      params['orderid'] = data.orderid; //订单号
      params['sendtime'] = sendtime; // 上门时间
      params['province'] = addrArr[0] || ''; // 省
      params['city'] = addrArr[1] || ''; // 市
      params['county'] = addrArr[2] || ''; // 区
      params['addr'] = `${address} ${street}`; // 上门地址
      params['displayVisitTime'] = date; // 前端展示上门时间
      params['way'] = 'shunfeng'; // 回收方式
      
      wx.reLaunch({
        url: `../success/index?orderInfo=${JSON.stringify(params)}`
      })
    });
  },
  // 下自己邮寄单
  takeSelfOrder(params) {
    params['ordertype'] = 'post';
    order.take(params).then(data => {
      params['postway'] = 'self';
      params['ordernum'] = data.ordernum;
      params['orderid'] = data.orderid; //订单号
      params['way'] = 'self'; // 回收方式
      wx.reLaunch({
        url: `../success/index?orderInfo=${JSON.stringify(params)}`
      })
    });
  },
  // 下丰巢单
  takeFcOrder(params) {
    let fc = ctx.data.fc;
    let street = fc.street;
    let cardid = fc.cardid;
    let address = fc.addr.value;
    if (!Utils.isCardid(cardid)) {
      return ctx.showModel('请输入正确的身份证号码');
    }
    if (!ctx.validParam(street)) {
      return ctx.showModel('请填写详细地址');
    }
    if (!ctx.validParam(address)) {
      return ctx.showModel('请选择城市');
    }
    // if (!ctx.validParam(cardid)) {
    //   return ctx.showModel('请填写身份证号码');
    // }
    let addrArr = address.split(' ');
    params['ordertype'] = 'post';
    console.log(params);
    order.take(params).then(data => {
      params['ordernum'] = data.ordernum;
      params['orderid'] = data.orderid; //订单号
      params['cardid'] = cardid; //身份证号
      params['province'] = addrArr[0] || ''; // 省
      params['city'] = addrArr[1] || ''; // 市
      params['county'] = addrArr[2] || ''; // 区
      params['addr'] = `${address} ${street}`; // 丰巢地址
      params['way'] = 'fengchao'; // 回收方式
      wx.reLaunch({
        url: `../success/index?orderInfo=${JSON.stringify(params)}`
      })
    });
  },

  // 基本参数
  submitOrder() {
    let firstTap = ctx.data.firstTap;
    firstTap++;
    if(firstTap > 1)return;
    // 需要填写
    let tel = ctx.data.tel;
    let nickname = ctx.data.nickname;
    if (nickname.length < 2) {
      return wx.showModal({
        title: '提示',
        content: '联系人字符长度不能小于2',
        showCancel: false
      });
    }
    if (!Utils.isMobile(tel)) {
      return wx.showModal({
        title: '提示',
        content: '手机号码格式不正确',
        showCancel: false
      });
    }
    // 不需要填写
    let options = ctx.data.options;
    let userInfo = user.getUserInfo();
    let wxToken = user.getWxToken();
    let coupon = ctx.data.coupon;
    let params = {
      // 估价选项
      selects: options.ids,
      // 产品id
      itemid: options.productId,
      //新uid
      uid: userInfo.us_uid,
      // 授权id
      openid: wxToken.openid,
      // 收款方式
      type: 9,
      //旧uid
      olduid: userInfo.old_uid,
      userkey: userInfo.userkey,
      // 用户昵称
      nickname: nickname,
      // 联系电话
      tel: tel
    };
    // 前端展示
    params['productName'] = options.productName;
    params['price'] = options.price;
    Object.keys(coupon).length && (params.couponId = coupon.couponID);
    let way = ctx.data.way;
    let post = ctx.data.postway;
    // console.log(options);
    // console.log(params);
    if (way === 'post') {
      if(post === 'sf'){
        ctx.takeSfOrder(params);
      }
      if(post === 'self'){
        ctx.takeSelfOrder(params);
      }
    }
    if (way === 'visit') ctx.takeHsbVisitOrder(params);
    if (way === 'fengchao') ctx.takeFcOrder(params);

    ctx.setData({
      firstTap
    })
  },

  showCoupDesc() {
    wx.showModal({
      title: '现金券说明',
      content: '系统自动使用您的可以使用的最大面值现金券\r\n关注"回收宝"公众号,送千万大礼',
      showCancel: false
    })
  },
  showFcDesc(){
    wx.showModal({
      title: '丰巢回收说明',
      content: '您可以根据我们的推荐选择任意快递柜，将手机放入格口，无需等待，快递小哥自动取件邮寄到目的地',
      showCancel: false
    })
  },
  // showChargeDesc() {
  //   // wx.showModal({
  //   //   title: '运费说明',
  //   //   content: '运费说明',
  //   //   showCancel: false
  //   // })
  //   this.setData({
  //     modalflag: true
  //   })
  // },
  // hideChargeDesc() {
  //   this.setData({
  //     modalflag: false
  //   })
  // },

  handleName(e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  handleTel(e) {
    this.setData({
      tel: e.detail.value
    })
  },

  // handleSfStreet(e) {
  //   let sf = ctx.data.sf;
  //   sf.street = e.detail.value;
  //   this.setData({
  //     sf
  //   })
  // },
  // handleHsbStreet(e) {
  //   let hsb = ctx.data.hsb;
  //   hsb.street = e.detail.value;
  //   this.setData({
  //     hsb
  //   })
  // },

  onTelFocus(e) {
    ctx.setData({
      telFocus: true
    })
  },

  onTelBlur(e) {
    ctx.setData({
      telFocus: false
    })
    ctx.submitFull();
  },
  onSfStreetBlur(e){
    let sf = ctx.data.sf;
    sf.street = e.detail.value;
    this.setData({
      sf
    })
    ctx.submitFull();
  },
  onHsbStreetBlur(e){
    let hsb = ctx.data.hsb;
    hsb.street = e.detail.value;
    this.setData({
      hsb
    })
    ctx.submitFull();
  },
  onFcCardidBlur(e){
    let fc = ctx.data.fc;
    fc.cardid = e.detail.value;
    this.setData({
      fc
    })
    ctx.submitFull();
  },
  onFcStreetBlur(e) {
    let fc = ctx.data.fc;
    fc.street = e.detail.value;
    this.setData({
      fc
    })
    ctx.submitFull();
  },
  onNicknameBlur(e) {
    ctx.setData({
      nicknameFocus: false
    })
    ctx.submitFull();
  },

  onNicknameFocus(e) {
    console.log(e);
    ctx.setData({
      nicknameFocus: true
    })
  }
});