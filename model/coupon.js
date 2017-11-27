import {url, WX_APP_ID, WX_AUTH_TYPE} from '../config/index';
import Utils from '../util/utils';
export default {
  page (params) {
    return new Promise((resolve, reject) => {
      Utils.get({
        url: `${url.coupon}coupons`,
        data: {
          uid: params.uid,
          userkey: params.userkey,
          pageIndex: params.pageIndex || 1
        },
        success (res) {
          res = res.data;
          if (res.retcode == 0) {
            resolve(res.data)
          } else {
            reject(res.retinfo);
          }
        }
      })
    })
  },
  add (params) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: `${url.coupon}add/${params.token}`,
        data: {
          uid: params.uid
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