
const constant = require('../modules/constant.js');
const products = require('../modules/model/products.js');
const chart = require("../modules/chartutils/chart.js");

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
            title: '评估结果'
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
            that.refreshChart(data.quotation);
        });


    },
    
    reevaluate:function(){
        wx.navigateBack(); 
    },

    refreshChart: function (price) {
        price = parseFloat(price);
        let x4 = price;
        let x5 = x4 / (1 - 0.07);
        let x3 = x4 / (1 - 0.04);
        let x2 = x3 / (1 - 0.08);
        let x1 = x2 / (1 - 0.06);
        let xmonth = new Date().getMonth();
        let x3month = (xmonth - 1 + 12) % 12 + 1 + '月';
        let x2month = (xmonth - 2 + 12) % 12 + 1 + '月';
        let x1month = (xmonth - 3 + 12) % 12 + 1 + '月';
        let x5month = (xmonth + 1) % 12 + 1 + '月';
        let x4month = xmonth + 1 + '月';

        chart.draw(this, 'chartCanvas', {
            title: {
                text: "",
                color: "#000000"
            },
            xAxis: {
                data: [x1month, x2month, x3month, x4month, x5month]
            },
            color: ["#F9BE04", "#4FC7FE"],
            series: [
                // {
                //   name: "第一季度",
                //   category: "bar",
                //   data: [37, 63, 60, 78, 92, 63, 57, 48]
                // },
                {
                    name: "回收宝估价",
                    category: "line",
                    data: [parseInt(x1), parseInt(x2), parseInt(x3), parseInt(x4), parseInt(x5)]
                },
                {
                    name: "市场均价",
                    category: "line",
                    data: [parseInt(x1 * 0.9), parseInt(x2 * 0.9), parseInt(x3 * 0.9), parseInt(x4 * 0.9), parseInt(x5 * 0.9)]
                },
                // {
                //   name: ['北京', '上海', '杭州', '深圳', '广州', '成都'],
                //   category: "pie",
                //   data: [40, 38, 39, 28, 27, 33]
                // }
            ]
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