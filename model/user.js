const url = 'https://www.huishoubao.com/common/user/wxAppLogin';
import Utils from '../util/utils';
export default {
    // 获取code
    getWxCode () {
        return new Promise((resolve, reject) => {
            let self = this;
            wx.login({
                success (res) {
                    console.log(res);
                    resolve(res.code);
                },
                fail (res) {
                    console.log(res);
                    resolve(res.errMsg);
                }
            })
        })
    },

    /**
     * 获取openid
     * expires_in: 7200
     * openid: "oYf8X0bQGSTh6fweycoGItY29kK0"
     * session_key: "glxzkciJLttS8felWGyUGQ=="
     * unionid: "ox3Blw4Kekggsk1tl4IdS3VhcWxw"
     * @param {*} code 
     */
    getWxOpenId (code) {
        let self = this;
        return new Promise ((resolve, reject) => {
            wx.request({
                url: `${url}/${code}`,
                success (res) {
                    console.log(res);
                    resolve(res.data);
                },
                fail (res) {
                    console.log(res);
                    reject(res.errMsg);
                }
            })
        })
    },

    /**
     * 登录回收宝
     * @param {*} openid 
     */
    login (openid) {
        console.log('login');
        return new Promise((resolve, reject) => {
            Utils.post({
                url: 'https://www.huishoubao.com/common/user/authUserLogin?pid=1196',
                data: {
                    openid,
                    auth_type: 2,
                    valid_days: 1,
                    appid: 'wx3543d54ab3d1a24e'
                },
                success (res) {
                    console.log(res);
                    resolve(res.data)
                },
                fail (res) {
                    console.log(res);
                    reject(res.retinfo);
                },
                complete () {
                    console.log('complete');
                }
            })
        })
    },

    /**
     * 绑定手机号
     * auth_type 授权类型（1：微信公众号、2：微信小程序、3：支付宝|必填）
     * code 短信验证码
     * appid 应用id
     * tel 手机号码
     * openid 第三方授权ID
     * unionid 微信类应用用户唯一标识（非必填）
     * valid_days 登录有效天数
     * @param {*} params 
     */
    bindTel (params) {
        const APPID = 'appidwx3543d54ab3d1a24e';
        const auth_type = 2;
        return new Promise((resolve, reject) => {
            Utils.post({
                url: 'https://gaox.www.huishoubao.com/common/user/authUserBindTelLogin?pid=1196',
                data: {
                    tel: params.tel,
                    appid: APPID,
                    auth_type: 2,
                    code: params.code,
                    appid: params.appid,
                    openid: params.openid,
                    valid_days: params.valid_days,
                },
                success (res) {
                    resolve(res.data)
                },
                fail (res) {
                    reject(res.retinfo);
                }
            })
        })
    }
}