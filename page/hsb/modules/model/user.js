var url     = require('../url.js');
var exports = module.exports = {
    userInfo : wx.getStorageSync('userInfo'),
    login (callback) {
        wx.login({
            success: function (res) {
                console.log(res.code);
                wx.request({
                    url     : url.wxLogin + res.code,
                    success : function (res) {
                      console.log(res);
                        wx.setStorageSync('userInfo', res.data.data);
                        exports.userInfo = res.data.data;
                        callback && callback(res.data.data);
                    }
                });
            }
        });
    }
};
exports.userInfo || exports.login();