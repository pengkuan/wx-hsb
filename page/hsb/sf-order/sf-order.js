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


let pickerData = require('./picker-view.js');
let sfOther    = require('../modules/model/other.js');
let plus       = require('../modules/plus.js');
let target;
let province   = [];
let city       = [];
let area       = [];
let data = {

    province     : province,
    provinceView : province[0],
    city         : city,
    cityView     : city[0],
    area         : area,
    areaView     : area[0],
    pickerBody   : 'picker-body-0',
    options      : '',
    pickerText   : '',
    provinceIndex: 0,
    cityIndex    : 0,
    areaIndex    : 0,
    modalHidden  : true,
    modalHidden2 : true,
    defaultP     : '',
    citytest     : '',
    areatest     : '',
    searchValue  : '',
    dis          : 60,
    num          : 1,

};
Page({

    data : data,

    onShow () {

        let sfInputs = this.sfInputs = wx.getStorageSync('sfInputs') || {};
        let data = target.data.options;

        for (let i in pickerData) {

            province.push(pickerData[i].name);
        }

        if (!pickerData[0].sub[0].sub) {

            for (let i in pickerData[0].sub) {

                city.push(pickerData[0].sub[i].name);
            }

            area.push('');
        }

        target.setData({
            province   : province,
            city       : city,
            area       : area,
            sfName     : sfInputs.name,
            sfTel      : sfInputs.tel,
            pickerText : '请选择城市区域!',
            sfAddress  : this.sfInputs.sfAddress || this.data.sfAddress,
        });

        // wx.getLocation({

        //     success (rel) {

        //         let obj = {

        //             lng : rel.longitude,
        //             lat : rel.latitude,
        //             dis : target.data.dis,
        //             num : target.data.num,
        //         }

        //         sfOther.getLocation(obj, (res) => {

        //             if (res) {

        //                 var data = res.data.detail;
        //                 area = [data.district];

        //                 res.data.items.forEach( (item) => {

        //                     item.name = item.name.replace(/[(（]/, ' ').replace(/[)）]/, '');
        //                 });

        //                 target.setData({

        //                     options    : target.data.options,
        //                     province   : province,
        //                     city       : city,
        //                     area       : area,
        //                     sfName     : sfInputs.name,
        //                     sfTel      : sfInputs.tel,
        //                     lbsState   : true,
        //                     lbs        : res.data,
        //                     defaultP   : data.province,
        //                     defaultC   : data.city,
        //                     defaultA   : data.district,
        //                     // pickerText : data.province + data.city + data.district,
        //                     // sfAddress  : res.data.items[0].name,

        //                 });
        //             }
        //         });
        //     }
        // });

    },

    onLoad (options) {

        target = this;
        target.data.options = options;
    },

    provinceChange (e) {

        city.length = 0;
        area.length = 0;

        let val     = e.detail.value;
        let picker  = pickerData[val].sub;

        if (!picker[0].sub) {

            for (let i in picker) {

                city.push(picker[i].name);
            }
            area.push('');
        }

        else {

            for (let i in picker) {

                city.push(picker[i].name);
            }

            for (let i in picker[0].sub) {

                area.push(picker[0].sub[i].name);
            }
        }

        this.setData({

            provinceIndex : val,
            cityIndex     : 0,
            areaIndex     : 0,
            city          : city,
            area          : area,
            pickerText    : province[val] + city[0] + area[0]

        });
    },

    cityChange (e) {

        if (area.length == 1) area.push('');

        let val           = e.detail.value;
        let provinceIndex = this.data.provinceIndex;

        area.length = 0;

        for (let i in pickerData[provinceIndex].sub[val].sub) {

            area.push(pickerData[provinceIndex].sub[val].sub[i].name);
        }

        this.setData({
            city       : city,
            area       : area,
            areaIndex  : 0,
            cityIndex  : val,
            pickerText : province[provinceIndex] + city[val] + (area.length ? area[0] : '')
        });
    },

    areaChange (e) {

        let val           = e.detail.value;
        let provinceIndex = this.data.provinceIndex;
        let cityIndex     = this.data.cityIndex;

        this.setData({
            city       : city,
            area       : area,
            pickerText : province[provinceIndex] + city[cityIndex] + (area[val] ? area[val] : '')
        });
    },

    sfInput (e) {

        let key = e.currentTarget.dataset.key;
        let val = e.detail.value;
        this.sfInputs[key] = val;
        wx.setStorageSync('sfInputs', this.sfInputs);

    },

    // 验证输入信息
    checkInput (callback) {

        let name = this.sfInputs.name,
            tel  = this.sfInputs.tel,
            addr = this.sfInputs.sfAddress || this.data.sfAddress,
            pick = this.data.pickerText;

            if (pick == '请选择城市区域!') {
                pick = '';
            }

        return  (

            plus.checkInput(name, 'checkName' , '请输入联系人姓名！', '', callback) &&
            plus.checkInput(tel,  'checkTel'  , '请输入联系方式！'  , '联系方式格式有误，请重新输入！', callback) &&
            plus.checkInput(pick, 'checkName' , '请选择城市区域'    , '', callback) &&
            plus.checkInput(addr, 'checkName' , '请输入详细地址'    , '', callback)

        );
    },

    cityBtn () {

        let provinceIndex = this.data.provinceIndex;
        let cityIndex     = this.data.cityIndex;
        let areaIndex     = this.data.areaIndex;
        let aaa;

        if (area.length < 2) {

            aaa  = '';
            area = [''];

        } else { aaa  = area[areaIndex] }

        this.setData({

            pickerBody : 'picker-body-1',
            pickerText : province[provinceIndex] + city[cityIndex] + aaa,
            defaultP   : '',
            defaultC   : '',
            defaultA   : '',
            area       : area,

        });

    },

    cityClose () {

        this.setData({ pickerBody : 'picker-body-0' });
    },

    appointmentBtns () {

        var data = target.data.options,
            that = this;

        if (!target.checkInput(target.prompt)) return false;

        (!area[0]) && (area.length = 0);

        sfOther.sfInService(target.data.pickerText, (data) => {

            if (data.data.ret == 0 && data.data.data.filterret == 2 && area.length) {

                target.getReservationSFOrder();

            } else { that.showModal() }

        });
    },

    showModal () {

        wx.showModal({

            content    : "您所填写的地址不在顺丰上门取件区域，是否选择自行联系快递发货?",
            confirmText: "确定",
            cancelText : "取消",
            success (res) {

                if (res.confirm) wx.navigateTo({ url: "../other-post/other-post" });
            }
        });
    },

    getReservationSFOrder () {

        let provinceIndex = this.data.provinceIndex,
            cityIndex     = this.data.cityIndex,
            areaIndex     = this.data.areaIndex,
            provincetest  = this.data.defaultP || province[provinceIndex],
            citytest      = this.data.defaultC || city[cityIndex],
            areatest      = this.data.defaultA || area[areaIndex];

        let obj = {

            'orderid' : wx.getStorageSync('orderId') || '',
            'uname'   : this.sfInputs.name,
            'tel'     : this.sfInputs.tel,
            'addrtel' : this.sfInputs.tel,
            'province': provincetest,
            'city'    : citytest,
            'county'  : areatest,
            'addr'    : this.data.pickerText + this.sfInputs.sfAddress

        };

        sfOther.getReservationSFOrder(obj, (data) => {

            if (data.data.errstr == "您已下过顺丰订单!") {

                target.prompt(data.data.errstr);
                return false;
            }

            if (data.data.data.mailno) {

                wx.navigateTo({

                    url: "../sf-success/sf-success?oid=" + wx.getStorageSync('orderId')
                });

            }
        });
    },

    // 弹窗
    prompt (text) {

        target.setData({ promptText : text });

        setTimeout(() => {

            target.setData({ promptText : '' });
        }, 1500);
    }
})
