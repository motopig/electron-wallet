<template>
  <div class="wallet-trade-transferpwd">
    <Header
        headerTitle="输入支付密码"
        :backward=back
    ></Header>
    <div class="wallet-trade-transferpwd-list">
      <div class="wallet-trade-transferpwd-items">
        <div class="list-title-content">
          <div class="list-title">当前钱包支付密码</div>
          <div class="list-sub-title">
            <input v-model="pwd" type="password" placeholder="请输入支付密码">
          </div>
        </div>
      </div>
    </div>
    <PwdInfoTwo></PwdInfoTwo>
    <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
    <v-list class="transfer-btn">
      <button class="up-btn" :disabled="isLoading" @click="toNext">提交</button>
    </v-list>
  </div>
</template>

<script>
  import Store from 'electron-store';
  import bitcoin from 'bitcoinjs-lib';
  import sto2btc from 'satoshi-bitcoin';
  import Header from '@/common/Header';
  import Base from '@/config/base';
  import Common from '@/api/Common';
  import Wallet from '@/api/Wallet';
  import Coin from '@/config/coin';
  import Dict from '@/config/dict';
  import Des from '@/libs/des';
  import PwdInfoTwo from '../../../components/PwdInfoTwo';

  export default {
    components: {
      Header,
      PwdInfoTwo,
    },
    data() {
      return {
        pwd: '',
        address: '',
        to: '',
        amount: 0,
        remark: '',
        fee: 0,
        coin: '',
        privateKey: '',
        isLoading: true,
        txId: '',
        back: '',
        balance: 0,
        first: false,
        pendingId: 0,
        singleAddress: '',
        multWallet: null,
        rawData: '',
        pubKeys: [],
        fellow: '',
        isLast: false,
        isapply: false,
        btcBalance: 0,
        usdtBalance: 0,
      };
    },
    methods: {
      async toNext() {
        const store = new Store();
        const walletListKey = `${Base.walletList}_${this.$store.state.user.id}_USDT`;
        const walletList = store.get(walletListKey);
        let from = null;
        this.multWallet.ownerAddressList.forEach((item) => {
          this.fellow += `${item},`;
          if (walletList[item]) {
            from = walletList[item];
            this.singleAddress = item;
          }
        });
        if (!from) {
          this.singleAddress = this.multWallet.creatorAddress;
          from = walletList[this.singleAddress];
        }
        this.fellow = this.fellow.substring(0, (this.fellow.length - 1));
        this.isLoading = true;
        this.privateKey = Des.decrypt(from.address0.privateKey, this.pwd);
        if (this.privateKey === '') {
          this.isLoading = false;
          this.notify('钱包密码不正确');
        } else {
          // console.log(this.privateKey);
          const unspentUrl = `${Coin.usdt.main.unspentUrl}${this.address}/utxo/`;
          this.unspents = await Common.fetch(unspentUrl, {})
            .then(this.unspentRet)
            .catch(this.unspentErr);
          this.unspentSuc(this.unspents);
        }
      },
      unspentRet(res) {
        return res;
      },
      padding(number, length, prefix) {
        if (String(number).length >= length) {
          return String(number);
        }
        return this.padding(prefix + number, length, prefix);
      },
      unspentSuc(res) {
        const fundValue = 546; // dust
        const feeValue = sto2btc.toSatoshi(this.fee);
        // 获取当前参与多签的单签钱包账户权限
        const boss = bitcoin.ECPair.fromWIF(this.privateKey, bitcoin.networks.bitcoin);
        let txb = null;
        if (this.first === false) {
          let tx = null;
          const mulTx = JSON.parse(this.$store.state.tx.transfer);
          // console.log(mulTx);
          // 多签转账后续更新签名 先将之前tx信息注入
          tx = bitcoin.Transaction.fromHex(mulTx.btcSignatures);
          txb = bitcoin.TransactionBuilder.fromTransaction(tx, bitcoin.networks.bitcoin);
          // 自己钱包参与签名
          txb.__inputs.forEach((item, i) => {
            txb.sign(i, boss, item.redeemScript);
          });
          // rebuild所有钱包签名信息
          const txNew = txb.build();
          this.rawData = txNew.toHex();
          console.log(this.rawData);
          this.txId = txNew.getId();
          // 多签转账后续更新签名 如果是最后一次签名 直接广播交易
          if (this.isLast === true) {
            this.publish();
          } else {
            this.updateBackend();
          }
        } else {
          // 多签转账第一次签名
          // console.log(boss);
          const publickeys = this.pubKeys.map(this.filter);
          const p2ms = bitcoin.payments.p2ms({
            m: this.multWallet.passNum,
            pubkeys: publickeys,
            network: bitcoin.networks.bitcoin,
          });
          const p2sh = bitcoin.payments.p2sh({ redeem: p2ms });
          // 创建新的transaction
          txb = new bitcoin.TransactionBuilder(bitcoin.networks.bitcoin);
          // 多签钱包未花费是否为空
          if (this.btcBalance === null) {
            this.notify('获取钱包btc余额异常!');
          } else if (this.btcBalance < feeValue + fundValue) {
            this.notify('btc余额不足');
          } else if (res.length) {
            // transaction 中增加未花费input
            res.forEach((item) => {
              txb.addInput(item.txid, item.vout, 0xfffffffe);
            });
            const amountHex = this.padding((this.amount * 100000000).toString(16), 16, 0);
            const simpleSend = [
              '6f6d6e69', // omni
              '0000', // version
              '00000000001f', // 31 for Tether
              amountHex, // amount = this.amount * 100 000 000 in HEX
            ].join('');
            const data = [Buffer.from(simpleSend, 'hex')];
            const omniOutput = bitcoin.payments.embed({ data }).output;
            // transaction 中增加转账地址和转账数量
            txb.addOutput(this.to, fundValue);
            txb.addOutput(omniOutput, 0);
            // remain = unspent balance - transfer amount - transfer fee
            const remain = this.btcBalance - fundValue - feeValue;
            if (remain > 0) {
              // 如果转账之后有剩余 加入最后的未花费列表
              txb.addOutput(this.address, remain);
            }
            // 第一次钱包签名
            res.forEach((item, i) => {
              txb.sign(i, boss, p2sh.redeem.output);
            });
            console.log(txb);
            const tx = txb.build();
            this.rawData = tx.toHex();
            console.log(this.rawData);
            this.txId = tx.getId();
            // pro 自己转账需要调用create接口
            // 将第一次签名 rawData push 给后端， 从而通知其他单签账户参与签名
            if (this.isapply === false && this.first === true) {
              this.createBackend();
            } else {
              // 如果是申请过来的第一次转账 调用更新接口
              this.updateBackend();
            }
          }
        }
      },
      filter(x) {
        return Buffer.from(x, 'hex');
      },
      unspentErr() {
        this.isLoading = false;
        this.notify('余额为0');
      },
      getBalance() {
        const opt = {
          url: `${Coin.usdt.main.balanceUrl}`,
          form: {
            addr: this.address,
          },
        };
        Common.dataRequest(opt, this.balanceCallback);
      },
      balanceCallback(err, res) {
        res.balance.forEach((item) => {
          if (err !== null) {
            this.usdtBalance = null;
            this.btcBalance = null;
          } else if (item.id === '31') { // usdt propertyid == 31 , btc propertyid == 0
            this.usdtBalance = item.value / 100000000;
          } else if (item.id === '0') {
            this.btcBalance = item.value;
          }
        });
        this.isLoading = false;
      },
      publish() {
        Common.submit(Coin.usdt.main.publishUrl, {
          rawtx: this.rawData,
        }).then(this.pubSuc).catch(this.pubErr);
      },
      updateBackend() {
        Wallet.updateMultTransaction({
          id: this.pendingId,
          walletAddress: this.singleAddress,
          isDispose: 2,
          transferAddress: this.address,
          btcSignatures: this.rawData,
          poundage: this.fee,
          remark: this.remark,
        }).then(this.transSuc).catch(this.transErr);
      },
      createBackend() {
        Wallet.saveMultTransactionFirst({
          userId: this.$store.state.user.id,
          walletId: 0,
          userEmail: this.$store.state.user.email,
          transferAddress: this.address,
          otherAddress: this.to,
          walletType: 2, // 1 单签 2 多签
          status: 1, // 1 正常 2 失效
          isDispose: 2, // 1 未处理 2 待处理 3 已处理
          currentType: Dict.coin[this.coin],
          amount: this.amount,
          itemId: 0,
          projectId: 0,
          isAddressList: `[${this.singleAddress}]`,
          noAddressList: `[${this.fellow}]`,
          txHash: this.txId,
          poundage: this.fee,
          operaType: 2, // 1 转入 2 转出
          remark: this.remark,
          blockNumber: '',
          btcSignatures: this.rawData,
          refusedAddressList: '',
          txSource: 1, // 交易来源 1.钱包参与者，2.其他
          currencyName: 'USDT',
        }).then(this.transSuc).catch(this.transErr);
      },
      transSuc(res) {
        // 清空 store transfer 数据
        this.$store.dispatch('transfer', JSON.stringify({}));
        let url = '';
        if (this.isLast === true) {
          this.notify('转账已提交!');
          url = `/wallet/btc/single/tx/${res.data.id}?coin=${this.coin}`;
        } else {
          this.notify('签名成功，等待其他钱包签名!');
          url = '/wallet';
        }
        this.isLoading = false;
        setTimeout(() => {
          this.$router.push(url);
        }, 2000);
      },
      transErr() {
        this.notify('转账记录状态更新失败');
      },
      pubSuc(res) {
        // 交易广播之后 更新后端交易数据状态
        if (res.pushed === 'success') {
          this.updateBackend();
        } else {
          this.pubErr();
        }
      },
      pubErr() {
        this.notify('转账上链失败');
      },
      notify(res) {
        this.$toast(res, {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
      },
      fetchPubkeys() {
        Wallet.allPubKeys({
          walletAddress: this.address,
        }).then(this.fetchSuc).catch(this.fetchErr);
      },
      fetchSuc(res) {
        res.data.forEach((item) => {
          this.pubKeys.push(item.publicKey);
        });
        this.isLoading = false;
      },
      fetchErr() {
      },
      fetchMultWalletInfo() {
        Wallet.getMultWalletInfo({
          walletAddress: this.address,
        }).then(this.fetchMultSuc).catch(this.fetchMultErr);
      },
      fetchMultSuc(res) {
        this.multWallet = res.data;
      },
      fetchMultErr() {
      },
    },
    mounted() {
      this.address = this.$route.query.address;
      this.to = this.$route.query.to;
      this.amount = this.$route.query.amount;
      this.remark = this.$route.query.remark;
      this.fee = this.$route.query.fee;
      this.coin = this.$route.query.coin;
      this.type = this.$route.query.type;
      if (this.$route.query.first === 'true') {
        this.first = true;
      }
      if (this.$route.query.isapply === 'true') {
        this.isapply = true;
      }
      this.pendingId = this.$route.query.pendingId;
      if (this.first === true) {
        this.fetchPubkeys();
      } else {
        // check is last sign 只有续签才会有transfer存储，续签签名来自pending页面触发
        const mulTx = JSON.parse(this.$store.state.tx.transfer);
        const unSignArray = mulTx.noAddressList.substring(1, (mulTx.noAddressList - 1)).split(',');
        const SignArray = mulTx.isAddressList.substring(1, (mulTx.isAddressList - 1)).split(',');
        if (unSignArray.length === 1 || (SignArray.length + 1 === mulTx.passNum)) {
          this.isLast = true;
        } else {
          this.isLast = false;
        }
      }
      this.back = `/wallet/transfermul/usdt?address=${this.address}&coin=${this.coin}&to=${this.to}&amount=${this.amount}&first=${this.first}&isapply=${this.isapply}&pendingId=${this.pendingId}&fee=${this.fee}`;
      this.fetchMultWalletInfo();
      this.getBalance();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-trade-transferpwd {
    .wallet-trade-transferpwd-list {
      margin-top: 45px;
      padding: 0 30px;
      .wallet-trade-transferpwd-items {
        height: 120px;
        .list-title-content {
          padding: 0 30px;
          border-bottom: 1px solid @borderBottomColor;
          height: 120px;
          .list-title {
            padding-top: 15px;
            height: 75px;
            line-height: 60px;
            font-size: @fontSizeFive;
            color: @darkColor;
          }
          .list-sub-title {
            height: 45px;
            line-height: 45px;
            font-size: @fontSizeEight;
            color: @greyColor;
          }
        }
      }
    }
    .transfer-btn {
      padding: 60px 30px 30px 30px;
      .up-btn {
        height: 70px;
        width: 100%;
        background: @warningColor;
        color: #FFF;
        border-radius: 35px;
        font-size: @fontSizeFive;
      }
    }
  }
</style>
