import {url, WX_APP_ID, WX_AUTH_TYPE} from '../config/index';
import Utils from '../util/utils';
let app = getApp();

export default {

  // 微信开放信息
  wxOpenInfo: {},
  // 回收宝账户信息
  userInfo: {},
  // 微信票据
  wxToken: {}, // {openid, unionid}

  // 获取微信用户的 微信开发信息
  getWxOpenInfo () {
    let ctx = this;
    return new Promise((resolve, reject) => {
      if (Object.keys(this.wxOpenInfo).length !== 0) resolve(this.wxOpenInfo);
      wx.getUserInfo({
        lang: 'zh_CN',
        withCredentials: false,
        success(res) {
          ctx.wxOpenInfo = res.userInfo;
          resolve(ctx.wxOpenInfo)
        }
      });
    });
  },

  // 获取code
  getWxCode () {
    return new Promise((resolve, reject) => {
      wx.login({
        success (res) {
          resolve(res.code);
        },
        fail (res) {
          resolve(res.errMsg);
        }
      })
    })
  },

  /**
   * 获取微信openid
   * @param code
   * @return {Promise}
   */
  getWxOpenId (code) {
    return new Promise((resolve, reject) => {
      Utils.get({
        url: `${ url.wxOpenId }/${code}`,
        success (res) {
          resolve(res.data.data);
        },
        fail (res) {
          reject(res.errMsg);
        }
      });
    })
  },

  /**
   * @param openid 开发授权id
   * @param auth_type 授权类型 1：微信公众号、2：微信小程序、3：支付宝 必填
   * @param appid 第三方应用号/公众号/生活号，可空 必填
   * @return {Promise}
   */
  login (openid, auth_type = WX_AUTH_TYPE, appid = WX_APP_ID) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.authUserLogin,
        data: {
          appid,
          openid,
          auth_type,
          valid_days: 0.1
        },
        success (res) {
          res = res.data;
          if (res.retcode == 0) {
            resolve(res.data)
          } else {
            reject(res.retinfo)
          }
        }
      })
    })
  },

  // 获取手机验证码
  getCode ({tel}) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.getCode,
        data: {tel},
        success(res) {
          resolve(res.data);
        }
      })
    })
  },

  /**
   * 绑定手机号并登录
   * @param tel 手机号码
   * @param code
   * @param openid
   * @param unionid
   * @param valid_days
   * @return {Promise}
   */
  bindTelLogin ({tel, code, openid, unionid, valid_days}) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.bindTelLogin,
        data: {
          tel,
          code,
          openid,
          unionid,
          appid: WX_APP_ID,
          auth_type: WX_AUTH_TYPE,
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
   * 已经绑定手机号的用户解绑手机号
   * @param uid
   * @param userkey
   * @param openid
   * @return {Promise}
   */
  authUserUnbindTel ({uid, userkey, openid}) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.authUserUnbindTel,
        data: {
          uid,
          openid,
          userkey,
          auth_type: WX_AUTH_TYPE
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
   * 将登录后的用户信息存到本地
   * @param params
   */
  setUserInfo (params = {}) {
    wx.setStorage({
      key: 'userInfo',
      data: params
    });
    this.userInfo = params;
  },

  /**
   * 获取用户的登录信息
   * @return {*}
   */
  getUserInfo () {
    return this.userInfo;
  },

  /**
   * 设置微信token {openid, unionid}
   */
  setWxToken (wxToken) {
    this.wxToken = wxToken;
  },

  /**
   * 获取微信token
   */
  getWxToken () {
    return this.wxToken;
  },

  // 查询订单列表
  orders (pageIndex = 1, pageSize = 6) {
    let ctx = this;
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.orders,
        data: {
          uid: ctx.userInfo.uid,
          userkey: ctx.userInfo.userkey,
          pageIndex,
          pageSize
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
}