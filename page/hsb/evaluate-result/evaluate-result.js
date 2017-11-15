
const constant = require('../modules/constant.js');
const products = require('../modules/model/products.js');
const chart = require("../modules/chartutils/chart.js");

let that;
Page({
    data: {
        evaluatePrice: '',
        downPrice: '',
        modelname: '',
        answerArray: [],
        allAnswers: [],
        isExpanded: false,
        itemid: {},
        selected: {},
        month : [],
        values : [],
        tipInfo:'请优先选择顺丰到付，全国包邮；若不满意检测结果，我们将免费寄回您的手机。',
        index:0,
        hsbFeature : [
            {
                img : '/image/icon/result1.png',
                text : '0元包邮'
            },
            {
                img : '/image/icon/result2.png',
                text : '24小时收款'
            },
            {
                img : '/image/icon/result3.png',
                text : '隐私0泄露'
            },
            {
                img : '/image/icon/result4.png',
                text : '专业检测'
            }
        ]
    },
    onLoad: function (options) {
        that = this;
        wx.setNavigationBarTitle({
            title: '评估结果'
        });

        this.setData({
            modelname: options.name
        });
        this.initQuestionArr();
        let selected = options.selected
        this.data.itemid = options.itemid;
        this.data.selected = options.selected;
        products.evaluate(options.itemid, selected, (data) => {
            that.setData({
                evaluatePrice: data.quotation,
                downPrice: parseInt((data.quotation) * 0.07)
            })
            that.refreshChart(data.quotation);
        });


    },
    
    reevaluate:function(){
        wx.navigateBack(); 
    },
    
    switchInfo:function(e){
        var dataset = e.currentTarget.dataset;
        var index=dataset.index*1;
        var tipInfo=that.data.tipInfo;
        index==0 && (tipInfo='请优先选择顺丰到付，全国包邮；若不满意检测结果，我们将免费寄回您的手机。');
        index==1 && (tipInfo='收到手机后（以快递签收时间为准），我们会在24小时内完成检测并且给您付款。');
        index==2 && (tipInfo='同意回收后，我们会对您的手机进行专业的数据删除服务，清理过程全程录像监控。');
        index==3 && (tipInfo='规范的流水作业操作，采用盲检技术，全流程视频监控，从业5年以上的检测工程师。');
        that.setData({
            tipInfo:tipInfo,
            index:index
        })
    },

    refreshChart: function (price) {
        price = parseFloat(price);
        let x4 = price;
        let x5 = x4 / (1 - 0.07);
        let x3 = x4 / (1 - 0.04);
        let x2 = x3 / (1 - 0.08);
        let x1 = x2 / (1 - 0.06);
        let xmonth = new Date().getMonth();
        let x3month = (xmonth - 1 + 12) % 12 + 1;
        let x2month = (xmonth - 2 + 12) % 12 + 1;
        let x1month = (xmonth - 3 + 12) % 12 + 1;
        let x5month = (xmonth + 1) % 12 + 1 ;
        let x4month = xmonth + 1;
        that.data.month = [];
        that.data.month.push(x1month);
        that.data.month.push(x2month);
        that.data.month.push(x3month);
        that.data.month.push(x4month);
        that.data.month.push(x5month);

        that.data.values = [];
        that.data.values.push(parseInt(x1));
        that.data.values.push(parseInt(x1 * 3 / 4));
        that.data.values.push(parseInt(x1 / 2));
        that.data.values.push(parseInt(x1 / 4));
        that.setData({
            month: that.data.month,
            values: that.data.values
        })
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