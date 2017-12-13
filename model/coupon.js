import {url, WX_APP_ID, WX_AUTH_TYPE} from '../config/index';
import Utils from '../util/utils';
export default {
  couponList: [],
  page ({ uid, userkey, pageIndex}) {
    const ctx = this;
    return new Promise((resolve, reject) => {
      Utils.post({
        url: `${url.coupon}coupons`,
        data: {
          uid,
          userkey,
          pageIndex: pageIndex || 1
        },
        success (res) {
          res = res.data;
          if (res.errcode == 0) {
            ctx.couponList = res.data;
            resolve(res.data);
          } else {
            reject(res.errmsg);
          }
        }
      })
    })
  },
  add ({uid, token}) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: `${url.addCoupon}${token}`,
        data: {
          uid
        },
        success (res) {
          res = res.data;
          if (res.errcode == 0) {
            resolve(res.data)
          } else {
            reject(res.errmsg);
          }
        },
        fail (err) {
          // reject();
          console.log(err);
        }
      })
    })
  },
}