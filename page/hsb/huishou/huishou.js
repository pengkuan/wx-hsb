var products = require('../modules/model/products.js');
var that;
Page({
    data : {
        brands  : products.brands,
        catShow1:true,
        catShow2:false,
        index   : 0,
        product : {
            all  : {
                // 0 : { list : [], index : 0 }
            },
            size : 20,
            sync : false,
            bid  : null,
            list : [],
            info : [],
            count : 0,
        },
        search : {
            list  : [],
            sync  : false,
            size : 20,
            // index : [],
            info  : '',
            key   : '',
            all   : {
                // 0 : { list : [], index : 0 }
            },
            count : 0,
        },
        searchInitGod : '',
        focus : false,
        // toggle : 'brand',
        closeSearch : false
    },

    onLoad (options) {
        
        that = this;
        
        this.setData({
            catShow2:that.data.catShow2,
            catShow1:that.data.catShow1,
            cat:0
        });
        if (options.search || options.ooo) {

            this.setData({
                searchInitGod : options.search,
            })

            if (options.ooo) {
                this.searchInit('搜索');

                this.setData({
                    focus : true,
                });

                return false;
            }

            this.searchInit(options.search);
        }

        else {

            this.productInit(options.bid, options.name);
        }

    },
    
    catTap(e){
        var dataset = e.currentTarget.dataset;
        var cat=dataset.cat;
        if(cat==0){
            that.data.catShow2=false;
            that.data.catShow1=true;
        }
        if(cat==1){
            that.data.catShow1=false;
            that.data.catShow2=true;
            wx.setNavigationBarTitle({title: '平板'});
            this.padTap();
        }
        this.setData({
            catShow2:that.data.catShow2,
            catShow1:that.data.catShow1,
            cat:cat
        });
    },

    productTap (e) {
        
        if (this.data.product.sync) {
            return;
        }
        var dataset = e.currentTarget.dataset;
        var data    = this.data.product;
        
        if (dataset.bid == data.bid) {
            return;
        }

        data.list = [];
        this.setData({
                product : data,
        });

        this.productInit(dataset.bid, products.brands[dataset.index].name);
    },

    productInit (bid=11, name='苹果') {

        wx.setNavigationBarTitle({title: name});

        this.setData({
            taggle  : 'product',
            brands  : products.brands
        });

        var data  = this.data.product;
        var product;
        var all = data.all;
        data.bid  = bid;
        data.info = '正在加载更多数据';
        data.sync = false;
        if (bid in all){

            product = all[bid];
            data.list = product.list;
            if (!data.list || data.list.length<data.size) {
                data.info = '没有更多商品了';
            }
            if (data.list.length){
                this.setData({
                    product : data,
                })
                return;
            }
        }

        else {

            product = all[bid] = { index : 0 };
            data.list = product.list = [];
        }
        this.productUpdate();
    },

    productUpdate () {

        var data    = this.data.product;
        var list    = data.list
        var bid     = data.bid;
        var product = data.all[bid];

        if (data.sync || product.index === -1) return;
        data.sync = true;

        var req = products.getList(bid, product.index++, ++data.count, function(items, count){

            if (data.count !== count) return;

            if (!items || items.length < data.size) {

                product.index = -1;
                data.info = '没有更多商品了';
            }

            if (items) list.push.apply(list, items);

            data.sync = false;
            that.setData({product : data});
        });
    },

    padTap(){
        wx.setNavigationBarTitle({title: '热门'});
        var padData=products.pads;
        var pads={
            all  : {},
            size : 20,
            sync : false,
            bid  : null,
            list : padData,
            info : [],
            count : 0
        };
        if (!padData || padData.length<pads.size) {
            pads.info = '没有更多商品了';
        }
        that.setData({product :pads});
    },
    
    searchInit (e) {

        var key = e.detail ? e.detail.value : e;
        var data  = this.data.search;
        data.list = [];

        this.setData({
            taggle : (key || key == '搜索') ? 'search': 'product',
            search : data,
        });



        if (!key) {

            this.setData({ closeSearch : false });

            var index = this.data.index;
            this.data.product.list.length

                ? wx.setNavigationBarTitle({title: products.brands[index].name})
                : this.productInit(products.brands[index].mid, index);
            return;

        }

        if (key && key != "搜索") {

            console.log(key);

            this.setData({ closeSearch : true });
        }

        wx.setNavigationBarTitle({
            title: '搜索 - ' + key
        });

        var search;

        data = this.data.search;
        var all   = data.all;
        data.key  = key;
        data.info = '正在加载更多数据';
        data.sync = false;
        if (key in all){

            search = all[key];
            data.list = search.list;
            if (data.list.length) {

                this.setData({
                    search : data,
                })
                return;
            }
        }

        else {

            search = all[key] = { index : 0 };
            data.list = search.list = [];
        }
        this.searchUpdate();
    },

    searchUpdate () {

        var data    = this.data.search;
        var list    = data.list
        var key     = data.key;
        var search  = data.all[key];
        if (data.sync || search.index === -1) return;

        data.sync = true;

        var req = products.search(key, search.index++, ++data.count, function(items, count) {

            if (data.count !== count) return;

            if (!items || items.length < data.size) {

                search.index = -1;
                data.info = '没有更多商品了';
            }

            if (items) list.push.apply(list, items);

            data.sync = false;
            that.setData({search : data});
        });
    },

    closeSearch () {

        this.setData({searchInitGod : ''});
        this.searchInit('');
    }
})