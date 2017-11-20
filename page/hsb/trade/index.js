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
                console.log(data);
                user.login(data.openid).then(res => {
                    console.log(res);
                    if(!res.tel) {
                        
                    }
                })
            })
        })
    }
});