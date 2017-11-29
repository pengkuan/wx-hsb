import trade from '../../../model/trade';
let ctx;
Page({
    data: {
        ways: [{
            name: '顺丰上门取件',
            way: 'sf',
        }, {
            name: '上门回收（免费）',
            way: 'visit',
        }],
        way: 'sf',
        sf: {
            addr: {
                data: [],
                indexs: [0, 0, 0],
                selects: [[], [], []],
                value: '',
            },
            date: {
                data: [],
                indexs: [0, 0],
                selects: [[], []],
                value: ''
            },
        },
        hsb: {
            addr: {
                data: [],
                indexs: [0, 0],
                selects: [[], []],
                value: '',
            },
            date: {
                data: [],
                indexs: [0, 0],
                selects: [[], []],
                value: ''
            },
        },
        street: '',
        name: '',
        tel: ''
    },

    onLoad () {

        ctx = this;
        let sf = ctx.data.sf;
        let hsb = ctx.data.hsb;
        wx.setNavigationBarTitle({
            title: '提交订单'
        });

        // 获取顺丰地址
        trade.sfCity().then(data => {
            sf.addr.data = data;
            sf.addr.selects[0] = data;
            ctx.setData({
                sf
            });
            ctx.onProvinceChanged(data[0]);
        });

        // 获取上门时间
        trade.visitTime().then(res => {
            sf.date.data = res.sf;
            sf.date.selects[0] = res.sf.date;
            sf.date.selects[1] = res.sf.time[0];
            hsb.date.data = res.hsb;
            hsb.date.selects[0] = res.hsb.date;
            hsb.date.selects[1] = res.hsb.time[0];
            ctx.setData({sf, hsb});
            this.formatSfDate();
            this.formatHsbDate();
        });

        // 回收宝城市
        trade.hsbCity().then(data => {
            hsb.addr.data = data;
            hsb.addr.selects[0] = data;
            hsb.addr.selects[1] = data[0]['sub'];
            ctx.setData({hsb});
        })
    },

    /**
     * 监听province变化
     * @param obj
     */
    onProvinceChanged (obj) {
        let sf = ctx.data.sf;
        if (obj.sub) sf.addr.selects[1] = obj.sub;
        ctx.setData({sf});
        ctx.onCityChanged(obj.sub[0]);
    },

    sfAddrFormat () {
        let sf = ctx.data.sf;
        sf.addr.value = "";
        for (let i = 0; i < 3; i++) {
            if (sf.addr.selects[i].length) sf.addr.value += sf.addr.selects[i][sf.addr.indexs[i]]['name'];
        }
        ctx.setData({sf});
    },

    hsbAddrFormat () {
        let hsb = ctx.data.hsb;
        hsb.addr.value = "";
        for (let i = 0; i < 2; i++) {
            if (hsb.addr.selects[i].length) hsb.addr.value += hsb.addr.selects[i][hsb.addr.indexs[i]]['name'];
        }
        ctx.setData({hsb});
    },

    /**
     * 监听 city 变化
     */
    onCityChanged (obj) {
        let sf = this.data.sf;
        if (obj.sub) sf.addr.selects[2] = obj.sub;
    },

    handleSfAddr (e) {
        let sf = this.data.sf;
        sf.addr.indexs = e.detail.value;
        this.setData({sf});
    },

    handleSfAddrCol (event) {
        let sf = ctx.data.sf;
        let index = event.detail.value;
        let column = event.detail.column;
        switch (column) {
            case 0:
                sf.addr.selects[1] = sf.addr.data[index]['sub'];
                if (sf.addr.selects[1][0]['sub']) {
                    sf.addr.selects[2] = sf.addr.selects[1][0]['sub']
                } else {
                    sf.addr.selects[2] = [];
                }
                sf.addr.indexs[column + 1] = 0;
                sf.addr.indexs[column + 2] = 0;
                break;
            case 1:
                if (sf.addr.selects[column][index]['sub']) {
                    sf.addr.selects[2] = sf.addr.selects[column][index]['sub']
                } else {
                    sf.addr.selects[2] = [];
                }
                sf.addr.indexs[column + 1] = 0;
                break;
        }
        sf.addr.indexs[column] = index;
        this.setData({
            sf,
        });
        ctx.sfAddrFormat();
    },

    handleHsbAddrCol (e) {
        let hsb = ctx.data.hsb;
        let index = e.detail.value;
        let column = e.detail.column;
        switch (column) {
            case 0:
                hsb.addr.selects[1] = hsb.addr.data[index]['sub'];
                hsb.addr.indexs[column] = index;
                hsb.addr.indexs[column + 1] = 0;
                break;
            case 1:
                hsb.addr.indexs[1] = index;
                break;
        }
        this.setData({
            hsb
        });
        ctx.hsbAddrFormat();
    },

    handleSfDateCol (e) {
        let sf = ctx.data.sf;
        let index = e.detail.value;
        let column = e.detail.column;
        if (column == 0) sf.date.selects[1] = sf.date.data.time[index];
        sf.date.indexs[column] = index;
        this.setData({sf});
        this.formatSfDate();
    },

    handleHsbDateCol (e) {
        let hsb = ctx.data.hsb;
        let index = e.detail.value;
        let column = e.detail.column;
        if (column == 0) hsb.date.selects[1] = hsb.date.data.time[index];
        hsb.date.indexs[column] = index;
        this.setData({hsb});
        this.formatHsbDate();
    },

    formatSfDate () {
        let sf = ctx.data.sf;
        let temp = [];
        for (let i = 0; i < 2; i++) {
            if (sf.date.selects[i].length) temp.push(sf.date.selects[i][sf.date.indexs[i]]);
        }
        sf.date.value = temp.join(" ");
        ctx.setData({sf})
    },

    formatHsbDate () {
        let hsb = ctx.data.hsb;
        let temp = [];
        for (let i = 0; i < 2; i++) {
            if (hsb.date.selects[i].length) temp.push(hsb.date.selects[i][hsb.date.indexs[i]]);
        }
        hsb.date.value = temp.join(" ");
        ctx.setData({hsb})
    },

    switchWay(e) {
        console.log(e);
        let dataset = e.currentTarget.dataset;
        ctx.setData({way: dataset.way})
    },

    handleName (e) {
        this.setData({
            name: e.detail.value
        })
    },

    handleTel (e) {
        this.setData({
            tel: e.detail.value
        })
    },

    handleStreet (e) {
        this.setData({
            street: e.detail.value
        })
    }
});