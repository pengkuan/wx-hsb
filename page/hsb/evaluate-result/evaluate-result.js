
const constant = require('../modules/constant.js');
const products = require('../modules/model/products.js');

let that;
Page({
    data: {
        evaluatePrice: '',
        modelname: '',
        answerArray: [],
        isExpanded: false,
        itemid: {},
        selected: {}
    },
    onLoad: function (options) {
        that = this;
        wx.setNavigationBarTitle({
            title: options.name
        });

        this.setData({
            evaluatePrice: options.evaluatePrice,
            modelname: options.name
        });
        this.initQuestionArr();
        let selected = options.selected
        this.data.itemid = options.itemid;
        this.data.selected = options.selected;
        products.evaluate(options.itemid, selected, (data) => {
            that.setData({
                evaluatePrice: data.quotation
            })
        });

    },

    initQuestionArr: function () {
        wx.getStorage({
            key: constant.LOCAL_OPTION_KEY,
            success: (res) => {
                that.setData({
                    answerArray: res.data
                });
            }
        });
    },
    onRecycleBtnClick: function (event) {
        wx.navigateTo({
            url: "../mail-method/mail-method?itemid=" + this.data.itemid + "&selects=" + this.data.selected
        });
    },

    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})