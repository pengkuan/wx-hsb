import user from '../../../model/user'
let ctx;
Page({
    onLoad (params) {
        ctx = this;
        // 获取code
        user.getWxCode().then(code => {
            // 获取 openid
            console.log('code', code)
            user.getWxOpenId(code).then(data => {
                // 登录
                console.log(data);
                console.log('getWxOpenId');
                user.login(data.openid).then(res => {
                    console.log(res);
                    if(!res.tel) {
                        wx.navigateTo({
                            url: '../bind/index'
                        })
                    }
                })
            })
        })
    },
    onShow () {

    }
});