let LL2MC  = [[
    -0.0003218135878613132  , 111320.7020701615 , 0.00369383431289  ,
    823725.6402795718       , 0.46104986909093  , 2351.343141331292 ,
    1.58060784298199        , 8.77738589078284  , 0.37238884252424  , 7.45
], [
    -0.0003441963504368392  , 111320.7020576856 , 278.2353980772752 ,
    2485758.690035394       , 6070.750963243378 , 54821.18345352118 ,
    9540.606633304236       , -2710.55326746645 , 1405.483844121726 , 22.5
], [
    0.00220636496208        , 111320.7020209128 , 51751.86112841131 ,
    3796837.749470245       , 992013.7397791013 , -1221952.21711287 ,
    1340652.697009075       , -620943.6990984312, 144416.9293806241 , 37.5
], [
    0.00337398766765        , 111320.7020202162 , 4481351.045890365 ,
    -23393751.19931662      , 79682215.47186455 , -115964993.2797253,
    97236711.15602145       , -43661946.33752821, 8477230.501135234 , 52.5
], [
    0.0008277824516172526   , 111320.7020463578 , 647795574.6671607 ,
    -4082003173.641316      , 10774905663.51142 , -15171875531.51559,
    12053065338.62167       , -5124939663.577472, 913311935.9512032 , 67.5
], [
    -0.0015702102444        , 111320.7020616939 , 1704480524535203  ,
    -10338987376042340      , 26112667856603880 , -35149669176653700,
    26595700718403920       , -10725012454188240, 1800819912950474  , 82.5
]];

function wgs84Tobd09(wgs84) {

    let lat   = Math.abs(wgs84.latitude);
    let lng   = Math.abs(wgs84.longitude);
    let ll2mc = LL2MC[Math.floor(lat / 15)];

    let z     = lat / ll2mc[9];

    lng = ll2mc[0] + ll2mc[1] * lng;

    lat = ll2mc[2]
          + ll2mc[3] * z
          + ll2mc[4] * Math.pow(z, 2)
          + ll2mc[5] * Math.pow(z, 3)
          + ll2mc[6] * Math.pow(z, 4)
          + ll2mc[7] * Math.pow(z, 5)
          + ll2mc[8] * Math.pow(z, 6);

    return {

        lng : +lng.toFixed(2),
        lat : +lat.toFixed(2)
    };
}
let target;
let areaText;
let cityText;
let dateChangeIndex = 0;
let city = [];
let area = [];
let time;
let timeTxt = [];
let plus = require('../modules/plus.js');
let cityHTTP = require('../modules/model/city.js');
let user     = require('../modules/model/user.js');
var order    = require('../modules/model/order.js');
let sfOther  = require('../modules/model/other.js');

// var app = getApp()
let data = {

    city        : city,
    area        : area,
    cityIndex   : 0,
    areaIndex   : 0,
    dateIndex   : 0,
    timeIndex   : 0,
    time        : time,
    hasLocation : false,
    dis         : '60',
    num         : 1,
    sfAddress   : '',

};
Page({

    data : data,

    onLoad (eee) {

        this.setData({
            eee : eee
        });
    },

    onShow () {

        target = this;

        let sfInputs = this.sfInputs = wx.getStorageSync('sfInputs') || {};

        this.setData({

            sfTel     : sfInputs.tel,
            sfAddress : sfInputs.sfAddress,
            btn       : this.checkInput(),

        });

        let data = {

            'www_uid'     : user.userInfo.wxuid,
            'www_userkey' : user.userInfo.wxukey,
        }

        cityHTTP.visitTime('4403', (res) => {

            let time = res.data.data.config;
            let date = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            for (let i in time) {

                timeTxt.push(time[i].date + ' ( ' + date[time[i].weeknum] + ' ) ' + time[i].starttime.substring(0, 5) + ' - ' + time[i].endtime.substring(0, 5));
            }

            target.setData({

                time     : timeTxt,
                dateText : time[0].date + ' ( ' + date[time[0].weeknum] + ' ) ' + time[0].starttime.substring(0, 5) + ' - ' + time[0].endtime.substring(0, 5)
            });
        });

        cityHTTP.cityList (data, (res) => {

            city = res.data.data;

            target.areaList(0);
            // wx.getLocation({

            //     success (rel) {

            //         console.log(rel.longitude)

            //         target.setData({
            //             aaa : rel.longitude,
            //             bbb : rel.latitude,
            //         })

            //         let obj = {

            //             lng : rel.longitude,
            //             lat : rel.latitude,
            //             dis : target.data.dis,
            //             num : target.data.num,
            //         }

            //         sfOther.getLocation(obj, (res) => {

            //             var data = res.data.detail;

            //             res.data.items.forEach( (item) => {

            //                 item.name = item.name.replace(/[(（]/, ' ').replace(/[)）]/, '');
            //             });

            //             target.areaList(0, res.data.detail.city + ' - ' + res.data.detail.district);
            //         });

            //     }
            // });

        });
    },

    areaList (index, dataTxt) {

        let obj = {

            'www_region_id' : city[index].region_id,
            'www_get_type'  : 1
        }

        cityHTTP.areaList (obj, (res) => {

            area     = res.data.data;
            cityText = city[index].region_name;
            areaText = area[0].region_name;
            target.setData({

                city       : city,
                area       : area,
                pickerText : dataTxt || cityText + ' - ' + areaText,
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

        target.areaList(index);
        this.setData({

            areaIndex : 0
        });

    },

    areaChange (e) {

        let index = e.detail.value[0];

        areaText = area[index].region_name;
        this.setData({
            pickerText : cityText + ' - ' + areaText,
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

        let tel  = this.sfInputs.tel;
        let addr = this.sfInputs.sfAddress;

        return (

            plus.checkInput(addr, 'checkName', '请输入详细地址！', '', callback) &&
            plus.checkInput(tel,  'checkTel', '请输入联系方式！', '联系方式格式有误，请重新输入！', callback)
        );

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
            'address'     : this.data.pickerText + ' - ' + (this.sfInputs.sfAddress || this.data.sfAddress),
            'VisitTime'   : time.substring(0, 10) + time.substring(18, 23) + ':00',

        }

        order.getOrder(data, (data) => {

            console.log(111)
            console.log(data, 965959)

            if (data.ret == 0) {

                let arr = [];
                let ooo = wx.getStorageSync('options2');

                for (let i in ooo) {

                    arr.push(ooo[i].itemid);
                }

                var pos = arr.indexOf(this.data.eee.itemid);
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