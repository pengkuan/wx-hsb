let app = getApp();
export const PID = app.globalData.pid;
// 微信授权在回收宝中的授权类型ID
export const WX_AUTH_TYPE = 2;
// 微信小程序的APPID
export const WX_APP_ID = 'wx3543d54ab3d1a24e';
export const host = 'https://www.huishoubao.com/';

// Model
const user = `${host}common/user/`;
const product = `${host}common/product/`;
const order = `${host}common/order/`;
const coupon = `${host}common/coupon/`;
const help = `${host}common/help/`;

// Router
export const url = {

  // 获取微信openid
  wxOpenId: `${user}wx_openid`,
  // 第三方授权登录
  authUserLogin: `${user}authUserLogin`,
  // 绑定手机号并登录
  bindTelLogin: `${user}authUserBindTelLogin`,
  // 获取手机验证码
  getCode: `${user}getCode`,
  // 第三方用户手机号解除绑定(用户已经将手机号和openid绑定起来)
  authUserUnbindTel: `${user}authUserUnbindTel`,

  // 订单分页查询
  orders: `${user}getOrderList`,
  // 订单详情
  order: `${user}getOrderDetails`,
  // 取消订单
  cancelOrder: `${order}cancelOrder`,

  // 优惠券
  coupon,
  // 上门城市
  hsbCity: `${help}hsbCity/`,
  // 获取上门时间
  support_visit_time: `${help}support_visit_time/`,

  // 获取机型分类
  categories: `${product}categories`,
  // 品牌
  brands: `${product}brands`,
  // 机型分页
  products: `${product}products`,
  // 获取选定机型的信息
  product: `${host}api/get_product_param`,
  // 机型搜索
  search: `${product}search/`,
  // 估价
  price: `${host}v2/1196/api/products_evaluate`,
  // 历史价格走势
  priceHistory: `${product}priceHistory/`,
  // 获取顺丰地址
  sfCity: `${order}getSfCity/`,
  // 高速产品查找
};