
import products from '../modules/model/products.js'

let that;

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
            })
            console.log("selectOptions" + response.itemList);
            console.log(JSON.stringify(response.itemList));
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