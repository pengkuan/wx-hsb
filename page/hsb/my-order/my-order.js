var order = require('../modules/model/order.js');
var plus  = require('../modules/plus.js');

Page({

    data: {

        orderList    : [],
        index        : 0,
        sync         : false,
        moreListText : '正在加载中。。。',
        isExit:false
    },

    onShow () {

        var orderSuccess = wx.getStorageSync('orderSuccess');

        if (orderSuccess) {
            this.data.isExit=true;
            wx.removeStorageSync('orderSuccess');

            this.setData({
                toggle   : 'ordersuccess',
                orderNum : orderSuccess.orderNum,
                type     : orderSuccess.type,
            });

        } else {
            this.data.isExit=false;
            this.setData({
                orderList : [],
                index     : 0,
                sync      : false,
            });
            this.onReachBottom();
        }

    },

    onHide() {

        this.setData({
            toggle : ''
        });
    },

    onLoad (data) {},

    orderListBtn () {
        this.data.isExit=false;
        this.setData({
            orderList : [],
            index     : 0,
            sync      : false,
        });
        this.onReachBottom();
    },

    onReachBottom () {
        if(!this.data.isExit){
            var data = this.data;

            if(data.sync || data.index === -1){
                return false;
            }

            var list = data.orderList;
            var size = 6;
            var that = this;
            data.sync = true;
            order.orderList(data.index, function(items){

                console.log(items)

                if (!data.index){
                    if (items){

                        that.setData({
                            toggle : 'orderliston',
                        });
                    } else {

                        that.setData({
                            toggle : 'orderlistoff',
                            sync   : false
                        });
                        return false;
                    }
                }
                if (items){

                    list.push.apply(list, items);
                    that.setData({
                        orderList   : list,
                        sync        : false,
                        index       : data.index + 1
                    });
                }
                if (!items || items.length < size) {
                    that.setData({
                        moreListText     : '没有更多商品了',
                        index            : -1,
                    });
                }
            });
        }
    },

    switchTab : plus.switchTab,
    // toIndexTap(){
        //     wx.switchTab({
    //         url: '/page/hsb/index/index'
    //     });
    // },
    makePhoneCall : plus.makePhoneCall,

    sfBtn () {

        wx.navigateTo({
            url: "../sf-order/sf-order"
        });
    }
});
