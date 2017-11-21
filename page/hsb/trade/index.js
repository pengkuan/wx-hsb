import user from '../../../model/user'
let ctx;
Page({
    onLoad (params) {
        ctx = this;
        // 获取code
        user.getWxCode().then(code => {
            // 获取 openid
            user.getWxOpenId(code).then(data => {
                // 登录
                user.login(data.openid).then(res => {
                    // 没有绑定手机号码
                    if(!res.tel) {
                        wx.navigateTo({ url: `../bind/index?openid=${ data.openid }&unionid=${ data.unionid }`})
                    }
                })
            })
        })
    }
});