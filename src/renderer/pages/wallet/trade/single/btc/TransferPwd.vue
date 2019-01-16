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
      };
    },
    methods: {
      toNext() {
        const store = new Store();
        const walletListKey = `${Base.walletList}_${this.$store.state.user.id}_BTC`;
        const walletList = store.get(walletListKey);
        const from = walletList[this.address];
        this.isLoading = true;
        this.privateKey = Des.decrypt(from.address0.privateKey, this.pwd);
        if (this.privateKey === '') {
          this.isLoading = false;
          this.notify('钱包密码不正确');
        } else {
          // console.log(this.privateKey);
          // fetch unspent
          const unspentUrl = `${Coin.btc.main.unspentUrl}${this.address}`;
          Common.fetch(unspentUrl, {}).then(this.unspentSuc).catch(this.unspentErr);
        }
      },
      btcSto(btc) {
        return btc * 100000000;
      },
      unspentSuc(res) {
        const stoAmount = sto2btc.toSatoshi(this.amount);
        const txb = new bitcoin.TransactionBuilder(bitcoin.networks.bitcoin);
        const boss = bitcoin.ECPair.fromWIF(this.privateKey, bitcoin.networks.bitcoin);
        txb.setVersion(1);
        if (res.unspent_outputs.length) {
          res.unspent_outputs.forEach((item) => {
            txb.addInput(item.tx_hash_big_endian, item.tx_output_n);
          });
          if (this.remark) {
            const data = Buffer.from(this.remark, 'utf8');
            const embed = bitcoin.payments.embed({ data: [data] });
            txb.addOutput(embed.output, 0);
          }
          txb.addOutput(this.to, stoAmount);
          // remain = unspent balance - transfer amount - transfer fee
          const remain = this.balance - stoAmount - sto2btc.toSatoshi(this.fee);
          if (remain > 0) {
            txb.addOutput(this.address, remain);
          }
          res.unspent_outputs.forEach((item, i) => {
            txb.sign(i, boss);
          });
          const tx = txb.build();
          // console.log(tx);
          this.rawData = tx.toHex();
          this.txId = tx.getId();
          // broadcasting transaction to btc network
          console.log(this.rawData);
          this.publish();
        }
        this.isLoading = false;
      },
      unspentErr() {
        this.isLoading = false;
        this.notify('余额为0');
      },
      getBalance(address) {
        const balanceUrl = `${Coin.btc.main.balanceUrl}${address}`;
        Common.fetch(balanceUrl).then(this.balanceSuc).catch(this.balanceErr);
      },
      balanceSuc(res) {
        this.balance = res[this.address].final_balance;
        this.isLoading = false;
      },
      balanceErr() {
      },
      publish() {
        Common.pushx(Coin.btc.main.publishUrl, {
          rawhex: this.rawData,
        }).then(this.pubSuc).catch(this.pubErr);
      },
      pubSuc(res) {
        if (res.err_no === 0) {
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
            currencyName: 'BTC',
          }).then(this.transSuc).catch(this.transErr);
        } else {
          this.pubErr();
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
      this.getBalance(this.address);
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
