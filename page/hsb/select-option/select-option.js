
import products from '../modules/model/products.js'

let that;
let selectResultMap = new Map();

Page({
    data: {
        text: "Page select-option",
        modelname: 'modelname',
        progress: 10,
        selectOptions : {},
        itemid : 0
    },
    onLoad: function (options) {
        that = this;
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

            }
        }
        this.setData({
            selectOptions : selectOptions
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