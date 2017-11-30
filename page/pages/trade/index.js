import trade from '../../../model/trade';
import order from '../../../model/order';
import user from '../../../model/user';
let ctx;
Page({
  data: {
    ways: [{
      name: '顺丰上门取件',
      way: 'sf',
    }, {
      name: '上门回收（免费）',
      way: 'visit',
    }],
    way: 'sf',
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
    },
    street: '测试地址',
    nickname: '测试高雄',
    tel: '13249064450'
  },

  /**
   * 初始化顺丰上门城市
   * 初始化回收宝上门城市
   * 初始化上门时间
   */
  onLoad () {
    ctx = this;
    let sf = ctx.data.sf;
    let hsb = ctx.data.hsb;
    wx.setNavigationBarTitle({
      title: '提交订单'
    });

    // 获取顺丰城市
    trade.sfCity().then(data => {
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

    // 回收宝城市
    trade.hsbCity().then(data => {
      hsb.addr.data = data;
      hsb.addr.selects[0] = data;
      hsb.addr.selects[1] = data[0]['sub'];
      hsb.addr.value = ctx.hsbAddrFormat(hsb);
      ctx.setData({
        hsb
      });
    })
  },

  // 格式化顺丰地址
  sfAddrFormat (sf) {
    let temp = [];
    for (let i = 0; i < 3; i++) {
      if (sf.addr.selects[i].length) temp.push(sf.addr.selects[i][sf.addr.indexs[i]]['name']);
    }
    return temp.join(" ");
  },

  // 格式化回收宝地址
  hsbAddrFormat (hsb) {
    let temp = [];
    for (let i = 0; i < 2; i++) {
      if (hsb.addr.selects[i].length) temp.push(hsb.addr.selects[i][hsb.addr.indexs[i]]['name']);
    }
    return temp.join(" ");
  },

  // 确认顺丰地址
  handleSfAddr (e) {
    let sf = this.data.sf;
    sf.addr.indexs = e.detail.value;
    this.setData({
      sf
    });
  },

  // 监听pickerCol变化
  handleSfAddrCol (event) {
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

  // 监听pickerCol变化
  handleHsbAddrCol (e) {
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
  handleSfDateCol (e) {
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
  handleHsbDateCol (e) {
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
  formatSfDate (sf) {
    let temp = [];
    for (let i = 0; i < 2; i++) {
      if (sf.date.selects[i].length) temp.push(sf.date.selects[i][sf.date.indexs[i]]);
    }
    return temp.join(" ");
  },

  formatHsbDate (hsb) {
    let temp = [];
    for (let i = 0; i < 2; i++) {
      if (hsb.date.selects[i].length) temp.push(hsb.date.selects[i][hsb.date.indexs[i]]);
    }
    return temp.join(" ");
  },

  // 更换回收方式
  switchWay(e) {
    let dataset = e.currentTarget.dataset;
    ctx.setData({
      way: dataset.way
    })
  },

  handleName (e) {
    this.setData({nickname: e.detail.value})
  },

  handleTel (e) {
    this.setData({tel: e.detail.value})
  },

  handleStreet (e) {
    this.setData({street: e.detail.value})
  },

  // 下回收宝上门单
  takeHsbVisitOrder (params) {
    let hsb = ctx.data.hsb;
    let street = ctx.data.street;
    let address = hsb.addr.value + street;
    let date = hsb.date.value;
    let regionId = hsb.addr.selects[0][hsb.addr.indexs[0]]['id'];
    let visitTime = new Date(date.substr(0, 16) + ':00').getTime() / 1000;
    params['address'] = address;
    params['regionid'] = regionId;
    params['ordertype'] = 'visit';
    params['visitTime'] = visitTime;
    params['address'] = address;
    params['displayVisitTime'] = date; // 前端展示上门时间
    order.take(params).then(data => {
      Object.assign(params, data);
      wx.navigateTo({
        url: `../success/index?orderInfo=${JSON.stringify(params)}`
      })
    }, err => {
      console.log(err);
    });
  },

  // 下顺丰单
  takeSfOrder (params) {
    params['ordertype'] = 'post';
    order.take(params).then(data => {
      let sf = ctx.data.sf;
      let street = ctx.data.street;
      let address = sf.addr.value;
      let date = sf.date.value;
      let sendtime = new Date(date).getTime() / 1000;
      let addrArr = address.split(' ');
      params['ordernum'] = data.ordernum;
      params['orderid'] = data.orderid; //订单号
      params['sendtime'] = sendtime; // 上门时间
      params['province'] = addrArr[0] || ''; // 省
      params['city'] = addrArr[1] || ''; // 市
      params['county'] = addrArr[2] || ''; // 区
      params['addr'] = `${address} ${street}`; // 上门地址
      params['SF'] = 1;
      params['displayVisitTime'] = date; // 前端展示上门时间
      console.log(JSON.stringify(params));
      wx.navigateTo({
        url: `../success/index?orderInfo=${JSON.stringify(params)}`
      })
    });
  },

  // 基本参数
  getParams () {
    let pages = getCurrentPages();
    let options = pages[pages.length - 1].options;
    if (!options.productId) {
      option = {
        selects: "137-123-12-73-68-61-65-59-55-53-30-23-21-9-10",
        price: "96400",
        productId: "30800",
        desc: '大陆国行-保修一个月以上-128G-金色-无拆机无维修-显示正常-屏幕完好-外观完好-iCloud已注销-A1586-机身完好-二手-正常开机-非官换机-液晶正常-指纹功能正常-WIFI正常-无进水-通话正常'
      };
    }
    let tel = ctx.data.tel;
    let nickname = ctx.data.nickname;
    let userInfo = wx.getStorageSync('userInfo');
    let wxToken = user.getWxOpenId();
    return {
      // 估价选项
      selects: options.selects,
      // 产品id
      itemid: options.productId,
      //新uid
      uid: userInfo.us_uid,
      // 授权id
      openid: wxToken.openid,
      // 收款方式
      type: 2,
      //旧uid
      olduid: userInfo.old_uid,
      userkey: userInfo.userkey,
      // 用户昵称
      nickname: nickname,
      // 联系电话
      tel: tel
    };
  },

  submitOrder () {
    let way = ctx.data.way;
    let params = ctx.getParams();
    if (way === 'sf') ctx.takeSfOrder(params);
    if (way === 'visit') ctx.takeHsbVisitOrder(params);
  }
});