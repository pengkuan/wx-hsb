'use strict';

var _trade = require('../../../model/trade');

var _trade2 = _interopRequireDefault(_trade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0;
Page({

  data: {
    sfAddr: ['广东省', '深圳市', '罗湖区'],
    sfAddrOpt: [[], [], []],
    sfAddrIndex: [0, 0, 0],
    sfAddrSelect: [[], [], []],
    sfAddrData: []
  },

  onLoad: function onLoad() {
    ctx = this;
    var sfAddrSelect = ctx.data.sfAddrSelect;
    _trade2.default.sfCity().then(function (data) {
      sfAddrSelect[0] = data;
      ctx.setData({
        sfAddrSelect: sfAddrSelect,
        sfAddrData: data
      });
      ctx.onProvinceChanged(data[0]);
    }, function (err) {
      console.log(err);
    });
  },


  /**
   * 监听province变化
   * @param obj
   */
  onProvinceChanged: function onProvinceChanged(obj) {
    var sfAddrSelect = this.data.sfAddrSelect;
    if (obj.sub) sfAddrSelect[1] = obj.sub;
    ctx.setData({ sfAddrSelect: sfAddrSelect });
    ctx.onCityChanged(obj.sub[0]);
  },


  /**
   * 监听 city 变化
   */
  onCityChanged: function onCityChanged(obj) {
    var sfAddrSelect = this.data.sfAddrSelect;
    if (obj.sub) sfAddrSelect[2] = obj.sub;
  },
  sfAddrPickerChange: function sfAddrPickerChange(e) {
    this.setData({ sfAddrIndex: e.detail.value });
  },
  sfAddrPickerColumnChange: function sfAddrPickerColumnChange(event) {
    var index = event.detail.value,
        column = event.detail.column,
        sfAddrData = this.data.sfAddrData,
        sfAddrSelect = this.data.sfAddrSelect,
        sfAddrIndex = this.data.sfAddrIndex;
    switch (column) {
      case 0:
        sfAddrSelect[1] = sfAddrData[index]['sub'];
        if (sfAddrSelect[1][0]['sub']) {
          sfAddrSelect[2] = sfAddrSelect[1][0]['sub'];
        } else {
          sfAddrSelect[2] = [];
        }
        sfAddrIndex[column] = index;
        sfAddrIndex[column + 1] = 0;
        sfAddrIndex[column + 2] = 0;
        break;
      case 1:
        if (sfAddrSelect[column][index]['sub']) {
          sfAddrSelect[2] = sfAddrSelect[column][index]['sub'];
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
      sfAddrSelect: sfAddrSelect,
      sfAddrIndex: sfAddrIndex
    });
  }
});
//# sourceMappingURL=index.js.map