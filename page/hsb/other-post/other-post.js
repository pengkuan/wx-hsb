














var plus  = require('../modules/plus.js');
var that;

Page({

    data   : {
        phoneList : [
            {
                img : '/image/post/img-01.png',
                txt : 'EMS快递电话',
                tel : '11183'
            },{
                img : '/image/post/img-02.png',
                txt : '顺丰速运电话',
                tel : '95338'
            },{
                img : '/image/post/img-03.png',
                txt : '圆通速递电话',
                tel : '11183'
            },{
                img : '/image/post/img-04.png',
                txt : 'EMS快递电话',
                tel : '95554'
            },{
                img : '/image/post/img-05.png',
                txt : '韵达快递电话',
                tel : '95546'
            },{
                img : '/image/post/img-06.png',
                txt : '申通快递电话',
                tel : '95543'
            },{
                img : '/image/post/img-07.png',
                txt : '百世快递快递电话',
                tel : '400-956-5656'
            },{
                img : '/image/post/img-08.png',
                txt : '邮政包裹/挂号信',
                tel : '11185'
            }
        ]
    },

    onLoad : function (ops) {

        that = this;
    },

    reIndex () {
        wx.switchTab({

            url: '/page/hsb/index/index'
        })
    },

    makePhoneCall : plus.makePhoneCall,

});


