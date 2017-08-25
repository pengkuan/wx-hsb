let products = require('../modules/model/products.js');
let url = require('../modules/url.js')
let that;

Page({

    data : {
        record : '',
        url : url,
        hsbGuarantee : [
            {
                img : '/image/icon/8.png',
                text : '全国包邮'
            },
            {
                img : '/image/icon/9.png',
                text : '三天保价'
            },
            {
                img : '/image/icon/10.png',
                text : '闪电打款'
            },
            {
                img : '/image/icon/11.png',
                text : '隐私保护'
            }
        ]
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
    },

});