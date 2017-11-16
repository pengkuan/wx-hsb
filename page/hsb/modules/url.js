var baseUrl  = 'https://www.huishoubao.com/v2/1196/api/';
// var baseUrl  = 'https://www.huishoubao.com/v2/1196/api/';
var baseUrl_v2 = 'https://gaox.www.huishoubao.com/api/';

var exports = module.exports = {
    orderList    : baseUrl  + 'getOrdreList_6/',
    brands       : baseUrl  + 'brands',
    productsList : baseUrl  + 'products20/',
    search       : baseUrl  + 'products_search/',
    options      : baseUrl  + 'products_options/',
    evaluate     : baseUrl  + 'products_evaluate/',
    getOrder     : baseUrl  + 'appletPlaceOrder/',
    orderDetails : baseUrl  + 'getOrderDetails/',
    // wxLogin      : baseUrl  + 'wxappLogin/',
    wxLogin      : baseUrl  + 'wxAppLogin2/',
    sfInService  : baseUrl + 'InService',
    sfOrder      : baseUrl + 'reservationSFOrder/',
    city         : baseUrl  + 'city_list/',
    area         : baseUrl  + 'GetRegionConfig/',
    visitDate    : baseUrl  + 'visitDate',
    location     : baseUrl  + 'baidu',
    hotList      : baseUrl  + 'hot6',
    visitTime    : baseUrl  + 'get_visit_appoint_info',
    getSelectOption : baseUrl_v2 + 'get_product_param',
    padList: baseUrl + 'getProductsByItemID'
}