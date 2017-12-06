'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../config/index');

var _utils = require('../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  // 类目
  category: function category() {
    return new Promise(function (resolve, reject) {
      _utils2.default.get({
        url: _index.url.categories,
        success: function success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res.errmsg);
          }
        }
      });
    });
  },

  // 品牌
  brands: function brands(_ref) {
    var cid = _ref.cid;

    return new Promise(function (resolve, reject) {
      _utils2.default.get({
        url: _index.url.brands,
        data: { classId: cid },
        success: function success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res.errmsg);
          }
        }
      });
    });
  },

  // 机型
  products: function products(_ref2) {
    var cid = _ref2.cid,
        bid = _ref2.bid,
        num = _ref2.num;

    return new Promise(function (resolve, reject) {
      _utils2.default.get({
        url: _index.url.products,
        data: {
          classId: cid,
          brandId: bid,
          pageIndex: num
        },
        success: function success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res.errmsg);
          }
        }
      });
    });
  },

  // 获取产品信息
  productInfo: function productInfo(param) {
    var productId = param.productId;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://www.huishoubao.com/api/get_product_param?itemid=' + productId + '&pid=1056',
        success: function success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res.errmsg);
          }
        }
      });
    });
  },

  // 估价https://www.huishoubao.com/v2/1196/api/products_evaluate/41567/12-17-36-40-63-68-73-77-83-10-21-23-27-30-53-55-59
  evaluate: function evaluate(params) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://www.huishoubao.com/v2/1196/api/products_evaluate/' + params.productId + '/' + params.selects,
        success: function success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res);
          }
        }
      });
    });
  },

  // 机型搜索
  search: function search(params) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: _index.url.search + params.key,
        data: {
          pageIndex: params.pageIndex || 1
        },
        success: function success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res);
          }
        }
      });
    });
  },
  priceHistory: function priceHistory(params) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: '' + _index.url.priceHistory + params.price + '/' + params.productId + '/',
        success: function success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res);
          }
        }
      });
    });
  }
};
//# sourceMappingURL=product.js.map