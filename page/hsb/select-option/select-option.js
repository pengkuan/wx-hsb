
import products from '../modules/model/products.js'
const constant = require('../modules/constant.js');

let that;
let selectResultMap = new Map();

Page({
    data: {
        text: "Page select-option",
        modelname: 'modelname',
        selectOptions: [],
        allOptions: [],
        allTransOptions: [],
        nowSelectIndex: 0,
        itemid: 0,
        evaluateEnable: false,
        scrollToView: {},
        wHeight: 800,
        choosePercent: 0,
    },
    onLoad: function (options) {
        that = this;
        selectResultMap.clear();
        wx.setNavigationBarTitle({
            title: '评估价格'
        })

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    wHeight: res.windowHeight - 78
                })
            }
        })

        this.setData({
            modelname: options.name,
            itemid: options.itemid
        });

        products.getSelectOption(this.data.itemid, (response) => {
            that.data.allOptions = response.itemList;
            that.data.allTransOptions = that.transMultOptions(response.itemList);
            that.data.selectOptions = that.transNowOptions(that.data.allTransOptions);
            that.setData({
                selectOptions: that.data.selectOptions
            });
        });

    },

    transNowOptions : function(allTransOptions) {
        let result = [];
        let i = 0;  
        for (let item of allTransOptions) {
            let newItem = JSON.parse(JSON.stringify(item));
            result.push(newItem);
            if (i > that.data.nowSelectIndex) {
                result[i].question = [];
            }
            i++;
        }
        return result;
    },

    transMultOptions: function (allOptions) {
        let i = 0;
        let allTransOptions = [];
        let multiItem = new Object();
        multiItem.isMulti = true;
        multiItem.question = [];
        multiItem.name = '功能性选项(可多选或不选)';
        for (let item of allOptions) {
            let newItem = JSON.parse(JSON.stringify(item));
            if(item.conftype == '3') {
                for(let questionItem of newItem.question) {
                    if(questionItem.show == '1') {
                        multiItem.question.push(questionItem);
                    }
                }
            } else {
                    
                allTransOptions.push(newItem);
            }
            
        }
        allTransOptions.push(multiItem);
        return allTransOptions;
    },

    refreshSelectOptionsBySelectIndex: function () {
        let i = 0;
        for (let item of that.data.allTransOptions) {
            if (i <= that.data.nowSelectIndex) {
                this.data.selectOptions[i].question = item.question;
            }
            i++;
        }
    },

    chooseItem: function (event) {
        let questionId = event.currentTarget.dataset.questionId;
        let answerId = event.currentTarget.dataset.answerId;
        let selectIndex = event.currentTarget.dataset.index;
        selectResultMap.set(questionId, answerId);
        that.data.nowSelectIndex = selectIndex + 1;
        that.refreshSelectOptionsBySelectIndex();
        this.updateSelectOptions();

    },

    updateSelectOptions: function () {
        let selectOptions = this.data.selectOptions;
        let allSelected = true;
        for (let item of selectOptions) {
            let id = item.id;
            if(item.isMulti) {
                let selectAnswerId = selectResultMap.get(id);
                for (let answerItem of item.question) {
                    if (selectAnswerId == answerItem.id) {
                        answerItem.isSelected = !answerItem.isSelected;
                    }
                }
                continue;
            }
            if (selectResultMap.has(id)) {
                let selectAnswerId = selectResultMap.get(id);
                for (let answerItem of item.question) {
                    if (selectAnswerId == answerItem.id) {
                        answerItem.isSelected = true;
                    } else {
                        answerItem.isSelected = false;
                    }
                }

            } else {
                allSelected = false;
            }
        }

        if (allSelected) {
            that.onAllOptionSelected();
        }
        let percent = parseInt(that.data.nowSelectIndex / 1.0 / that.data.allTransOptions.length * 100);
        if (that.data.choosePercent < percent) {
            that.data.choosePercent = percent;
        }
        that.setData({
            selectOptions: selectOptions,
            scrollToView: "option_" + that.data.nowSelectIndex,
            choosePercent: that.data.choosePercent
        });
    },

    onAllOptionSelected: function () {
        this.setData({
            evaluateEnable: true
        });
    },

    onEvaluateBtnClicked: function () {
        if (!that.data.evaluateEnable) {
            return;
        }
        let answersArray = that.getSelectQuestionArray();
        let selected = that.getSelected();
        wx.setStorage({
            key: constant.LOCAL_OPTION_KEY,
            data: answersArray
        });
        wx.navigateTo({
            url: '../evaluate-result/evaluate-result?name=' + that.data.modelname +
            '&selected=' + selected +
            '&itemid=' + that.data.itemid
        });
    },

    getSelectQuestionArray: function () {
        let result = [];
        let selectOptions = this.data.selectOptions;
        for (let questionItem of selectOptions) {
            let answers = questionItem.question;
            for (let answerItem of answers) {
                if (answerItem.isSelected) {
                    result.push(answerItem.name);
                }
            }
        }
        return result;
    },

    getSelected: function () {
        let result = '';
        let selectOptions = this.data.selectOptions;
        for (let questionItem of selectOptions) {
            let answers = questionItem.question;
            for (let answerItem of answers) {
                if (answerItem.isSelected) {
                    result += answerItem.id + '-';
                }
            }
        }
        return result.substring(0, result.length - 1);

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