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
  import PwdInfoTwo from '../../../components/PwdInfoTwo';
  import Base from '../../../../../config/base';
  import Common from '../../../../../api/Common';
  import Wallet from '../../../../../api/Wallet';
  import Coin from '../../../../../config/coin';
  import Dict from '../../../../../config/dict';
  import Des from '../../../../../libs/des';

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
        rawData: '',
        unspents: null,
        btcBalance: 0,
        usdtBalance: 0,
      };
    },
    methods: {
      async toNext() {
        const store = new Store();
        const walletListKey = `${Base.walletList}_${this.$store.state.user.id}_USDT`;
        const walletList = store.get(walletListKey);
        const from = walletList[this.address];
        this.isLoading = true;
        this.privateKey = Des.decrypt(from.address0.privateKey, this.pwd);
        if (this.privateKey === '') {
          this.isLoading = false;
          this.notify('钱包密码不正确');
        } else {
          console.log(this.privateKey);
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
        const txb = new bitcoin.TransactionBuilder(bitcoin.networks.bitcoin);
        const boss = bitcoin.ECPair.fromWIF(this.privateKey, bitcoin.networks.bitcoin);
        if (this.btcBalance === null) {
          this.notify('获取钱包btc余额异常!');
        } else if (this.btcBalance < feeValue + fundValue) {
          this.notify('btc余额不足');
        } else if (res.length) {
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
          txb.addOutput(this.to, fundValue);
          txb.addOutput(omniOutput, 0);
          // remain = unspent balance - transfer amount - transfer fee
          const remain = this.btcBalance - fundValue - feeValue;
          if (remain > 0) {
            txb.addOutput(this.address, remain);
          }
          res.forEach((item, i) => {
            txb.sign(i, boss);
          });
          const tx = txb.build();
          console.log(tx);
          this.rawData = tx.toHex();
          this.txId = tx.getId();
          // broadcasting transaction to usdt network
          console.log(this.rawData);
          this.publish();
        }
        this.isLoading = false;
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
        Common.pushx(Coin.usdt.main.publishUrl, {
          signedTransaction: this.rawData,
        }).then(this.pubSuc).catch(this.pubErr);
      },
      pubSuc(res) {
        if (res.pushed === 'success') {
          this.notify('转账完成,等待网络确认');
          // save transaction to backend
          Wallet.saveTransaction({
            userId: this.$store.state.user.id,
            walletId: 0,
            userEmail: this.$store.state.user.email,
            transferAddress: this.address,
            otherAddress: this.to,
            walletType: 1, // 1 单签 2 多签
            status: 1, // 1 正常 2 失效
            isDispose: 3, // 1 未处理 2 待处理 3 已处理
            currentType: Dict.coin[this.coin],
            amount: this.amount,
            itemId: 0,
            projectId: 0,
            isAddressList: '[]',
            noAddressList: '[]',
            txHash: this.txId,
            poundage: this.fee,
            operaType: 2, // 1 转入 2 转出
            remark: this.remark,
            blockNumber: '',
            btcSignatures: '',
            currencyName: 'USDT',
          }).then(this.transSuc).catch(this.transErr);
        } else {
          this.notify('转账上链失败');
        }
      },
      transSuc(res) {
        this.$router.push(`/wallet/btc/single/tx/${res.data.id}?coin=${this.coin}`);
      },
      transErr() {
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
    },
    mounted() {
      this.address = this.$route.query.address;
      this.to = this.$route.query.to;
      this.amount = this.$route.query.amount;
      this.remark = this.$route.query.remark;
      this.fee = this.$route.query.fee;
      this.coin = this.$route.query.coin;
      this.type = this.$route.query.type;
      this.back = `/wallet/transfer/?address=${this.address}&amount=${this.amount}&coin=${this.coin}&type=${this.type}&to=${this.to}`;
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
