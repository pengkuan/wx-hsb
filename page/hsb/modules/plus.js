
var url     = require('./url');
var GMT = new Date().getTimezoneOffset() * -60000;
var exports = module.exports = {

    speedTooFast(time, max, callback){
        time = +new Date() - time;
        setTimeout(callback, time > max ? 0 : max - time);
    },
    buildQuery(options){

        return Object.keys(options).map(function(key){
            return key + '=' + options[key];
        }).join('&');
    },
    ISOTime(time){
        return new Date(GMT + time * 1000).toISOString().slice(0, 19).replace(/[A-z]+/, ' ');
    },
    checkInput(val, method, str, str2, callback){

        if (val == null || val === ''){
            callback && callback(str);
            return false;
        }
        if (this[method](val)){
            return true;
        }
        callback && callback(str2);
        return false;
    },

    checkName (name) {
        return true;
        //三个英文字母 两个中文字符
    },

    checkTel (tel) {

        var exp = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return exp.test(tel);
    },

    makePhoneCall (e) {
        console.log(e)
        wx.makePhoneCall({
            // phoneNumber: '95338',
            phoneNumber: e.currentTarget.dataset.tel,
            success:function(){
                console.log("拨打电话成功！")
            },
            fail:function(){
                console.log("拨打电话失败！")
            }
        })
    },
    switchTab(e){
        wx.switchTab({
            url: e.currentTarget.dataset.url
        });
    }
}