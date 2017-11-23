import trade from '../../../model/trade';
let ctx;
Page({

  data: {
    sfAddr: ['广东省', '深圳市', '罗湖区'],
    sfAddrOpt: [[], [], []],
    sfAddrIndex: [0, 0, 0],
    sfAddrSelect: [[], [], []],
    sfAddrData: []
  },

  onLoad () {
    ctx = this;
    let sfAddrSelect = ctx.data.sfAddrSelect;
    trade.sfCity().then(data => {
      sfAddrSelect[0] = data;
      ctx.setData({
        sfAddrSelect,
        sfAddrData: data,
      });
      ctx.onProvinceChanged(data[0]);
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
    if (obj.sub) sfAddrSelect[1] = obj.sub;
    ctx.setData({sfAddrSelect});
    ctx.onCityChanged(obj.sub[0])
  },

  /**
   * 监听 city 变化
   */
  onCityChanged (obj) {
    let sfAddrSelect = this.data.sfAddrSelect;
    if (obj.sub) sfAddrSelect[2] = obj.sub;
  },

  sfAddrPickerChange (e) {
    this.setData({sfAddrIndex: e.detail.value})
  },

  sfAddrPickerColumnChange (event) {
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
        sfAddrIndex[column] = index;
        sfAddrIndex[column + 1] = 0;
        sfAddrIndex[column + 2] = 0;
        break;
      case 1:
        if (sfAddrSelect[column][index]['sub']) {
          sfAddrSelect[2] = sfAddrSelect[column][index]['sub']
        } else {
          sfAddrSelect[2] = [];
        }
        sfAddrIndex[column] = index;
        sfAddrIndex[column + 1] = 0;
        break;
      case 2:
        sfAddrIndex[column] = index;
        break;
    }
    sfAddrIndex[column] = index;
    this.setData({
      sfAddrSelect,
      sfAddrIndex
    })
  }
});