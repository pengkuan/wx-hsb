
const constant = require('../modules/constant.js');

let that;
Page({
    data: {
        text: "Page evaluate-result",
        evaluatePrice : '',
        modelname : '',
        questionArray : [],
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

    },

    initQuestionArr : function() {
        wx.getStorage({
            key : constant.LOCAL_OPTION_KEY,
            success : (res) => {
                that.setData({
                    questionArray : res.data
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