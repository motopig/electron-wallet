import Common from './Common';

// 交易
export default {

  // 机构 单签钱包列表
  GroupWallet(params = {}) {
    return Common.post('/wmc/getWalletManagement', params);
  },

  // 机构 多签钱包列表
  GroupMulWallet(params = {}) {
    return Common.post('/wmc/getMoreWalletListByProjectId', params);
  },

  // 用户钱包列表
  selfWallet(params = {}) {
    return Common.post('/wmc/getWalletByEmail', params);
  },

  // 其他用户钱包列表
  otherWallet(params = {}) {
    return Common.post('/wmc/getWalletManagementNoSelf', params);
  },

  // 用户钱包列表根据类型
  selfWalletByType(params = {}) {
    return Common.post('/wmc/getWalletByEmailAndType', params);
  },

  // 钱包待处理(待交易)列表
  walletUntradeList(params = {}) {
    return Common.post('/wmc/getWalletChangeRecordUntreated', params);
  },

  // 所有钱包待处理(待交易)列表
  allWalletUntradeList(params = {}) {
    return Common.post('/wmc/getWalletChangeRecordUntreatedAll', params);
  },

  // ETH钱包已交易列表
  walletEthTradeList(params = {}) {
    return Common.post('/wmc/getWalletChangeRecordETH', params);
  },

  // BTC钱包已交易列表
  walletBtcTradeList(params = {}) {
    return Common.post('/wmc/getWalletChangeRecordBTC', params);
  },

  // 钱包资产状况
  walletAsset(params = {}) {
    return Common.post('/wmc/listWalletAsset', params);
  },

  // 所有钱包资产状况
  allWalletAsset(params = {}) {
    return Common.post('/wmc/getToalWalletAssets', params);
  },

  // 后端保存单签钱包接口
  saveWallet(params = {}) {
    return Common.post('/wmc/addWalletManagement', params);
  },

  // 后端保存多签钱包接口
  saveMultWallet(params = {}) {
    return Common.post('/wmc/addMoreWalletManagement', params);
  },

  // 后端保存钱包交易记录接口
  saveTransaction(params = {}) {
    return Common.post('/wmc/addWalletChangeRecord', params);
  },

  // 单签未处理交易 pro处理后请求的更新接口
  updateTransaction(params = {}) {
    return Common.post('/wmc/updateWalletChangeRecordIsDispose', params);
  },

  // 多签转账第一次签名提交接口
  saveMultTransactionFirst(params = {}) {
    return Common.post('/wmc/addMoreWalleTxRecordBTC', params);
  },

  // btc多签转账更新签名提交接口
  updateMultTransaction(params = {}) {
    return Common.post('/wmc/updateMoreWalletRecordBTC', params);
  },

  // eth多签转账更新签名提交接口
  updateEthMultTransaction(params = {}) {
    return Common.post('/wmc/updateMoreWalletRecordETH', params);
  },

  // eth多签转账创建签名提交接口
  addMoreWalletTxRecordETH(params = {}) {
    return Common.post('/wmc/addMoreWalletTxRecordETH', params);
  },

  // 获取多签下单签钱包公钥列表
  allPubKeys(params = {}) {
    return Common.post('/wmc/getMoreWalletPublicKey', params);
  },

  // 获取多签钱包的信息
  getMultWalletInfo(params = {}) {
    return Common.post('/wmc/getMoreWalletSignedAll', params);
  },

  // 更新钱包别名
  updateWallet(params = {}) {
    return Common.post('/wmc/updateWalletManagement', params);
  },

  // token交易列表
  getWalletTxByAddress(params = {}) {
    return Common.post('/wmc/getWalletTxByAddress', params);
  },

  // 交易记录详情
  getWalletTxByHashOrId(params = {}) {
    return Common.post('/wmc/getWalletTxByHashOrId', params);
  },
};
