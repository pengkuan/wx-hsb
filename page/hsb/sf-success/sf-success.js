


















Page({

    data : '',

    onLoad (options) {

        this.oid = options.oid;
    },

    orderListBtn () {

        wx.navigateTo({

            url: "../order-details/order-details?oid=" + this.oid
        });
    },

    indexPage () {

        wx.switchTab({

            url: '/page/hsb/index/index'
        });
    }
})


