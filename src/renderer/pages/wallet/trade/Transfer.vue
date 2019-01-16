<template>
  <div class="wallet-trade-transfer">
    <Header
        headerTitle="单签转账"
        backward="/wallet"
    ></Header>
    <div class="wallet-trade-transfer-list">
      <div class="wallet-trade-transfer-items">
        <div class="list-title-content">
          <div class="list-title">转账收款人地址</div>
          <div class="list-sub-title">
            <input v-model="to" type="text" :disabled="disabled" placeholder="请输入转账收款人地址">
          </div>
        </div>
      </div>
      <div class="wallet-trade-transfer-items">
        <div class="list-title-content">
          <div class="list-title">转账金额</div>
          <div class="list-sub-title">
            <input v-model="amount" type="text" :disabled="disabled" placeholder="请输入转账金额">
          </div>
        </div>
      </div>
      <div class="wallet-trade-transfer-items-area">
        <div class="list-title-content-area">
          <div class="list-title-area">备注</div>
          <textarea class="list-sub-title-area" v-model="remark" placeholder="多行输入"></textarea>
        </div>
      </div>
    </div>
    <p class="wallet-trade-transfer-title">矿工费</p>
    <div class="wallet-trade-transfer-slider">
      <vue-slider
          v-model="fee"
          v-bind="sliderOptions"
      >
      </vue-slider>
      <div class="content">
        <span class="slow">慢</span>
        <span class="fast">快</span>
        <div class="fee_eth"> {{ fee }} {{ coin === 'USDT' ? 'BTC' : coin }}</div>
      </div>
    </div>
    <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
    <v-list class="transfer-btn">
      <button class="up-btn" :disabled="isLoading" @click="toNext">下一步</button>
    </v-list>
  </div>
</template>

<script>
  import VueSlider from 'vue-slider-component';
  import sto2btc from 'satoshi-bitcoin';
  import Header from '@/common/Header';
  import Common from '../../../api/Common';
  import Coin from '../../../config/coin';

  export default {
    components: {
      VueSlider,
      Header,
    },
    data() {
      return {
        address: '',
        to: '',
        amount: null,
        remark: '',
        fee: 0.00003, // transaction fee
        type: '',
        coin: '',
        defaultBytes: 250, // bitcoin normal transaction bytes
        sliderOptions: {
          height: '16',
          min: 0, // bitcoin min transaction fee
          max: 10000,
          interval: 0.00001,
          processStyle: {
            backgroundImage: '-webkit-linear-gradient(left, #7AD7FF, #5BB1EE)',
          },
        },
        isLoading: true,
        defaultGas: 21000, // eth normal transaction gas
        unspents: 1,
        hasUnspent: true,
        disabled: false,
      };
    },
    methods: {
      toNext() {
        if (!this.to || !this.amount) {
          this.notify('请检查输入信息');
          return;
        }
        if (!this.hasUnspent) {
          this.notify('钱包余额为0');
          return;
        }
        const lowerCoin = this.coin.toLowerCase();
        const url = `/wallet/transfer/pwd/${lowerCoin}`;
        this.$router.push({
          path: url,
          query: {
            address: this.address,
            to: this.to,
            amount: this.amount,
            remark: this.remark,
            fee: this.fee,
            type: this.type,
            coin: this.coin,
          },
        });
      },
      ethSuc(err, res) {
        this.sliderOptions.min = (res.safeLow * this.defaultGas) / 10000000000;
        this.fee = (res.fast * this.defaultGas) / 10000000000;
        this.sliderOptions.max = (res.fastest * this.defaultGas) / 10000000000;
        this.isLoading = false;
      },
      ethFee() {
        const opt = {
          url: Coin.eth.main.feeUrl,
        };
        Common.dataRequest(opt, this.ethSuc);
      },
      btcFee() {
        Common.fetch(Coin.btc.main.feeUrl, {}).then((res) => {
          // 148 * inputs + 34 * outputs + 10
          let totalBytes = 0;
          if (this.unspents === 1) {
            totalBytes = 250;
          } else {
            totalBytes = (148 * this.unspents) + 44;
          }
          this.sliderOptions.min = sto2btc.toBitcoin(res.hourFee * totalBytes);
          this.fee = sto2btc.toBitcoin(res.fastestFee * totalBytes);
          this.sliderOptions.max = res.fastestFee / 100000; // https://btc.com/stats/unconfirmed-tx 当前最佳手续费
          this.isLoading = false;
        }).catch(this.btcFeeErr);
      },
      btcFeeErr() {
        this.isLoading = false;
      },
      unspent() {
        const unspentUrl = `${Coin.btc.main.unspentUrl}${this.address}`;
        Common.fetch(unspentUrl, {}).then(this.unspentSuc).catch(this.unspentErr);
      },
      unspentSuc(res) {
        this.unspents = res.unspent_outputs.length;
        this.btcFee();
      },
      unspentErr() {
        this.isLoading = false;
        this.hasUnspent = false;
        this.btcFee();
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
      this.coin = this.$route.query.coin.toUpperCase();
      this.type = this.$route.query.type;
      if ('to' in this.$route.query) {
        this.to = this.$route.query.to;
      }
      if ('amount' in this.$route.query) {
        this.amount = this.$route.query.amount;
        this.disabled = true;
      }
      // fee
      if (this.coin === 'ETH') {
        this.ethFee();
      } else if (this.coin === 'BTC' || this.coin === 'USDT') {
        this.unspent();
      }
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-trade-transfer {
    padding: 0 30px;
    .wallet-trade-transfer-list {
      margin-top: 45px;
      .wallet-trade-transfer-items {
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
            input {
              width: 100%;
            }
          }
        }
      }
      .wallet-trade-transfer-items-area {
        clear: both;
        height: 226px;
        .list-title-content-area {
          border-bottom: 1px solid @borderBottomColor;
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
    .wallet-trade-transfer-title {
      padding: 15px 30px;
      height: 75px;
      line-height: 60px;
      font-size: @fontSizeFive;
      color: @darkColor;
    }
    .wallet-trade-transfer-slider {
      padding: 20px;

      .content {
        padding: 30px 0;
        line-height: 30px;
        .slow {
          line-height: 30px;
          margin-left: 18px;
          float: left;
          font-size: @fontSizeNine;
          color: @darkColor;
        }
        .fast {
          line-height: 30px;
          float: right;
          font-size: @fontSizeNine;
          margin-right: 16px;
          color: @darkColor;
        }
        .fee_eth {
          line-height: 30px;
          text-align: center;
          color: @darkColor;
          font-size: @fontSizeNine;
        }
      }
    }
    .transfer-btn {
      padding: 60px 0 30px 0;
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

<style lang="less">
  .wallet-trade-transfer {
    .primary {
      border-radius: 20px;
      width: 40px;
      background-color: #F87F13;
      height: 40px;
    }
    .v-slider {
      height: 10px;
    }
  }
</style>
