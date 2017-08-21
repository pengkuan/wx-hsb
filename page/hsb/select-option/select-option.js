
import products from '../modules/model/products.js'

Page({
    data: {
        text: "Page select-option",
        modelname: 'modelname',
        progress: 10,
        selectOptions: '',
        itemid : 0
    },
    onLoad: function (options) {
        this.setData({
            modelname : options.name,
            itemid : options.itemid
        });
        
        products.getSelectOption(this.data.itemid, (response) => {
            this.selectOptions = response;
            console.log("selectOptions" + response);
            console.log(JSON.stringify(response));
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