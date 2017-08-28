
const constant = require('../modules/constant.js');
const products = require('../modules/model/products.js');

let that;
Page({
    data: {
        evaluatePrice : '',
        modelname : '',
        answerArray : [],
        isExpanded : false
    },
    onLoad: function (options) {
        that = this;
        wx.setNavigationBarTitle({
            title: options.name
        });
        
        this.setData({
            evaluatePrice : options.evaluatePrice,
            modelname : options.name
        });
        this.initQuestionArr();
        let selected = options.selected
        products.evaluate(options.itemid,selected,(data) => {
            that.setData({
                evaluatePrice: data.quotation
            })
        });

    },

    initQuestionArr : function() {
        wx.getStorage({
            key : constant.LOCAL_OPTION_KEY,
            success : (res) => {
                that.setData({
                    answerArray : res.data
                });
            }
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