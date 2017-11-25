import Utils from '../util/utils';
import {url, WX_APP_ID, WX_AUTH_TYPE} from '../config/index';

export default {
  // 查询订单列表
  orders (params) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.orders,
        data: {
          uid: params.uid,
          userkey: params.userkey,
          pageSize: params.pageSize || 6,
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
  // 取消订单
  cancelOrder ({ orderid, uid, userkey }) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.cancelOrder,
        data: {
          orderid,
          uid,
          userkey
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