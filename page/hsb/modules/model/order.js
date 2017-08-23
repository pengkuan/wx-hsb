// user.js
// var GMT  = new Date().getTimezoneOffset() * -60000;
var plus = require('../plus.js');
var user = require('./user.js');
var url  = require('../url.js');

var exports = module.exports = {

    userInfo : user.userInfo,

    orderList(index, callback){

        wx.request({

            url     : url.orderList + index,
            data    : user.userInfo,
            success : function (res) {

                var data = res.data;
                if (data.errcode == 3002){
                    return user.login(function(){
                        exports.orderList(index, callback);
                    });
                }
                data  = data.data;
                var items = data && data.items;
                items && items.forEach(function(v){

                    v.ts = plus.ISOTime(v.ts);
                });
                callback && callback(items);
            }
        });
    },

    getOrder (orderInfo, callback) {

        var userInfo = user.userInfo;

        orderInfo.wechat_openid = userInfo.wxopenid;
        orderInfo.wxuid         = userInfo.wxuid;
        orderInfo.wxukey        = userInfo.wxukey;

        wx.request({

            url     : url.getOrder,
            data    : orderInfo,

            success : function(res) {
                var data = res.data.data;
                if (res.data.errcode == 3002){

                    return user.login(function(){
                        exports.getOrder(orderInfo, callback);
                    })
                }
                callback && callback(data);
            }
        });
    },

    orderDetails(oid, callback){

        wx.request({

            url     : url.orderDetails + oid,
            data    : user.userInfo,
            success (res) {
                var data    = res.data.data;
                data.ts = plus.ISOTime(data.ts);
                callback && callback(data);
            }
        });
    }
};
