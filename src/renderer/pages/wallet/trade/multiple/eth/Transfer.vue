<template>
  <div class="wallet-trade-mul-eth-transfer">
    <Header
        headerTitle="转账事务"
        backward="/wallet"
    ></Header>
    <v-dialog
        content-class="wallet-eth-transfer-dialog"
        v-model="showDialog"
        max-width="84vw"
    >
      <p class="eth-transfer-dialog-comment">撤销将影响其他转账签名，如想重新确认，请确认撤销后发起新的转账申请。</p>
      <div class="eth-transfer-dialog-btns">
        <button class="eth-transfer-dialog-ok" :disabled="isLoading" @click="transferCancel">是</button>
        <button class="eth-transfer-dialog-ng" @click="transferDialogClose">否</button>
      </div>
    </v-dialog>
    <div class="wallet-trade-mul-eth-list">
      <div class="wallet-trade-mul-eth-items">
        <div class="list-title-content">
          <div class="list-title">收款人地址</div>
          <div class="list-sub-title">
            <input v-model="to" type="text" :disabled="isapply" placeholder="请输入转账收款人地址">
          </div>
        </div>
      </div>
      <div class="wallet-trade-mul-eth-items">
        <div class="list-title-content">
          <div class="list-title">转账金额</div>
          <div class="list-sub-title">
            <input v-model="amount" type="text" :disabled="isapply" placeholder="请输入转账金额">
          </div>
        </div>
      </div>
      <div class="wallet-trade-mul-eth-items-area">
        <div class="list-title-content-area">
          <div class="list-title-area">备注</div>
          <textarea class="list-sub-title-area" v-model="remark" placeholder="多行输入"></textarea>
        </div>
      </div>
      <div class="wallet-trade-mul-eth-items">
        <div class="list-title-content">
          <div class="list-title">已签名</div>
          <div class="list-sub-title">
            <template v-if="signed" v-for="(item, index) in signed">
              <v-chip :key="index" outline color="secondary">{{ item }}</v-chip>
            </template>
          </div>
        </div>
      </div>

      <div class="wallet-trade-mul-eth-items">
        <div class="list-title-content">
          <div class="list-title">未签名</div>
          <div class="list-sub-title">
            <template v-if="unsigned" v-for="(item, index) in unsigned">
              <v-chip :key="index" outline color="secondary">{{ item }}</v-chip>
            </template>
          </div>
        </div>
      </div>
    </div>
    <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
    <v-list class="sign-btn">
      <button class="up-btn cancel" v-if="sponsor" :disabled="isLoading" @click="cancel">撤销</button>
      <button class="up-btn tosign" v-if="sponsor" :disabled="isLoading" @click="sign">签名</button>
    </v-list>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Wallet from '@/api/Wallet';
  import Coin from '@/config/coin';
  import Common from '@/api/Common';

  export default {
    components: {
      Header,
    },
    data() {
      return {
        signed: [],
        unsigned: [],
        address: '',
        to: '',
        amount: 0,
        remark: '',
        type: '',
        coin: '',
        isLoading: true,
        first: false,
        pendingId: 0,
        pubKeys: '', // 逗号分隔字符串
        showDialog: false,
        singleAddress: '',
        isapply: false,
        balance: 0,
        oneSinged: false, // 是否支持一人签名就能转账
        defaultGas: 21000,
        fee: 0,
        sponsor: true,
      };
    },
    methods: {
      cancel() {
        if (this.isapply) {
          this.$router.push('/wallet');
        } else {
          this.showDialog = true;
        }
      },
      sign() {
        if (!this.to || !this.amount) {
          this.notify('请填写必要信息');
        } else {
          this.$router.push(`/wallet/transfermul/eth/pwd?address=${this.address}&coin=${this.coin}&to=${this.to}&amount=${this.amount}&first=${this.first}&isapply=${this.isapply}&pendingId=${this.pendingId}&fee=${this.fee}&single=${this.oneSinged}&remark=${this.remark}`);
        }
      },
      process() {
        // 从 store 里获取tx 数据 , 数据来自pending页面点击触发存储
        const mulTx = JSON.parse(this.$store.state.tx.transfer);
        if (Object.values(mulTx).length > 0) {
          if (this.isapply === true) {
            this.signed = this.stringFilter(mulTx.isAddressList);
            this.unsigned = this.stringFilter(mulTx.noAddressList);
          }
          if (mulTx.oneSinged === '1') { // 可以一人签名完成转账
            this.oneSinged = true;
          }
        } else {
          this.multWallet.ownerAddressList.push(this.multWallet.creatorAddress);
          this.unsigned = this.multWallet.ownerAddressList;
        }
        this.ethFee();
      },
      stringFilter(string) {
        string = string.replace('[', '');
        string = string.replace(']', '');
        return string.split(',');
      },
      transferCancel() {
        // 当前钱包取消多签转账交易签名
        Wallet.updateMultTransaction({
          id: this.pendingId,
          walletAddress: this.multWallet.creatorAddress,
          isDispose: 4,
          transferAddress: this.address,
          ethSignatures: '',
          poundage: '',
          remark: '',
          txHash: '',
        }).then(this.transSuc).catch(this.transErr);
        this.showDialog = false;
      },
      transferDialogClose() {
        this.showDialog = false;
      },
      fetchMultWalletInfo() {
        Wallet.getMultWalletInfo({
          walletAddress: this.address,
        }).then(this.fetchSuc).catch(this.commonErr);
      },
      fetchSuc(res) {
        this.multWallet = res.data;
        this.process();
      },
      ethSuc(err, res) {
        this.fee = (res.fast * this.defaultGas) / 10000000000;
        this.isLoading = false;
      },
      ethFee() {
        const opt = {
          url: Coin.eth.main.feeUrl,
        };
        Common.dataRequest(opt, this.ethSuc);
      },
      notify(msg) {
        this.$toast(msg, {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
      },
    },
    mounted() {
      this.address = this.$route.query.address;
      this.coin = this.$route.query.coin;
      this.pendingId = this.$route.query.pendingId;
      if (this.$route.query.first === 'true') {
        this.first = true;
      }
      if (this.$route.query.isapply === 'true') {
        this.isapply = true;
      }
      if (this.$route.query.sponsor === 'true') {
        this.sponsor = false;
      }
      this.to = this.$route.query.to;
      this.amount = this.$route.query.amount;
      // 多签钱包信息 创建人地址和参与者地址
      this.fetchMultWalletInfo();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-trade-mul-eth-transfer {
    padding: 0 30px;
    .wallet-trade-mul-eth-list {
      margin-top: 30px;
      .wallet-trade-mul-eth-items {
        .list-title-content {
          padding: 0 30px;
          border-bottom: 1px solid @greyColor;
          .list-title {
            padding-top: 15px;
            height: 75px;
            line-height: 60px;
            font-size: @fontSizeFive;
            color: @darkColor;
          }
          .list-sub-title {
            line-height: 45px;
            font-size: @fontSizeEight;
            color: @greyColor;
            input {
              width: 100%;
            }
          }
        }
      }
      .wallet-trade-mul-eth-items-area {
        clear: both;
        height: 226px;
        .list-title-content-area {
          border-bottom: 1px solid @greyColor;
          height: 226px;
          .list-title-area {
            padding: 15px 30px 0 30px;
            height: 75px;
            line-height: 60px;
            font-size: @fontSizeFive;
            color: @darkColor;
          }
          .list-sub-title-area {
            padding: 0 30px;
            height: 151px;
            width: 100%;
            font-size: @fontSizeEight;
            color: @greyColor;
            border: 1px solid @greyColor;
          }
        }
      }
    }
    .sign-btn {
      height: 190px;
      padding: 60px 30px;
      .up-btn {
        height: 70px;
        border-radius: 35px;
        font-size: @fontSizeFive;
      }
      .cancel {
        float: left;
        background: #FFF;
        color: @dangerColor;
        width: 47.6%;
        border: 0;
      }
      .tosign {
        float: right;
        width: 47.6%;
        background: @warningColor;
        color: #FFF;
      }
    }
  }
</style>

<style lang="less">
  @import '~@/assets/styles/varibles.less';
  .wallet-eth-transfer-dialog {
    padding: 90px 60px 30px 60px;
    background: #FFF;
    text-align: center;
    border-radius: 10px;
    .eth-transfer-dialog-comment {
      font-size: @fontSizeFour;
      color: @darkColor;
      line-height: 1.5;
    }
    .eth-transfer-dialog-btns {
      height: 60px;
      width: 100%;
      margin-top: 90px;
      font-size: @fontSizeFive;
      .eth-transfer-dialog-ok {
        float: left;
        height: 60px;
        width: 44.49%;
        color: @dangerColor;
      }
      .eth-transfer-dialog-ng {
        float: right;
        height: 60px;
        width: 44.49%;
        color: @warningColor;
        border: 1px solid @warningColor;
        border-radius: 30px;
      }
    }
  }
</style>
