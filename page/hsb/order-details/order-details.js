
var that;
var plus  = require('../modules/plus.js');
var order = require('../modules/model/order.js');

Page({

    data : {
        hide : '',
    },

    makePhoneCall : plus.makePhoneCall,

    onLoad (options) {

        that = this;

        order.orderDetails(options.oid, (data) => {

            console.log(data);

            that.setData(data);
            wx.setStorageSync('orderId', data.oid);

            if (data.visitinfo) {

                that.setData({

                    tel  : data.visitinfo.tel,
                    time : data.visitinfo.visittime,
                    addr : data.visitinfo.addr,
                    statusname : data.statusname

                });

            } else { that.setData({ hide : 1 }) }

        });
    },

    sfBtn () {

        wx.navigateTo({ url: "../sf-order/sf-order" });
    }
});
