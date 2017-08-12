let products = require('../modules/model/products.js');
let plus     = require('../modules/plus.js');
let that;
let oIndex;
let optionsIndex;
let iCloud = '412';
Page({

    data    : {

        current      : 0,
        current2     : 0,
        optionsState : true,
        opt          : '',

    },

    swiperChange (e) {

        this.setData({
            current2: e.detail.current
        });

    },

    onLoad (options){

        that = this;
        this.setData({

            opt : options
        });

        optionsIndex = options.index;

        if (optionsIndex) {

            oIndex = wx.getStorageSync('options2')[options.index];

            this.setData({
                optionsState : false,
                options      : oIndex.name,
                options2     : oIndex.name,
                state        : false,
            });

            this.evaluate(oIndex.name, oIndex.itemid);
            wx.setNavigationBarTitle({title: options.name});
            return false;

        }

        wx.setNavigationBarTitle({title: options.name});
        products.options(options.itemid, function(data){

            that.options  = data.options;
            that.options2 = data.options2;
            that.picurl   = data.picurl;
            that.setData(data);

        });

    },

    optionsTap(e){

        let options   = this.options;
        let data      = e.currentTarget.dataset
        let index     = data.index
        let item      = options[index++];
        let name      = [];
        let curIdNew  = data.id;
        item.curId    = data.id;
        item.curName  = data.name;

        if (options.length === index){

            let ops = this.options = [];
            options.forEach( (item) => {

                name.push(item);
                item.curId || ops.push(item);

            });
            [].push.apply(options, ops);

            if (ops.length) {

                this.setData({options : options});
                this.setData({current : index});

                setTimeout(function(){

                    that.setData({
                        current : 0,
                        options : ops,
                    });

                }, 300);

            }

            else {

                // 所有选项选完就执行这里
                if (optionsIndex) this.data.options2[this.data.indexItem] = name[0];
                this.ifCurId(curIdNew);

                this.setData({
                    optionsState : false,
                    options      : options,
                    options2     : this.options2 || this.data.options2,
                    state        : false,
                });

                this.evaluate(this.data.options2, (that.data.opt.itemid || oIndex.itemid));
            }

        } else {

            if (!this.ifCurId(curIdNew)) return;

            this.setData({
                options : options,
                current : index,
            });
        }
    },

    ifCurId (id) {

        if (id == iCloud) {

            wx.showModal({

                content   : "对未解锁iPhone（含屏幕锁及iCloud锁），回收宝将不予回收！",
                showCancel: false,
            });

            return false;
        }

        return true;
    },

    options2Tap (e) {

        var index    = e.currentTarget.dataset.index;
        var options2 = this.options2 || this.data.options2;
        var ops      = this.options = [options2[index]];

        this.setData({
            current      : 0,
            options      : ops,
            optionsState : true,
            state        : false,
        });

    },

    evaluate (obj, itemid) {

        var sele    = obj || this.options2;
        var time    = +new Date;
        var selects = this.data.selects = sele.map( (item) => {

            return item.curId
        }).join('-');

        products.evaluate(itemid, selects, (data) => {

            plus.speedTooFast(time, 1000, () => {

                that.setData({
                    price : data.quotation,
                    state : true,
                    itemid: itemid,
                });

                let arrName  = [];
                let newArr   = [];
                let optionsN = wx.getStorageSync('options2');
                let oldArr;

                if (optionsN) oldArr = optionsN;

                for (let i in optionsN) {

                    arrName.push(optionsN[i].itemid);
                }

                if ((arrName.indexOf(itemid) == -1)) {

                    newArr.push({

                        name   : obj,
                        price  : data.quotation,
                        selects: selects,
                        itemid : itemid,
                        pName  : that.data.opt.name,
                        picurl : that.picurl,

                    });

                    let arr = (oldArr ? newArr.concat(oldArr) : newArr);

                    if (optionsN.length >= 3) arr.length = 3;
                    wx.setStorageSync('options2', arr);

                }

            });

        });
    },

    recoveryBtn () {

        var data = this.data;

        if (data.selects.indexOf(iCloud) > 0 ) {

            this.ifCurId(iCloud);
            return;
        }

        if (!data.state) return;

        wx.navigateTo({

            url: "../mail-method/mail-method?" + plus.buildQuery({

                itemid  : data.itemid,
                selects : data.selects,
            })

        });

    },
    // 弹窗
    prompt (text) {

        that.setData({ promptText : text });

        setTimeout( () => {

            that.setData({ promptText : '' });
        }, 1500);

    }
});
