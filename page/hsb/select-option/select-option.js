
import products from '../modules/model/products.js'
const constant = require('../modules/constant.js');

let that;
let selectResultMap = new Map();

Page({
    data: {
        text: "Page select-option",
        modelname: 'modelname',
        progress: 10,
        selectOptions : {},
        itemid : 0,
        evaluateEnable : false
    },
    onLoad: function (options) {
        that = this;
        selectResultMap.clear();
        wx.setNavigationBarTitle({
            title : options.name
        })
        this.setData({
            modelname : options.name,
            itemid : options.itemid
        });
        
        products.getSelectOption(this.data.itemid, (response) => {
            that.setData({
                selectOptions : response.itemList
            });
        });

    },

    chooseItem : function(event) {
        let questionId = event.currentTarget.dataset.questionId;
        let answerId = event.currentTarget.dataset.answerId;
        selectResultMap.set(questionId, answerId);
        this.updateSelectOptions();
        
    },

    updateSelectOptions : function() {
        let selectOptions = this.data.selectOptions;
        let allSelected = true;
        for(let questionItem of selectOptions) {
            let id = questionItem.id;
            if(selectResultMap.has(id)) {
                let selectAnswerId = selectResultMap.get(id);
                for(let answerItem of questionItem.question) {
                    if(selectAnswerId == answerItem.id) {
                        answerItem.isSelected = true;
                    } else {
                        answerItem.isSelected = false;
                    }
                }

            } else {
                allSelected = false;
            }
        }
        if(allSelected) {
            that.onAllOptionSelected();
        }
        this.setData({
            selectOptions : selectOptions
        });
    },

    onAllOptionSelected : function() {
        this.setData({
            evaluateEnable : true
        });
    },

    onEvaluateBtnClicked : function() {
        let answersArray = that.getSelectQuestionArray();
        wx.setStorage({
            key : constant.LOCAL_OPTION_KEY,
            data : answersArray
        });
        wx.navigateTo({
            url : '../evaluate-result/evaluate-result?name=' + that.data.modelname + '&evaluatePrice=testval' 
        });
    },

    getSelectQuestionArray : function() {
        let result = [];
        let selectOptions = this.data.selectOptions;
        for(let questionItem of selectOptions) {
            let answers = questionItem.question;
            for(let answerItem of answers) {
                if(answerItem.isSelected) {
                    result.push(answerItem.name);
                }
            }
        }
        return result;
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