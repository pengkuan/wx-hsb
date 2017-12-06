'use strict';

var _trade = require('../../../model/trade');

var _trade2 = _interopRequireDefault(_trade);

var _order = require('../../../model/order');

var _order2 = _interopRequireDefault(_order);

var _user = require('../../../model/user');

var _user2 = _interopRequireDefault(_user);

var _coupon = require('../../../model/coupon');

var _coupon2 = _interopRequireDefault(_coupon);

var _utils = require('../../../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0;

Page({

  data: {
    ways: [{
      name: '顺丰上门取件',
      way: 'sf',
      iconBlack: '../../../img/trade/sf_black.svg',
      iconWhite: '../../../img/trade/sf_white.svg'
    }, {
      name: '上门回收（免费）',
      way: 'visit',
      iconBlack: '../../../img/trade/visit_black.svg',
      iconWhite: '../../../img/trade/visit_white.svg'
    }],
    way: 'sf',
    sf: {
      addr: {
        data: [],
        indexs: [0, 0, 0],
        selects: [[], [], []],
        value: ''
      },
      date: {
        data: [],
        indexs: [0, 0],
        selects: [[], []],
        value: ''
      }
    },
    hsb: {
      addr: {
        data: [],
        indexs: [0, 0],
        selects: [[], []],
        value: ''
      },
      date: {
        data: [],
        indexs: [0, 0],
        selects: [[], []],
        value: ''
      }
    },
    street: '',
    nickname: '',
    tel: '',
    coupon: {}, // 选中的优惠券
    userInfo: {}
  },

  /**
   * 初始化顺丰上门城市
   * 初始化回收宝上门城市
   * 初始化上门时间
   */
  onLoad: function onLoad() {
    ctx = this;
    var sf = ctx.data.sf;
    var hsb = ctx.data.hsb;
    wx.setNavigationBarTitle({
      title: '提交订单'
    });

    // 获取顺丰城市
    _trade2.default.sfCity().then(function (data) {
      var temp = {};
      sf.addr.data = data;
      sf.addr.selects[0] = data;
      temp = data[0];
      if (temp.sub) sf.addr.selects[1] = temp.sub;
      temp = temp.sub[0];
      if (temp.sub) sf.addr.selects[2] = temp.sub;
      sf.addr.value = ctx.sfAddrFormat(sf);
      ctx.setData({
        sf: sf
      });
    });

    // 获取上门时间
    _trade2.default.visitTime().then(function (res) {
      sf.date.data = res.sf;
      sf.date.selects[0] = res.sf.date;
      sf.date.selects[1] = res.sf.time[0];
      sf.date.value = ctx.formatSfDate(sf);
      hsb.date.data = res.hsb;
      hsb.date.selects[0] = res.hsb.date;
      hsb.date.selects[1] = res.hsb.time[0];
      hsb.date.value = ctx.formatHsbDate(hsb);
      ctx.setData({
        sf: sf,
        hsb: hsb
      });
    });

    // 回收宝城市
    _trade2.default.hsbCity().then(function (data) {
      hsb.addr.data = data;
      hsb.addr.selects[0] = data;
      hsb.addr.selects[1] = data[0]['sub'];
      hsb.addr.value = ctx.hsbAddrFormat(hsb);
      ctx.setData({
        hsb: hsb
      });
    });
  },
  onShow: function onShow() {
    var userInfo = _user2.default.getUserInfo();
    var tel = ctx.data.tel;
    ctx.setData({
      userInfo: userInfo,
      tel: userInfo.tel ? userInfo.tel : tel
    });
    if (userInfo.tel) {
      _coupon2.default.page({
        uid: userInfo.us_uid,
        userkey: userInfo.userkey
      }).then(function (cps) {
        var option = _utils2.default.getCurPageOpt();
        var coupon = _utils2.default.getAvailableCoupon(cps, parseInt(option.price));
        if (coupon) ctx.setData({
          coupon: coupon
        });
      });
    }
  },


  // 格式化顺丰地址
  sfAddrFormat: function sfAddrFormat(sf) {
    var temp = [];
    for (var i = 0; i < 3; i++) {
      if (sf.addr.selects[i].length) temp.push(sf.addr.selects[i][sf.addr.indexs[i]]['name']);
    }
    return temp.join(" ");
  },


  // 格式化回收宝地址
  hsbAddrFormat: function hsbAddrFormat(hsb) {
    var temp = [];
    for (var i = 0; i < 2; i++) {
      if (hsb.addr.selects[i].length) temp.push(hsb.addr.selects[i][hsb.addr.indexs[i]]['name']);
    }
    return temp.join(" ");
  },


  // 确认顺丰地址
  handleSfAddr: function handleSfAddr(e) {
    var sf = this.data.sf;
    sf.addr.indexs = e.detail.value;
    this.setData({
      sf: sf
    });
  },


  // 监听pickerCol变化
  handleSfAddrCol: function handleSfAddrCol(event) {
    var sf = ctx.data.sf;
    var index = event.detail.value;
    var column = event.detail.column;
    switch (column) {
      case 0:
        sf.addr.selects[1] = sf.addr.data[index]['sub'];
        if (sf.addr.selects[1][0]['sub']) {
          sf.addr.selects[2] = sf.addr.selects[1][0]['sub'];
        } else {
          sf.addr.selects[2] = [];
        }
        sf.addr.indexs[column + 1] = 0;
        sf.addr.indexs[column + 2] = 0;
        break;
      case 1:
        if (sf.addr.selects[column][index]['sub']) {
          sf.addr.selects[2] = sf.addr.selects[column][index]['sub'];
        } else {
          sf.addr.selects[2] = [];
        }
        sf.addr.indexs[column + 1] = 0;
        break;
    }
    sf.addr.indexs[column] = index;
    sf.addr.value = ctx.sfAddrFormat(sf);
    this.setData({
      sf: sf
    });
  },


  // 监听pickerCol变化
  handleHsbAddrCol: function handleHsbAddrCol(e) {
    var hsb = ctx.data.hsb;
    var index = e.detail.value;
    var column = e.detail.column;
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
      hsb: hsb
    });
  },


  // 监听pickerCol变化
  handleSfDateCol: function handleSfDateCol(e) {
    var sf = ctx.data.sf;
    var index = e.detail.value;
    var column = e.detail.column;
    if (column == 0) sf.date.selects[1] = sf.date.data.time[index];
    sf.date.indexs[column] = index;
    sf.date.value = ctx.formatSfDate(sf);
    this.setData({
      sf: sf
    });
  },


  // 监听pickerCol变化
  handleHsbDateCol: function handleHsbDateCol(e) {
    var hsb = ctx.data.hsb;
    var index = e.detail.value;
    var column = e.detail.column;
    if (column == 0) hsb.date.selects[1] = hsb.date.data.time[index];
    hsb.date.indexs[column] = index;
    hsb.date.value = this.formatHsbDate(hsb);
    this.setData({
      hsb: hsb
    });
  },


  // 格式化顺丰日期
  formatSfDate: function formatSfDate(sf) {
    var temp = [];
    for (var i = 0; i < 2; i++) {
      if (sf.date.selects[i].length) temp.push(sf.date.selects[i][sf.date.indexs[i]]);
    }
    return temp.join(" ");
  },
  formatHsbDate: function formatHsbDate(hsb) {
    var temp = [];
    for (var i = 0; i < 2; i++) {
      if (hsb.date.selects[i].length) temp.push(hsb.date.selects[i][hsb.date.indexs[i]]);
    }
    return temp.join(" ");
  },


  // 更换回收方式
  switchWay: function switchWay(e) {
    var dataset = e.currentTarget.dataset;
    var options = _utils2.default.getCurPageOpt();

    if (parseInt(options.price) < 100) {
      ctx.showModel('未满100元不支持上门回收');
      return;
    }

    if (options.classId == 2) {
      ctx.showModel('笔记本暂不支持上门回收');
      return;
    }

    ctx.setData({
      way: dataset.way
    });
  },
  handleName: function handleName(e) {
    this.setData({
      nickname: e.detail.value
    });
  },
  handleTel: function handleTel(e) {
    this.setData({
      tel: e.detail.value
    });
  },
  handleStreet: function handleStreet(e) {
    this.setData({
      street: e.detail.value
    });
  },
  validParam: function validParam(val) {
    return val && val.length > 0;
  },
  showModel: function showModel(ctn) {
    wx.showModal({
      title: '提示',
      content: ctn,
      showCancel: false
    });
  },


  // 下回收宝上门单
  takeHsbVisitOrder: function takeHsbVisitOrder(params) {

    var hsb = ctx.data.hsb;

    var street = ctx.data.street;
    var address = hsb.addr.value + street;
    var date = hsb.date.value;

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

    var regionId = hsb.addr.selects[0][hsb.addr.indexs[0]]['id'];
    var visitTime = new Date((date.substr(0, 16) + ':00').replace(/-/g, '/')).getTime() / 1000;

    params['ordertype'] = 'visit';
    params['address'] = address;
    params['regionid'] = regionId;
    params['visitTime'] = visitTime;
    params['address'] = address;
    params['displayVisitTime'] = date; // 前端展示上门时间

    _order2.default.take(params).then(function (data) {
      Object.assign(params, data);
      wx.reLaunch({
        url: '../success/index?orderInfo=' + JSON.stringify(params)
      });
    }, function (err) {
      console.log(err);
    });
  },


  // 下顺丰单
  takeSfOrder: function takeSfOrder(params) {

    var sf = ctx.data.sf;

    var street = ctx.data.street;
    var address = sf.addr.value;
    var date = sf.date.value;

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

    var sendtime = new Date(date).getTime() / 1000;
    var addrArr = address.split(' ');

    params['ordertype'] = 'post';

    _order2.default.take(params).then(function (data) {
      params['ordernum'] = data.ordernum;
      params['orderid'] = data.orderid; //订单号
      params['sendtime'] = sendtime; // 上门时间
      params['province'] = addrArr[0] || ''; // 省
      params['city'] = addrArr[1] || ''; // 市
      params['county'] = addrArr[2] || ''; // 区
      params['addr'] = address + ' ' + street; // 上门地址
      params['displayVisitTime'] = date; // 前端展示上门时间
      wx.reLaunch({
        url: '../success/index?orderInfo=' + JSON.stringify(params)
      });
    });
  },


  // 基本参数
  submitOrder: function submitOrder() {

    // 需要填写
    var tel = ctx.data.tel;
    var nickname = ctx.data.nickname;

    if (nickname.length < 2) {
      wx.showModal({
        title: '提示',
        content: '联系人字符长度不能小于2',
        showCancel: false
      });
      return;
    }

    if (!_utils2.default.isMobile(tel)) {
      wx.showModal({
        title: '提示',
        content: '手机号码格式不正确',
        showCancel: false
      });
      return;
    }

    // 不需要填写
    var options = _utils2.default.getCurPageOpt();
    var userInfo = _user2.default.getUserInfo();
    var wxToken = _user2.default.getWxToken();
    var coupon = ctx.data.coupon;

    if (!options.productId) {
      options = {
        selects: "137-123-12-73-68-61-65-59-55-53-30-23-21-9-10",
        price: "96400",
        productId: "30800",
        desc: '大陆国行-保修一个月以上-128G-金色-无拆机无维修-显示正常-屏幕完好-外观完好-iCloud已注销-A1586-机身完好-二手-正常开机-非官换机-液晶正常-指纹功能正常-WIFI正常-无进水-通话正常'
      };
    }

    var params = {
      // 估价选项
      selects: options.selects,
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

    Object.keys(coupon).length && (params.couponId = coupon.couponID);

    var way = ctx.data.way;
    if (way === 'sf') ctx.takeSfOrder(params);
    if (way === 'visit') ctx.takeHsbVisitOrder(params);
  }
});
//# sourceMappingURL=index.js.map