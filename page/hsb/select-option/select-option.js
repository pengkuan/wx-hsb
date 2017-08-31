
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
        nowSelectIndex: 0,
        itemid: 0,
        evaluateEnable: false,
        scrollToView: {},
        wHeight : 800,
        choosePercent : 0,
    },
    onLoad: function (options) {
        that = this;
        selectResultMap.clear();
        wx.setNavigationBarTitle({
            title: options.name
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
            let i = 0;
            for (let item of that.data.allOptions) {
                that.data.selectOptions.push(JSON.parse(JSON.stringify(item)));
                if (i > that.data.nowSelectIndex) {
                    that.data.selectOptions[i].question = [];
                }
                i++;
            }
            that.setData({
                selectOptions: that.data.selectOptions
            });
        });

    },

    refreshSelectOptionsBySelectIndex: function () {
        let i = 0;
        for (let item of that.data.allOptions) {
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
        for (let questionItem of selectOptions) {
            let id = questionItem.id;
            if (selectResultMap.has(id)) {
                let selectAnswerId = selectResultMap.get(id);
                for (let answerItem of questionItem.question) {
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
        let percent = parseInt(that.data.nowSelectIndex / 1.0 / that.data.allOptions.length * 100);
        if(that.data.choosePercent < percent) {
            that.data.choosePercent = percent;
        }
        that.setData({
            selectOptions: selectOptions,
            scrollToView: "option_" + that.data.nowSelectIndex,
            choosePercent :  that.data.choosePercent
        });
    },

    onAllOptionSelected: function () {
        this.setData({
            evaluateEnable: true
        });
    },

    onEvaluateBtnClicked: function () {
        if(!that.data.evaluateEnable) {
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