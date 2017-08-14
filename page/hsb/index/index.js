let products = require('../modules/model/products.js');
let that;



Page({

    data : {
        record : '',
    },

    onShow () {

        if (!wx.getStorageSync('orderid')) wx.setStorageSync('orderid', '');

        this.setData({ record : wx.getStorageSync('options2') });

        // console.log(wx.getStorageSync('options2'));
    },

    onShareAppMessage: function () {
        return {
            title: '回收宝手机回收',
            path: '/page/hsb/index/index',
            success (res) {}
        }
    },

    onLoad () {
        that = this;

        wx.getSystemInfo({

            success (res) {

                res.model = res.model.split('<')[0];
                that.setData({ systemInfo: res });
            }
        });

        products.getBrands( (b) => {

            if (b) {

                that.setData({
                    brandsList : that.arrayDivision(b, 8)
                });
            }

        });

        products.hotList( (b) => {

            that.setData({ hotList : b.items });
        });

    },

    arrayDivision (arr, mun) {

        let o = [];
        let l = arr.length;

        for (let i = 0; i < l; i += mun) {

           o.push(arr.slice(i, i + mun));
        }

        return o;
    }

});