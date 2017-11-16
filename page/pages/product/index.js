import Utils from '../../../util/utils';
import product from '../../../model/product';

let ctx, app = getApp();

Page({

  data: {
    base: [],
    func: [],
    selects: {},
    funcMap: {},
    product: {},
    pInfo: {},
    baseStore: [],
    cdn: app.globalData.cdn,
    baseSelect: [],
    funcSelect: [],
    len: 0,
    toView: 'view0',
    pics: [{
      picturename: '国行.JPG'
    }],
    alertInfo: {
      title: '',
      desc: '',
      pictureUrl: ''
    }
  },

  onLoad(params) {
    Utils.setWhiteNavBar();
    ctx = this;
    product.productInfo({
      productId: params.productId
    }).then(res => {
      let item = res.itemList;
      let base = [], func = [], type;
      item.forEach((item) => {
        type = parseInt(item.conftype);
        if (type === 1 || type === 2) {
          base.push(item)
        } else if (type === 3) {
          func.push(item);
        }
      });
      this.setValues(base, 'base');
      this.setValues(func, 'func');
      func = ctx.funcHandler(func);
      ctx.setData({
        base,
        func,
        pInfo: {
          picUrl: res.picurl,
          classId: res.classid,
          productId: res.itemid,
          maxPrice: res.maxprice,
          productName: res.productname,
          standardPrice: res.standardprice
        }
      });
    })
  },

  /**
   * 生成功能选项对应的数据结构
   * 功能选项本质是一个具有默认值和可选值的单选框
   * @param {*} list
   */
  funcHandler(list) {
    let func = [];
    list.map((item) => {
      let kid = item.id, did, oid, desc, picture, otext, dtext, ptext = item.name;
      let ques = item.question;
      ques.map(q => {
        if (q.show == 0) {
          did = q.id;
          dtext = q.name;
        } else {
          oid = q.id;
          desc = q.name;
          picture = q.picture;
          otext = q.name;
        }
      });
      func.push({kid, did, oid, desc, picture, otext, dtext, ptext})
    });
    return func;
  },

  /**
   * 基本选项 外观选项 切换
   * @param {*} e
   */
  baseTapHandler(e) {
    let dataset = e.currentTarget.dataset;
    let baseSelect = ctx.data.baseSelect;
    console.log(dataset);
    if(dataset.pid === "81" && dataset.cid === "82") {
      wx.showModal({
        title: '提示',
        content: '暂不回收未解锁机型',
        showCancel: false
      })
      return;
    }
    for (let i = 0; i < baseSelect.length; i++) {
      if (baseSelect[i]['pid'] === dataset.pid) {
        baseSelect[i]['cid'] = dataset.cid;
        baseSelect[i]['ctext'] = dataset.cname;
      }
    }
    ctx.setData({
      baseSelect,
    });
    ctx.onSelectsChanged(true);
  },

  setValues(data, type = 'base') {
    let select = [];
    data.map((item) => {
      let temp = {};
      temp['pid'] = item.id;
      temp['ptext'] = item.name;
      temp['cid'] = "";
      temp['ctext'] = "";
      if (item.conftype == 3) {
        item.question.map((ques) => {
          if (ques['show'] == 0) {
            temp['cid'] = ques.id;
            temp['ctext'] = ques.name;
          }
        })
      }
      select.push(temp);
    });
    if (type === 'base') 
      ctx.setData({
        baseSelect: select
      });
    if (type === 'func') 
      ctx.setData({
        funcSelect: select
      });
    ctx.onSelectsChanged();
  },

  /**
   * 功能选项切换
   * @param {*} e
   */
  funcTapHandler(e) {
    let dataset = e.currentTarget.dataset;
    let funcSelect = ctx.data.funcSelect;
    console.log(dataset);
    for (let i = 0; i < funcSelect.length; i++) {
      if (funcSelect[i]['pid'] == dataset.kid) {
        let flag = funcSelect[i]['cid'];
        if (flag == dataset.oid) {
          funcSelect[i]['cid'] = dataset.did;
          funcSelect[i]['ctext'] = dataset.dtext;
        } else {
          funcSelect[i]['cid'] = dataset.oid;
          funcSelect[i]['ctext'] = dataset.otext;
        }
      }
    }
    ctx.setData({
      funcSelect
    });
    ctx.onSelectsChanged();
  },

  /**
   * 监听 selects 做一些猥琐的操作
   * 改变进度条 限制一些选项等等...
   */
  onSelectsChanged(setView) {
    let len = 0,
    base = ctx.data.base,
    baseSelect = ctx.data.baseSelect
    for (let i = 0; i < baseSelect.length; i++) {
      if (baseSelect[i]['cid'].length) len++;
    }
    if(setView) {
      let toView = len === base.length ? `view${len + 1}` : `view${len}`;
      ctx.setData({
        len,
        toView
      })
    } else {
     ctx.setData({
        len
      })
    }
  },

  /**
   * 估价
   */
  onSubmit() {
    let pInfo = ctx.data.pInfo;
    let bs = ctx.data.baseSelect;
    let fs = ctx.data.funcSelect;
    let arr = bs.concat(fs);
    let ids = arr.map(item => item.cid);
    let desc = arr.map(item => item.ctext);
    product.evaluate({
      productId: ctx.data.pInfo.productId,
      selects: ids.join('-')
    }).then(data => {
      wx.navigateTo({
        url: `../price/index?price=${data.quotation}&ids=${ids.join('-')}&desc=${desc.join('-')}&productId=${pInfo.productId}&productName=${pInfo.productName}&classId=${pInfo.classId}`
      })
    }, res => {
      console.log(res);
    })
  },

  showPictures(e) {
    let dataSet = e.currentTarget.dataset;
    let base = ctx.data.base;
    let item = base[dataSet.iindex];
    let q = item['question'][dataSet.qindex];
    let title = `${item.name}`;
    let pictureUrl = q['picture'][0]['picturename'];
    let desc = q.name;
    ctx.setData({
      alertInfo: {
        desc,
        title,
        pictureUrl
      }
    })
  },

  showFunPictures(e) {
    let dataSet = e.currentTarget.dataset;
    ctx.setData({
      alertInfo: {
        desc: dataSet.desc,
        title: dataSet.title,
        pictureUrl: dataSet.img
      }
    })
  },

  closeAlert() {
    ctx.setData({
      alertInfo: {}
    })
  }
});