
import Wallet from '@/pages/wallet/Wallet';
import AllAsset from '@/pages/wallet/AllAsset';
import Transfer from '@/pages/wallet/trade/Transfer';
import SingleBtcTransferPwd from '@/pages/wallet/trade/single/btc/TransferPwd';
import SingleEthTransferPwd from '@/pages/wallet/trade/single/eth/TransferPwd';
import SingleUsdtTransferPwd from '@/pages/wallet/trade/single/usdt/TransferPwd';
import Receive from '@/pages/wallet/trade/Receive';
import AllPending from '@/pages/wallet/AllPending';
import Create from '@/pages/wallet/create/Create';
import SingleCreate from '@/pages/wallet/create/single/SingleCreate';
import BtcMultipleCreate from '@/pages/wallet/create/multiple/btc/MultipleCreate';
import EthMultipleCreate from '@/pages/wallet/create/multiple/eth/MultipleCreate';
import UsdtMultipleCreate from '@/pages/wallet/create/multiple/usdt/MultipleCreate';
import EthMultipleSetting from '@/pages/wallet/create/multiple/eth/Setting';
import ChangePwd from '@/pages/wallet/Changepwd';
import Info from '@/pages/wallet/Info';
import Record from '@/pages/wallet/export/Record';
import Remember from '@/pages/wallet/export/Remember';
import BtcSingleTx from '@/pages/wallet/trade/tx/single/btc/Tx';
import EthSingleTx from '@/pages/wallet/trade/tx/single/eth/Tx';
import ConfirmPwd from '@/pages/wallet/export/PwdConfirm';
import PrivateKey from '@/pages/wallet/export/PrivateKey';
import BtcMultipleTx from '@/pages/wallet/trade/multiple/btc/Transfer';
import EthMultipleTx from '@/pages/wallet/trade/multiple/eth/Transfer';
import UsdtMultipleTx from '@/pages/wallet/trade/multiple/usdt/Transfer';
import EthMultipleTxPwd from '@/pages/wallet/trade/multiple/eth/TransferPwd';
import BtcMultipleTxPwd from '@/pages/wallet/trade/multiple/btc/TransferPwd';
import UsdtMultipleTxPwd from '@/pages/wallet/trade/multiple/usdt/TransferPwd';
import DetailList from '@/pages/wallet/components/DetailList';

export default [
  {
    path: '/',
    component: Wallet,
  }, {
    // 所有资产
    path: '/wallet/allasset',
    name: 'allasset',
    component: AllAsset,
  }, {
    // 转账
    path: '/wallet/transfer',
    name: 'transfer',
    component: Transfer,
  }, {
    // 是token的交易列表页面
    path: '/wallet/trade/list/:coin/:address',
    name: 'tradelist',
    component: DetailList,
  }, {
    // btc单签转账输入密码
    path: '/wallet/transfer/pwd/btc',
    name: 'transfer-pwd-btc',
    component: SingleBtcTransferPwd,
  }, {
    // eth单签转账输入密码
    path: '/wallet/transfer/pwd/eth',
    name: 'transfer-pwd-eth',
    component: SingleEthTransferPwd,
  }, {
    // usdt单签转账输入密码
    path: '/wallet/transfer/pwd/usdt',
    name: 'transfer-pwd-usdt',
    component: SingleUsdtTransferPwd,
  }, {
    // 单签收款
    path: '/wallet/receive',
    name: 'receive',
    component: Receive,
  }, {
    // 多签收款
    path: '/wallet/receivemul',
    name: 'receive',
    component: Receive,
  }, {
    // 所有未处理消息
    path: '/wallet/allpending',
    name: 'allpending',
    component: AllPending,
  }, {
    // 创建钱包
    path: '/wallet/create',
    name: 'walletcreate',
    component: Create,
  }, {
    // 创建btc/eth单签钱包
    path: '/wallet/singlecreate',
    name: 'singlecreate',
    component: SingleCreate,
  }, {
    // 创建btc多签钱包
    path: '/wallet/btc/multiplecreate',
    name: 'btcmultiplecreate',
    component: BtcMultipleCreate,
  }, {
    // 创建eth多签钱包
    path: '/wallet/eth/multiplecreate',
    name: 'ethmultiplecreate',
    component: EthMultipleCreate,
  }, {
    // 创建usdt多签钱包
    path: '/wallet/usdt/multiplecreate',
    name: 'usdtmultiplecreate',
    component: UsdtMultipleCreate,
  }, {
    // eth多签钱包设置
    path: '/wallet/eth/multiplesetting',
    name: 'ethmultiplesetting',
    component: EthMultipleSetting,
  }, {
    // btc单签交易记录查看
    path: '/wallet/btc/single/tx/:txid',
    name: 'btcsingletx',
    component: BtcSingleTx,
  }, {
    // btc eth 单签钱包信息管理
    path: '/wallet/info/:coin/:address',
    name: 'walletinfo',
    component: Info,
  }, {
    // btc 单签钱包备份助记词前确认钱包密码
    path: '/wallet/backsingle/confirmpwd/:coin/:address',
    name: 'confirmpwd',
    component: ConfirmPwd,
  }, {
    // btc 单签钱包备份助记词
    path: '/wallet/backsingle/record/:coin/:address',
    name: 'backsinglerecordbtc',
    component: Record,
  }, {
    // btc 单签钱包备份助记词
    path: '/wallet/backsingle/remember',
    name: 'backsinglerememberbtc',
    component: Remember,
  }, {
    // btc 单签钱包备份私钥
    path: '/wallet/backsingle/private/:coin/:address',
    name: 'backsingleprivatebtc',
    component: PrivateKey,
  }, {
    // 创建btc多签交易
    path: '/wallet/transfermul/btc',
    name: 'btcmultipletxcreate',
    component: BtcMultipleTx,
  }, {
    // 创建btc多签交易确认密码
    path: '/wallet/transfermul/btc/pwd',
    name: 'btcmultipletxcreatepwd',
    component: BtcMultipleTxPwd,
  }, {
    // 创建eth多签交易
    path: '/wallet/transfermul/eth',
    name: 'ethmultipletxcreate',
    component: EthMultipleTx,
  }, {
    // 创建eth多签交易
    path: '/wallet/transfermul/eth/pwd',
    name: 'ethmultipletxcreatepwd',
    component: EthMultipleTxPwd,
  }, {
    // 创建usdt多签交易
    path: '/wallet/transfermul/usdt',
    name: 'usdtmultipletxcreate',
    component: UsdtMultipleTx,
  }, {
    // 创建usdt多签交易确认密码
    path: '/wallet/transfermul/usdt/pwd',
    name: 'usdtmultipletxcreatepwd',
    component: UsdtMultipleTxPwd,
  }, {
    // eth交易记录查看
    path: '/wallet/eth/single/tx/:txid',
    name: 'ethsingletx',
    component: EthSingleTx,
  }, {
    // 修改钱包密码
    path: '/wallet/changepwd',
    name: 'changepwd',
    component: ChangePwd,
  },
];
