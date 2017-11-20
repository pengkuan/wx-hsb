import config from '../config/index.js';
const url = 'https://www.huishoubao.com/common/product/';
export default {
  // 类目
  category() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${url}categories?pid=1056`,
        success: function (res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res.errmsg);
          }
        }
      })
    })
  },
  // 品牌
  brands(params) {
    let cid = params.cid;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${ url }brands?classId=${ cid }&pid=1056`,
        success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res.errmsg);
          }
        }
      })
    })
  },
  // 机型
  products(params) {
    let cid = params.cid;
    let bid = params.bid;
    let num = params.num;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${url}products?classId=${cid}&brandId=${bid}&pageIndex=${num}&pid=1056`,
        success(res) {
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res.errmsg);
          }
        }
      })
    })
  },
  // 获取产品信息
  productInfo(param) {
    let productId = param.productId;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://www.huishoubao.com/api/get_product_param?itemid=${productId}&pid=1056`,
        success (res){
          if (res.data) {
            resolve(res.data.data);
          } else {
            reject(res.errmsg);
          }
        }
      })
    })
  },
  // 估价https://www.huishoubao.com/v2/1196/api/products_evaluate/41567/12-17-36-40-63-68-73-77-83-10-21-23-27-30-53-55-59
  evaluate (params){
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://www.huishoubao.com/v2/1196/api/products_evaluate/${params.productId}/${params.selects}`,
        success: function(res){
          if (res.data) {
            resolve(res.data.data)
          } else {
            reject(res)
          }
        }
      })
    })
  }
}