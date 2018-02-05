import {
  url,
  WX_APP_ID,
  WX_AUTH_TYPE,
  WX_SECRET
} from '../config/index';
import Utils from '../util/utils';

export default {

  // 微信开放信息
  wxOpenInfo: {},

  // 回收宝账户信息
  userInfo: {},

  // 获取微信用户的 微信开发信息
  getWxOpenInfo() {
    let ctx = this;
    return new Promise((resolve, reject) => {
      if (this.wxOpenInfo.nickName !== undefined) {
        resolve(this.wxOpenInfo);
      }
      wx.getUserInfo({
        lang: 'zh_CN',
        withCredentials: false,
        success(res) {
          let data = res.userInfo;
          if (data !== undefined) {
            ctx.wxOpenInfo = data;
            wx.setStorageSync('wxOpenInfo', data)
            resolve(data);
          } else {
            reject(res);
          }
        }
      });
    });
  },

  // 获取code
  getWxCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          console.log(res)
          if (res.code) {
            resolve(res.code);
          } else {
            reject(res);
          }
        },
        fail(err) {
          console.log(err)
          reject(err);
        }
      })
    })
  },

  /**
   * 获取微信openid
   * @param code
   * @return {Promise}
   */
  getWxOpenId() {
    let _this = this;
    return new Promise((resolve, reject) => {
      let code;
      _this.getWxCode()
        .then(codeRet => {
          code = codeRet;
          return _this.getWxUnionId(code)
        })
        .then(unionIdRet => {
          return _this.decryptWxInfo({
            code,
            iv: unionIdRet.iv,
            encryptedData: unionIdRet.encryptedData
          })
        })
        .then(res => {
          let ret = res.data;
          let data = ret.data;
          data['openid'] = data['openId'];
          data['unionid'] = data['unionId'];
          _this.setWxToken(data)
          resolve(data);
        }).catch(err => {
          console.log(err);
        })
    })
  },


  // 获取小程序unionId
  getWxUnionId() {
    let _this = this;
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        withCredentials: true,
        lang: 'zh_CN',
        success(res) {
          resolve(res)
        }
      })
    })
  },

  // resolveWx
  decryptWxInfo({ code, iv, encryptedData }) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.decryptWxUserInfo,
        data: {
          code,
          WX_SECRET,
          WX_APP_ID,
          iv,
          encryptedData
        },
        success(res) {
          resolve(res)
        }
      })
    })
  },

  /**
   * @param openid 开发授权id
   * @param auth_type 授权类型 1：微信公众号、2：微信小程序、3：支付宝 必填
   * @param appid 第三方应用号/公众号/生活号，可空 必填
   * @return {Promise}
   */
  login(openid, unionid, auth_type = WX_AUTH_TYPE, appid = WX_APP_ID) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.authUserLogin,
        data: {
          appid: appid ? appid : '',
          openid: openid ? openid: '',
          auth_type: auth_type ? auth_type : '',
          unionid: unionid ? unionid: '',
          valid_days: 1
        },
        success(res) {
          res = res.data;
          if (res.retcode == 0) {
            resolve(res.data)
          } else {
            reject(res.retinfo)
          }
        },
        fail(res) {
          console.log(res);
        }
      })
    })
  },

  // 获取手机验证码
  getCode({ tel }) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.getCode,
        data: {
          tel
        },
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
  bindTelLogin({ tel, code, openid, unionid, valid_days }) {
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
        success(res) {
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
  authUserUnbindTel({ uid, userkey, openid }) {
    return new Promise((resolve, reject) => {
      Utils.post({
        url: url.authUserUnbindTel,
        data: {
          uid,
          openid,
          userkey,
          auth_type: WX_AUTH_TYPE
        },
        success(res) {
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
  setUserInfo(data = {}) {
    this.userInfo = data;
    try {
      wx.setStorageSync('userInfo', data);
    } catch (e) {
      console.log('/model/user', '设置回收宝账户信息报错', e)
    }
  },

  /**
   * 获取用户的登录信息
   */
  getUserInfo() {
    return this.userInfo;
    let ret = {};
    try {
      var value = wx.getStorageSync('userInfo');
      if (value) {
        ret = value;
      }
    } catch (e) {
      console.log('/model/user', '从本地获取hsb账户信息报错', e)
    }
    return ret;
  },

  /**
   * 设置微信token
   */
  setWxToken(data = {}) {
    try {
      wx.setStorageSync('wxToken', data);
    } catch (e) {
      console.log('/model/user', '设置微信授权信息报错', e)
    }
  },

  /**
   * 获取微信token
   */
  getWxToken() {
    let ret = {};
    try {
      var value = wx.getStorageSync('wxToken');
      if (value) {
        ret = value;
      }
    } catch (e) {
      console.log('/model/user', '从本地获取微信开放信息报错', e)
    }
    return ret;
  },
}