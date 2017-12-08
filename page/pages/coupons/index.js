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

  onShow () {
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

  loadCoupons () {
    let userInfo = ctx.data.userInfo;
    let unUsedCoupon = [];
    let usedCoupon = [];
    let outTimeCoupon = [];
    let curTime = Utils.curTimeStamp();
    let menuList = ctx.data.menuList;
    // coupon.page({
    //   uid: userInfo.us_uid,
    //   userkey: userInfo.userkey
    // }).then(cps => {
    //   if (!cps) cps = [];
    let cps = [
      {
        "activityBatchID": "349",
        "bargainLimited": "20000",
        "consumeTime": "",
        "couponDescription": "",
        "couponID": "8dbcc42557",
        "faceValue": "1000",
        "factivityDescription": "高雄测试_1130_02",
        "invalidTime": "1512633512",
        "pID": "1043",
        "receptionTime": "1512028712",
        "spreader": "18307306917",
        "status": "20",
        "statusDescription": "已冻结",
        "useLimited": "20000"
      },
      {
        "activityBatchID": "350",
        "bargainLimited": "20000",
        "consumeTime": "",
        "couponDescription": "",
        "couponID": "2f3e7a0369",
        "faceValue": "20000",
        "factivityDescription": "年底促销活动",
        "invalidTime": "1512633898",
        "pID": "1043",
        "receptionTime": "1512029098",
        "spreader": "18307306917",
        "status": "20",
        "statusDescription": "已冻结",
        "useLimited": "20000"
      },
      {
        "activityBatchID": "351",
        "bargainLimited": "20000",
        "consumeTime": "",
        "couponDescription": "",
        "couponID": "e840bbeb24",
        "faceValue": "5000",
        "factivityDescription": "国庆大促销",
        "invalidTime": "1512633965",
        "pID": "1043",
        "receptionTime": "1512029165",
        "spreader": "18307306917",
        "status": "20",
        "statusDescription": "已冻结",
        "useLimited": "20000"
      },
      {
        "activityBatchID": "352",
        "bargainLimited": "20000",
        "consumeTime": "",
        "couponDescription": "",
        "couponID": "000a37cf72",
        "faceValue": "100000",
        "factivityDescription": "测试",
        "invalidTime": "1512636385",
        "pID": "1043",
        "receptionTime": "1512031585",
        "spreader": "18307306917",
        "status": "20",
        "statusDescription": "已冻结",
        "useLimited": "20000"
      },
      {
        "activityBatchID": "353",
        "bargainLimited": "20000",
        "consumeTime": "",
        "couponDescription": "",
        "couponID": "3010968eed",
        "faceValue": "60000",
        "factivityDescription": "测试",
        "invalidTime": "1512636468",
        "pID": "1043",
        "receptionTime": "1512031668",
        "spreader": "18307306917",
        "status": "20",
        "statusDescription": "已冻结",
        "useLimited": "20000"
      },
      {
        "activityBatchID": "354",
        "bargainLimited": "20000",
        "consumeTime": "",
        "couponDescription": "",
        "couponID": "26fc0534dd",
        "faceValue": "30000",
        "factivityDescription": "点点滴滴",
        "invalidTime": "1512637206",
        "pID": "1043",
        "receptionTime": "1512032406",
        "spreader": "18307306917",
        "status": "20",
        "statusDescription": "已冻结",
        "useLimited": "20000"
      }
    ];
      cps = cps.map(item => {
        let timeObj = Utils.formatDate(parseInt(item.invalidTime) * 1000);
        item.deadline = `${timeObj.Y}-${timeObj.M}-${timeObj.D}`;
        item.value = parseInt(item.faceValue) / 1000;
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
      }, err => {});
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
    // }, err => {
    //   console.log(err);
    // });
  },

  setLeft () {
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

  handleToken (e) {
    ctx.setData({
      token: e.detail.value
    })
  },

  addCoupon () {
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
  }
});