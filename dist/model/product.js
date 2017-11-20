'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../config/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = 'https://www.huishoubao.com/common/product/';
exports.default = {
  // 类目
  category: function category() {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url + 'categories?pid=1056',
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
  brands: function brands(params) {
    var cid = params.cid;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url + 'brands?classId=' + cid + '&pid=1056',
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
  products: function products(params) {
    var cid = params.cid;
    var bid = params.bid;
    var num = params.num;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url + 'products?classId=' + cid + '&brandId=' + bid + '&pageIndex=' + num + '&pid=1056',
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
  }
};
//# sourceMappingURL=product.js.map