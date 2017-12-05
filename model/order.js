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
  cancelOrder ({orderid, uid, userkey, olduid}) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.cancelOrder,
        data: {
          orderid,
          uid,
          userkey,
          olduid
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
  // 订单详情
  order ({orderid, uid, userkey}) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.order,
        data: {
          uid,
          userkey,
          order_id: orderid
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

  /**
   * 关于用户信息 没有登录时可以为空字符串
   * 但是 openid绝对不能为空
   * @param params
   * @return {Promise}
   */
  take (params) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.takeOrder,
        data: {
          uid: params.uid || "",
          userkey: params.userkey || "",
          tel: params.tel,
          openid: params.openid,
          type: 9,
          regionid: params.regionId || "",
          sendMsgFlag: 0,
          csrfToken: new Date(),
          selects: params.selects,
          itemid: params.itemid,
          olduid: params.olduid || "",
          ordertype: params.ordertype || 'post',
          visitTime: params.visitTime,
          address: params.address,
          couponId: params.couponId || "",
          wechatpayouttype: "9", // 区分小程序
        },
        success (res) {
          res = res.data;
          if (res.errcode == 0) {
            resolve(res.data)
          } else {
            reject(res.errmsg);
          }
        }
      })
    })
  },
  takeSfOrder ({orderid, nickname, tel, province, city, county, addr, sendtime}) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.takeSfOrder,
        data: {
          tel,
          orderid,
          nickname,
          province,
          city,
          county,
          addr,
          sendtime
        },
        success (res) {
          res = res.data;
          if (res.errcode == 0) {
            resolve(res.data)
          } else {
            // reject(res.errmsg);
          }
        }
      })
    })
  }
}