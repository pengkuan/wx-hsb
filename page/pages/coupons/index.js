import Utils from '../../../util/utils';
import coupon from '../../../model/coupon';
import user from '../../../model/user';

let ctx, app = getApp();

Page({

    data: {
        menuIndex: 0,
        left: 0,
        unUsedCoupon: [],
        usedCoupon: [],
        outTimeCoupon: [],
        menuList: [{
            text: '未使用',
            length: 2
        }, {
            text: '已使用',
            length: 2
        }, {
            text: '已过期',
            length: 2
        }],
        token: '',
        couponList: []
    },

    onShow() {
        ctx = this;
        wx.setNavigationBarTitle({
            title: '我的优惠券'
        });
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
        });
        let userInfo = user.getUserInfo();
        ctx.setData({
            userInfo
        });
        ctx.loadCoupons();
    },

    loadCoupons() {
        let userInfo = ctx.data.userInfo;
        let unUsedCoupon = [];
        let usedCoupon = [];
        let outTimeCoupon = [];
        let curTime = Utils.curTimeStamp();
        let menuList = ctx.data.menuList;
        coupon.page({
            uid: userInfo.us_uid,
            userkey: userInfo.userkey
        }).then(cps => {
            if (!cps) cps = [];
            cps = cps.map(item => {
                let timeObj = Utils.formatDate(parseInt(item.invalidTime) * 1000);
                item.deadline = `${timeObj.Y}-${timeObj.M}-${timeObj.D}`;
                item.value = parseInt(item.faceValue) / 100;
                return item;
            });
            cps.map(item => {
                if (item.status != 10) {
                    // 已经使用
                    usedCoupon.push(item);
                } else if ((parseInt(item.invalidTime) * 1000) < curTime) {
                    // 已经过期
                    outTimeCoupon.push(item);
                } else {
                    unUsedCoupon.push(item);
                }
            }, err => {
            });
            menuList[0]['data'] = unUsedCoupon;
            menuList[1]['data'] = usedCoupon;
            menuList[2]['data'] = outTimeCoupon;
            Utils.sortByKey(cps, 'value');
            ctx.setData({
                couponList: cps,
                usedCoupon,
                unUsedCoupon,
                outTimeCoupon,
                menuList
            })
        }, err => {
            console.log(err);
        });
    },

    setLeft() {
        let left = (ctx.data.menuIndex / 3) * 100;
        ctx.setData({
            left
        })
    },

    handleMenu(e) {
        let dataset = e.currentTarget.dataset;
        console.log(dataset);
        ctx.setData({
            menuIndex: dataset.index
        })
    },

    handleToken(e) {
        ctx.setData({
            token: e.detail.value
        })
    },

    addCoupon() {
        coupon.add({
            token: ctx.data.token,
            uid: ctx.data.userInfo.us_uid
        }).then(res => {
            wx.showToast({
                title: '添加成功'
            });
            ctx.loadCoupons();
        }, err => {
            wx.showModal({
                title: '提示',
                content: err,
                showCancel: false
            })
        })
    },
    // switchPage(e) {
    //   let dataset = e.currentTarget.dataset;
    //   wx.navigateTo({
    //     url: dataset.url
    //   })
    // }
});