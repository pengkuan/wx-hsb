import product from '../../../model/product';
import index from "../../../config/index";
let ctx;

Page({
  data: {
    base: [],
    func: [],
    selects: {},
    funcMap: {},
    product: {}
  },
  onLoad(params) {
    ctx = this;
    params = { productId: 38200 };
    product.productInfo({
      productId: params.productId
    }).then(res => {
      let item = res.itemList;
      let base = [], outlook = [], func = [], type;
      this.setInitValue(res.itemList);
      item.forEach((item, index) => {
        type = parseInt(item.conftype);
        if (type === 1) {
          base.push(item)
        } else if (type === 2) {
          outlook.push(item)
        } else if (type === 3) {
          func.push(item);
        }
      });
      func = ctx.funcHandler(func);
      ctx.setData({ 
        base,
        outlook, 
        func,
        product: {
          picUrl: res.picurl,
          classId: res.classid,
          productId: res.itemid,
          maxPrice: res.maxprice,
          productName: res.productname,
          standardPrice: res.standardprice
        }
      });
      console.log(ctx.data.product);
    })
  },

  /**
   * 生成功能选项对应的数据结构
   * 功能选项本质是一个具有默认值和可选值的单选框
   * @param {*} data 
   */
  funcHandler(list) {
    let func = [];
    list.map((item) => {
      let kid = item.id, did, oid, desc, picture;
      let ques = item.question;
      ques.map((q, qindex) => {
        if (q.show == 0) {
          did = q.id;
        } else {
          oid = q.id;
          desc = q.name;
          picture = q.picture;
        }
      })
      func.push({ kid, did, oid, desc, picture})
    });
    return func
  },

  /**
   * 基本选项 外观选项 切换
   * @param {*} event 
   */
  baseTapHandler (event) {
    let selects = ctx.data.selects;
    let dataset = event.currentTarget.dataset;
    selects[dataset.pid] = dataset.cid;
    ctx.setData({ selects });
    ctx.onSelectsChanged();
  },

  /**
   * 设置初始默认值 功能选项有key和value 非功能选项只有key
   * @param {*} list 
   */
  setInitValue (list) {
    let initData = {}, funcItem;
    list.map((item, index) => {
      if (item.conftype != 3) {
        initData[item.id] = ""
      } else {
        funcItem = item.question;
        funcItem.map((ques, qindex) => {
          if (ques['show'] == 0) {
            initData[item.id] = ques.id;
          }
        })
      }
    })
    ctx.setData({ selects: initData});
    ctx.onSelectsChanged();
  },

  /**
   * 功能选项切换
   * @param {*} event 
   */
  funcTapHandler (event) {
    let dataset = event.currentTarget.dataset;
    let selects = ctx.data.selects;
    if (selects[dataset.kid] == dataset.did) {
      selects[dataset.kid] = dataset.oid
    } else {
      selects[dataset.kid] = dataset.did;
    }
    ctx.setData({ selects });
    ctx.onSelectsChanged();
  },

  /**
   * 监听 selects 做一些猥琐的操作
   * 改变进度条 限制一些选项等等...
   */
  onSelectsChanged () {
    console.log(ctx.data.selects);
  },

  /**
   * 估价
   */
  onSubmit () {
    product.evaluate({
      productId: ctx.data.product.productId,
      selects: Object.values(ctx.data.selects).join('-')
    }).then(res => {
      console.log(res)
    }, res => {
      console.log(res);
    })
  }
});