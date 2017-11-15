let target;
let areaText;
let cityText;
let platText;
let oopIndex = 0;
let dateChangeIndex = 0;
let city = [];
let area = [];
let platform = [];
let time ;
let timeTxt = [];
let plus = require('../modules/plus.js');
let cityHTTP = require('../modules/model/city.js');
let user     = require('../modules/model/user.js');
var order    = require('../modules/model/order.js');
let data = {

    city       : city,
    area       : area,
    platform   : platform,
    cityIndex  : 0,
    areaIndex  : 0,
    dateIndex  : 0,
    timeIndex  : 0,
    time       : time,

};

Page({

    data : '',

    onLoad (eee) {

        target = this;

        let sfInputs = this.sfInputs = wx.getStorageSync('sfInputs') || {};

        this.setData({

            tel : sfInputs.tel,
            eee : eee,
            btn : this.checkInput(),
        });

        let data = {

            'www_uid'     : user.userInfo.wxuid,
            'www_userkey' : user.userInfo.wxukey,
        }

        cityHTTP.cityList (data, (res) => {

            city = res.data.data;
            target.setData({ city : city });
            target.areaList(0);

        });

        let date = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

        cityHTTP.visitTime('4403', (res) => {

            let time = res.data.data.config;

            for (let i in time) {

                timeTxt.push(time[i].date + ' ( ' + date[time[i].weeknum] + ' ) ' + time[i].starttime.substring(0, 5) + ' - ' + time[i].endtime.substring(0, 5));
            }

            target.setData({

                time     : timeTxt,
                dateText : time[0].date + ' ( ' + date[time[0].weeknum] + ' ) ' + time[0].starttime.substring(0, 5) + ' - ' + time[0].endtime.substring(0, 5)
            });

        });

    },

    areaList (index) {

        let obj = {

            'www_region_id' : city[index].region_id,
            'www_get_type'  : 0

        }

        cityHTTP.areaList (obj, (res) => {

            area = res.data.data;
            platform = area[0].metro_station_name;
            cityText = city[index].region_name;
            areaText = area[0].metro_name;
            platText = area[0].metro_station_name[0];

            target.setData({

                area       : area,
                platform   : platform,
                pickerText : cityText + ' - ' + areaText + ' - ' + platText,

            });

        });

    },

    cityBtn () {

        this.setData({
            pickerBody : 'picker-body-1',
            dateBody   : 'picker-body-0',
        });
    },

    cityClose () {

        this.setData({
            pickerBody : 'picker-body-0',
        });
    },

    dateBtn () {

        this.setData({
            dateBody   : 'picker-body-1',
            pickerBody : 'picker-body-0',
        });
    },

    dateClose () {

        this.setData({
            dateBody   : 'picker-body-0',
        });
    },

    cityChange (e) {

        let index = e.detail.value[0];
        oopIndex = index;
        target.areaList(index);
        this.setData({

            areaIndex     : 0,
            platformIndex : 0,
        });

    },

    areaChange (e) {

        let index = e.detail.value[0];

        platform = area[index].metro_station_name;
        areaText = area[index].metro_name;
        platText = area[index].metro_station_name[0];

        this.setData({

            platform      : platform,
            platformIndex : 0,
            pickerText    : cityText + ' - ' + areaText + ' - ' + platText,
        });

    },

    platformChange (e) {

        let index = e.detail.value[0];

        platText  = platform[index];
        this.setData({

            pickerText : cityText + ' - ' + areaText + ' - ' + platText,
        });
    },

    dateChange (e) {

        let index = e.detail.value[0];
        this.setData({

            dateText : timeTxt[index],
        });

    },

    timeChange (e) {

        let index = e.detail.value[0];
        this.visitDate(dateChangeIndex, index);
    },

    visitDate (dates, times) {

        this.setData({

            dateText : date[dates] + time[times]

        });
    },

    sfInput (e) {

        let key = e.currentTarget.dataset.key;
        let val = e.detail.value;
        this.sfInputs[key] = val;

        wx.setStorageSync('sfInputs', this.sfInputs);
        this.setData({
            btn : target.checkInput(),
        });
    },

    checkInput (callback) {

        let tel = this.sfInputs.tel;

        return (

            plus.checkInput(tel,  'checkTel', '请输入联系方式！', '联系方式格式有误，请重新输入！', callback)
        )
    },

    orderBtn () {

        var time = this.data.dateText;

        if (!target.checkInput(target.prompt)) return false;

        var data = {

            'transaction' : 'visit',
            'itemid'      : this.data.eee.itemid,
            'selects'     : this.data.eee.selects,
            'phone'       : this.sfInputs.tel,
            'payment'     : 'wepay',
            'quyu'        : cityText,
            'address'     : this.data.pickerText,
            'VisitTime'   : time.substring(0, 10) + time.substring(18, 23) + ':00',
            'subwayCity'  : city[oopIndex].region_id,

        }
        order.getOrder(data, function(data) {

            if (data.ret == 0) {

                let arr = [];
                let ooo = wx.getStorageSync('options2');

                for (let i in ooo) {

                    arr.push(ooo[i].itemid)
                }

                var pos = arr.indexOf(target.data.eee.itemid);
                ooo.splice(pos, 1);
                wx.setStorageSync('options2', ooo);

                wx.setStorageSync('orderSuccess', {

                    orderNum : data.ordernum,
                    type     : 2,
                });
                wx.switchTab({

                    url: '/page/hsb/my-order/my-order'
                });

            }

        });
    },

    prompt (text) {

        target.setData({
            promptText : text
        });
        setTimeout(() => {

            target.setData({
                promptText : ''
            });
        }, 1500);
    }
});