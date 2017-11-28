import trade from '../../../model/trade';
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
    sfAddr: {
      origin: [],
      indexs: [0, 0, 0],
      selects: [[], [], []],
    },
    sfTime: {
      origin: [],
      indexs: [0, 0],
      selects: [[], []]
    },
    sfPram: {
      date: '',
      addr: '',
      street: ''
    },
    hsbAddr: {
      origin: [],
      indexs: [0, 0],
      selects: [[], []],
    },
    hsbTime: {
      origin: [],
      indexs: [0, 0],
      selects: [[], []],
    },
    hsbPram: {
      addr: '',
      date: '',
      street: '',
    }
  },

  onLoad () {

    ctx = this;
    let sfAddr = ctx.data.sfAddr;
    let sfTime = ctx.data.sfTime;
    let sfPram = ctx.data.sfPram;
    let hsbAddr = ctx.data.hsbAddr;
    let hsbTime = ctx.data.hsbTime;
    let hsbPram = ctx.data.hsbPram;

    wx.setNavigationBarTitle({
      title: '提交订单'
    });

    // 获取顺丰地址
    trade.sfCity().then(data => {
      sfAddr.origin = data;
      sfAddr.selects[0] = data;
      ctx.setData({
        sfAddr
      });
      // ctx.onProvinceChanged(data[0]);
    }, err => {
      console.log(err);
    });

    // 获取上门时间
    trade.visitTime().then(res => {
      sfTime.origin = res.sf.date;
      sfTime.selects[0] = res.sf.date;
      ctx.setData({
        sfTime
      })
    }, err => {
      console.log(err);
    })
  },

  /**
   * 监听province变化
   * @param obj
   */
  onProvinceChanged (obj) {
    let sfAddrSelect = this.data.sfAddrSelect;
    let sf = ctx.data.sf;
    if (obj.sub) {
      sfAddrSelect[1] = obj.sub;
      sf.addr.selects[1] = obj.sub;
    }
    ctx.setData({
      sf,
      sfAddrSelect
    });
    ctx.onCityChanged(obj.sub[0]);
  },

  sfAddrFormat () {
    let sf = ctx.data.sf;
    let selects = sf.addr.selects;
    let indexs = sf.addr.indexs;
    for (let i = 0; i < 3; i++) {
      if (selects[i].length) {
        sf.value.addr += selects[i][indexs[i]]['name'];
      }
    }
    ctx.setData({
      sf
    })
  },

  /**
   * 监听 city 变化
   */
  onCityChanged (obj) {
    let sfAddrSelect = this.data.sfAddrSelect;
    if (obj.sub) sfAddrSelect[2] = obj.sub;
  },

  handleSfAddr (e) {
    this.setData({
      sfAddrIndex: e.detail.value
    })
  },

  handleSfAddrCol (event) {
    let index = event.detail.value,
      column = event.detail.column,
      sfAddrData = this.data.sfAddrData,
      sfAddrSelect = this.data.sfAddrSelect,
      sfAddrIndex = this.data.sfAddrIndex;
    switch (column) {
      case 0:
        sfAddrSelect[1] = sfAddrData[index]['sub'];
        if (sfAddrSelect[1][0]['sub']) {
          sfAddrSelect[2] = sfAddrSelect[1][0]['sub']
        } else {
          sfAddrSelect[2] = [];
        }
        sfAddrIndex[column + 1] = 0;
        sfAddrIndex[column + 2] = 0;
        break;
      case 1:
        if (sfAddrSelect[column][index]['sub']) {
          sfAddrSelect[2] = sfAddrSelect[column][index]['sub']
        } else {
          sfAddrSelect[2] = [];
        }
        sfAddrIndex[column + 1] = 0;
        break;
    }
    sfAddrIndex[column] = index;
    this.setData({
      sfAddrSelect,
      sfAddrIndex
    });
    ctx.sfAddrFormat();
  },

  handleSfDateCol (event) {
    let index = event.detail.value,
      column = event.detail.column,
      sfDateOpt = this.data.sfDateOpt,
      sfDateSelect = this.data.sfDateSelect,
      sfDateIndex = this.data.sfDateIndex;
    console.log(sfDateOpt);
    switch (column) {
      case 0:
        sfDateSelect[1] = sfDateOpt.time[index];
        break;
    }
    sfDateIndex[column] = index;
    this.setData({
      sfDateSelect,
      sfDateIndex
    });
  },

  formatSfDate () {

  }
});