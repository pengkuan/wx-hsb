















let target;
let data = {

};

Page({

    data : data,

    onLoad (data) {

        target = this;

        target.setData({

            mailUrl   : '../mail-method/mail-method?itemid='     + data.itemid + '&selects=' + data.selects,
            doorUrl   : '../door-method/door-method?itemid='     + data.itemid + '&selects=' + data.selects,
            subwayUrl : '../subway-method/subway-method?itemid=' + data.itemid + '&selects=' + data.selects,
        });

    }

});