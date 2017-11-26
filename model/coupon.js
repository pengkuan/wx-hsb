import {url, WX_APP_ID, WX_AUTH_TYPE} from '../config/index';
import Utils from '../util/utils';
export default {
  coupons (params) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.coupons,
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
  }
}