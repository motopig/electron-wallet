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
  import { ethers } from 'ethers';
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
        isLoading: false,
        txId: '',
        back: '',
        balance: 0,
        tokenName: '',
      };
    },
    methods: {
      async toNext() {
        // check password
        this.isLoading = true;
        const store = new Store();
        const coin = this.coin.toUpperCase();
        const walletList = `${Base.walletList}_${this.$store.state.user.id}_${coin}`;
        const treasure = store.get(walletList);
        const boss = treasure[this.address];
        try {
          this.privateKey = Des.decrypt(boss.privatekey, this.pwd);
        } catch (e) {
          console.log('do nothing');
        }
        if (this.privateKey === '') {
          this.$toast('钱包密码不正确', {
            horizontalPosition: 'center',
            verticalPosition: 'center',
            className: 'wallet-toast',
          });
        } else {
          const provider = ethers.getDefaultProvider();
          const code = await provider.getCode(this.to);
          const gPrice = await provider.getGasPrice();
          let gLimit = 21000;
          // https://etherscancom.freshdesk.com/support/solutions/articles/35000071618-transaction-marked-fail-why-
          // 往合约地址转账时 LIMIT 必须大于21000 暂定23000
          if (code !== '0x') {
            gLimit = 23000;
          }
          const wallet = new ethers.Wallet(this.privateKey, provider);
          const balance = await wallet.getBalance();
          if (balance < this.amount) {
            this.notify('转账地址eth余额不足');
          } else {
            const transaction = {
              gasLimit: gLimit,
              gasPrice: gPrice,
              to: this.to,
              value: ethers.utils.parseEther(this.amount),
            };
            wallet.sendTransaction(transaction).then(this.tranSuc);
          }
        }
      },
      tranSuc(res) {
        // save transaction to backend
        this.txId = res.hash;
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
          txHash: res.hash,
          poundage: this.fee,
          operaType: 2, // 1 转入 2 转出
          remark: this.remark,
          blockNumber: '',
          btcSignatures: '',
          currencyName: this.tokenName,
        }).then(this.transSuc).catch(this.transErr);
        this.isLoading = false;
      },
      transSuc(res) {
        this.$router.push(`/wallet/eth/single/tx/${res.data.id}?coin=${this.coin}`);
      },
      transErr() {
        this.notify('转账失败');
      },
      getBalance(address) {
        const opt = {
          url: `${Coin.eth.main.balanceUrl}${address}`,
        };
        Common.dataRequest(opt, this.balanceSuc);
      },
      balanceSuc(err, res) {
        if (res.message === 'OK') {
          this.balance = res.result;
        } else {
          this.notify('获取eth余额失败');
        }
        this.isLoading = false;
        console.log(res);
      },
      balanceErr() {
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
      this.tokenName = this.$route.query.tokenName;
      this.type = this.$route.query.type;
      this.back = `/wallet/transfer/?address=${this.address}&amount=${this.amount}&coin=${this.coin}&type=${this.type}&to=${this.to}`;
      // this.getBalance(this.address);
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
