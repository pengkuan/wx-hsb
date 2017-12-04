import product from '../../../model/product';
let ctx, app = getApp();

Page({

  data: {
    cateList: [], // 类目列表
    brandList: [], // 品牌列表
    productList: [], // 机型列表
    cid: 1, // 类目id
    bid: -1, // 品牌id
    num: 0,  // 机型分页
    hasMore: true, //是否具有更多
    brandScrollTop: 0,
    productScrollTop: 0,
    left: 0,
    iconSearch: '../../../img/icon-search.svg',
  },

  onLoad() {
    ctx = this;
    product.category().then(category => {
      ctx.setData({
        cateList: category.classlist
      });
    });
  },

  onShow () {
    let cid = app.globalData.cid;
    let bid = app.globalData.bid;
    let cateList = ctx.data.cateList;
    let index = 0;
    for (let i = 0; i < cateList.length; i++) {
      if (cateList[i]['classid'] == cid) {
        index = i;
        break;
      }
    }
    ctx.setData({
      cid,
      bid,
      left: index / cateList.length * 100 + '%'
    });
    ctx.onCidChanged(bid);
  },

  /**
   * category item Change handler
   */
  cateTapHandler(event) {
    let dataSet = event.currentTarget.dataset;
    ctx.setData({
      cid: dataSet.cid,
      left: (dataSet.index / ctx.data.cateList.length * 100 + '%' )
    });
    ctx.onCidChanged();
  },

  /**
   * cid change listener
   * this bid from url
   */
  onCidChanged(bid) {
    product.brands({
      cid: ctx.data.cid
    }).then(brands => {
      ctx.setData({
        brandList: brands.brandlist,
        bid: brands.brandlist[0]['brandid'],
        brandScrollTop: 0
      });
      bid !== undefined && ctx.setData({ bid: bid });
      let num = 1;
      product.products({
        cid: ctx.data.cid,
        bid: ctx.data.bid,
        num: 1
      }).then(products => {
        ctx.setData({
          productList: products.productlist,
          hasMore: num < products.pagenum,
          num,
          productScrollTop: 0
        });
      })
    })
  },

  /**
   * On Brand Change
   * @param event
   */
  brandTapHandler(event) {
    let dataSet = event.currentTarget.dataset;
    ctx.setData({
      bid: dataSet.bid,
    });
    ctx.onBrandIdChanged();
  },

  /**
   * cid change listener
   */
  onBrandIdChanged () {
    let num = 1;
    product.products({
      cid: ctx.data.cid,
      bid: ctx.data.bid,
      num: num
    }).then(products => {
      ctx.setData({
        productList: products.productlist,
        num,
        hasMore: num < products.pagenum,
        productScrollTop: 0
      });
    })
  },

  loadMoreProduct () {
    if(!ctx.data.hasMore) { return }
    let num = ++ctx.data.num;
    product.products({
      cid: ctx.data.cid,
      bid: ctx.data.bid,
      num: num
    }).then(products => {
      let oriProd = ctx.data.productList;
      ctx.setData({
        productList: oriProd.concat(products.productlist),
        hasMore: num < products.pagenum,
        num
      });
    })
  },
});