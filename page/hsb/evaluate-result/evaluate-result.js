
const constant = require('../modules/constant.js');

let that;
Page({
    data: {
        evaluatePrice : '',
        modelname : '',
        answerArray : [1,2,3,4,5,6,7,8,9],
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