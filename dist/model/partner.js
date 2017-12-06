'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var icare = {
  /**
   * sid 促销员 id 非必填
   * uid 必填 用户id
   * pid 渠道id 必须
   * order 订单id 必须
   * tel 手机号码 必须
   * product 机型名称 必须
   * productid 机型id 必须
   * pmoney 估价金额 必须（单位分）
   */
  trade: function trade(params) {
    return new Promise(function (resolve, reject) {
      _utils2.default.post({
        url: 'https://www.icarephone.com/business/hsb/recover_order',
        data: {
          sid: parseInt(params.sid) || 0,
          uid: parseInt(params.uid) || 0,
          pid: params.pid,
          order: params.orderNum,
          tel: params.tel,
          product: params.productName,
          productid: parseInt(params.productId),
          pmoney: params.price
        },
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  }
};

/**
 * 合作伙伴appid映射
 */
var partMap = {
  'wxeb46e3105e6634c5': icare, // icare 用户端
  'wx3b23b2ebeec25313': icare // icare 促销员端
};

var store = {
  appid: '',
  extraData: {},
  pid: ''
};

exports.default = {
  store: store,
  setPartnerInfo: function setPartnerInfo(_ref) {
    var appid = _ref.appid,
        extraData = _ref.extraData;

    this.store.appid = appid;
    this.store.extraData = extraData;
    this.store.pid = extraData.pid ? extraData.pid : 1196;
  },
  getPartnerApi: function getPartnerApi() {
    return partMap[this.store.appid];
  }
};
//# sourceMappingURL=partner.js.map