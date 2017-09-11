var order = require('../modules/model/order.js');
var plus  = require('../modules/plus.js');
var user  = require('../modules/model/user.js');
var that;

Page({

    data    : {},
    onLoad  : function (options) {

        that = this;

        var sfInputs  =
        this.sfInputs = wx.getStorageSync('sfInputs') || {};

        this.order = options;
        this.setData({
            // orderhash : data.data.data,
            // options   : options,
            name      : sfInputs.name || '',
            tel       : sfInputs.tel  || '',
            btn       : this.checkInput(),
        });
        // order.getOrderHash(function(data){});
    },
    // 持久化用户输入
    input : function(e) {

        var key = e.currentTarget.dataset.key;
        var val = e.detail.value;
        this.sfInputs[key] = val;

        wx.setStorageSync('sfInputs', this.sfInputs);
        this.setData({
            btn : this.checkInput(),
        });
    },
    // 验证输入信息
    checkInput : function (callback) {

        var name = this.sfInputs.name;
        var tel  = this.sfInputs.tel;
        return  plus.checkInput(name, 'checkName', '请输入联系人姓名！', '请输入正确的用户名称'          , callback) &&
                plus.checkInput(tel,  'checkTel' , '请输入联系方式！'  , '联系方式格式有误，请重新输入！', callback);
    },

    // 提交订单
    orderBtn : function () {

        if (this.checkInput(this.prompt)) {

            /*let arr = [];
            let ooo = wx.getStorageSync('options2');

            for (let i in ooo) {

                arr.push(ooo[i].itemid)
            }

            var pos = arr.indexOf(this.order.itemid);
            var ooo = wx.getStorageSync('options2');
            ooo.splice(pos, 1);
            wx.setStorageSync('options2', ooo);*/

            var data = {

                'transaction'   : 'post',
                'itemid'        : this.order.itemid,
                'selects'       : this.order.selects,
                'name'          : this.sfInputs.name,
                'phone'         : this.sfInputs.tel,
                'payment'       : 'wepay',

            }

            order.getOrder(data, function(data){
                if (data) {
                    that.prompt('下单成功!');

                    wx.setStorageSync('orderSuccess', {

                        orderNum : data.ordernum,
                    });
                    wx.setStorageSync('orderId', data.orderid);
                    wx.switchTab({

                        url: '/page/hsb/my-order/my-order'
                    });
                }else{
                    that.prompt('下单失败!');
                }

            });
        }
    },

    // 弹窗
    prompt : function (text) {

        that.setData({
            promptText : text
        });
        setTimeout(function () {

            that.setData({
                promptText : ''
            });
        }, 1500);
    }

});