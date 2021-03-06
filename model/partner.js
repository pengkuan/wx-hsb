import md5 from '../util/md5';
import Utils from '../util/utils';

const icare = {
  /**
   * sid 促销员 id 非必填
   * uid 必填 用户id
   * pid 渠道id 必须
   * order 订单id 必须
   * tel 手机号码 必须
   * product 机型名称 必须
   * productid 机型id 必须
   * pmoney 估价金额 必须（单位分）
   */
  trade (params) {
    params = {
      sid: params.sid ? parseInt(params.sid) : 0,
      uid: params.uid ? parseInt(params.uid) : 0,
      pid: params.pid,
      order: params.orderNum,
      tel: params.tel,
      product: params.productName,
      productid: parseInt(params.productId),
      pmoney: parseInt(params.price) * 100,
      time: parseInt(new Date().getTime() / 1000)
    };
    // 公钥生成规则
    let key = `order=${ params.order }&pmoney=${ params.pmoney }&time=${ params.time }&key=6k$Mu86@AN9`; // 线上的key=6k$Mu86@AN9 测试环境用test
    params.token = md5(key);
    return new Promise((resolve, reject) => {
     Utils.post({
        url: 'https://www.icarephone.com/business/hsb/recover_order',
        data: params,
        success (res) {
          resolve(res)
        },
        fail (err) {
          reject(err);
        }
      })
    })
  }
};

/**
 * 合作伙伴appid映射
 */
const partMap = {
  'wxeb46e3105e6634c5': icare, // icare 用户端
  'wx3b23b2ebeec25313': icare, // icare 促销员端
  '1173': icare
};

const store = {
  appid: '',
  extraData: {},
  pid: ''
};

export default {
  store: store,
  setPartnerInfo ({appid, extraData}) {
    this.store.appid = appid;
    this.store.extraData = extraData;
    this.store.pid = extraData.pid ? extraData.pid : 1196;
  },
  getPartnerApi () {
    return partMap[this.store.pid]
  }
}