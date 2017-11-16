let products = require('../modules/model/products.js');
let that;
Page({
    data: {
        record: '',
        hsbGuarantee: [
            {
                img: '/image/icon/8.png',
                text: '全国包邮'
            },
            {
                img: '/image/icon/9.png',
                text: '七天保价'
            },
            {
                img: '/image/icon/10.png',
                text: '闪电打款'
            },
            {
                img: '/image/icon/11.png',
                text: '隐私保护'
            }
        ],
        hsbFriends: [
            {
                img: '/image/icon/12.png',
                text: '华为商城'
            },
            {
                img: '/image/icon/13.png',
                text: '58转转'
            },
            {
                img: '/image/icon/14.png',
                text: '微信京东'
            }
        ],
        flowData: [
            {
                img: '/image/icon/flow1.png',
                text: '查找机型\n在线估价'
            },
            {
                img: '/image/icon/flow2.png',
                text: '下单回收\n顺丰邮寄'
            },
            {
                img: '/image/icon/flow3.png',
                text: '专业质检\n确认价格'
            },
            {
                img: '/image/icon/flow4.png',
                text: '坐等收钱\n安全可靠'
            }
        ]
    },

    onShow () {
        if (!wx.getStorageSync('orderid')) wx.setStorageSync('orderid', '');
        this.setData({record: wx.getStorageSync('options')});
        this.loadHotProducts();
    },

    onShareAppMessage: function () {
        return {
            title: '回收宝手机回收',
            path: '/page/hsb/index/index',
            success (res) {
            }
        }
    },

    onLoad () {
        that = this;
        // 获取客户端信息
        wx.getSystemInfo({
            success (res) {
                that.setData({systemInfo: res});
            }
        });
        products.getBrands(data => {
            data && that.setData({ brandsList: that.arrayDivision(data, 8) });
        });
        this.loadHotProducts();
    },

    /**
     * Get Hot Products and Set Storage
     */
    loadHotProducts () {
        wx.getStorage({
            key: 'products', 
            success: function (res) {
                if (res.data) {
                    that.setData({ hotList: JSON.parse(res.data) });
                    return;
                }
                products.hotList(res => {
                    wx.setStorage({
                        key: 'products',
                        data: JSON.stringify(res.items)
                    });
                    that.setData({ hotList: res.items });
                });
            },
            fail: function (res) {
                products.hotList(res => {
                    wx.setStorage({
                        key: 'products',
                        data: JSON.stringify(res.items)
                    });
                    that.setData({ hotList: res.items });
                });
            }
        })
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