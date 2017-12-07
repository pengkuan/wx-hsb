import Utils from '../../../util/utils';
import order from '../../../model/order';
import user from '../../../model/user';

let ctx, app = getApp();

Page({

    data: {
        orderInfo: {},
        curTime: '',
    },

    onLoad() {
        ctx = this;
        wx.setNavigationBarTitle({
            title: '提交结果'
        })
    },

    onShow() {
        let options = Utils.getCurPageOpt();
        let curTimeObj = Utils.formatDate();
        console.log(options.orderInfo);
        let orderInfo = {};
        if (options.orderInfo) orderInfo = JSON.parse(options.orderInfo);
        ctx.setData({
            orderInfo,
            curTime: `${curTimeObj.Y}-${curTimeObj.M}-${curTimeObj.D} ${curTimeObj.h}:${curTimeObj.m}:${curTimeObj.s}`,
        });
        if (orderInfo.ordertype !== 'post') return;
        order.takeSfOrder(orderInfo).then(data => {
            console.log(data);
            orderInfo.trackNum = 186451212345;
        }, err => {
            console.log(err);
        })
    },

    switchPage(e) {
        let dataSet = e.currentTarget.dataset;
        let userInfo = user.getUserInfo();
        let pages = getCurrentPages();
        console.log(dataSet);
        if (dataSet.needlogin) {
            if (!userInfo.tel) {
                wx.navigateTo({
                    url: `../bind/index?type=bind&redirectUrl=${encodeURIComponent(dataSet.url)}`
                })
            } else {
                wx.navigateTo({
                    url: dataSet.url
                });
            }
        } else {
            wx.navigateTo({
                url: dataSet.url
            });
        }
    },
});