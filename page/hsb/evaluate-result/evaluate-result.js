
const constant = require('../modules/constant.js');
const products = require('../modules/model/products.js');

let that;
Page({
    data: {
        evaluatePrice: '',
        modelname: '',
        answerArray: [],
        allAnswers: [],
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
                that.data.allAnswers = res.data;
                that.collapseOptions();

            }
        });
    },
    onRecycleBtnClick: function (event) {
        wx.navigateTo({
            url: "../mail-method/mail-method?itemid=" + this.data.itemid + "&selects=" + this.data.selected
        });
    },

    onExpandBtnClick: function (event) {
        if (that.data.isExpanded) {
            that.collapseOptions();
        } else {
            that.expandOptions();
        }
    },
    collapseOptions: function (event) {
        that.data.answerArray = [];
        let i = 0;
        for (let item of that.data.allAnswers) {
            if (i >= 3) {
                break;
            }
            that.data.answerArray.push(JSON.parse(JSON.stringify(item)));
            i++;
        }
        that.setData({
            answerArray: that.data.answerArray,
            isExpanded: false
        });

    },
    expandOptions: function (event) {
        that.data.answerArray = [];
        that.data.answerArray = JSON.parse(JSON.stringify(that.data.allAnswers));
        that.setData({
            answerArray: that.data.answerArray,
            isExpanded: true
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