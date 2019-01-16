<template>
  <div class="wallet-asset">
    <div class="wallet-asset-head">
      <p class="wallet-asset-left">币种</p>
      <p class="wallet-asset-right">资产</p>
      <p class="wallet-asset-middle">价格</p>
    </div>

    <router-link :to="item | process(currentType, currentAlias)" :key=index v-if="assets.length" v-for="(item, index) in assets">
    <div class="wallet-asset-contents">
      <div class="wallet-asset-contents-hover">
        <div class="wallet-asset-item">
          <div class="wallet-asset-contents-left">
            <img class="wallet-asset-contents-img" :src="item.currencyName | icon">
            <span>{{ item.currencyName }}</span>
          </div>
          <div class="wallet-asset-contents-right">
            <p class="wallet-asset-contents-right-main">{{ Number(item.balance.toFixed(4)) }}</p>
            <p class="wallet-asset-contents-right-sub">{{ Number(item.balance.toFixed(4) * item.currentPrice.toFixed(4)) }}RMB</p>
          </div>
          <div class="wallet-asset-contents-middle">{{ Number(item.currentPrice.toFixed(4)) }}</div>
        </div>
      </div>
    </div>
    </router-link>

  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Tabbar from '@/common/Tabbar';
  import Wallet from '@/api/Wallet';

  export default {
    props: {
      currentAddress: String,
      currentCoin: String,
      currentType: String,
      currentAlias: String,
    },
    components: {
      Header,
      Tabbar,
    },
    data() {
      return {
        assets: [],
      };
    },
    watch: {
      currentAddress() {
        this.walletAsset();
      },
    },
    filters: {
      // filters 中无法使用this
      process(item, type, alias) {
        if (item.currencyName !== undefined) {
          // contract address / coin / real address
          return `/wallet/trade/list/${item.currencyName.toLowerCase()}/${item.contractAddress}?address=${item.addressToken}&currentType=${type}&alias=${alias}`;
        }
        return '';
      },
      icon(name) {
        return `../../../../../static/images/coin/${name.toLowerCase()}.png`;
      },
    },
    methods: {
      walletAsset() {
        this.$emit('startLoading');
        Wallet.walletAsset({
          walletAddress: this.currentAddress,
        }).then(this.assetSuc).catch(this.assetErr);
      },
      assetSuc(res) {
        if (res.resultCode === '200') {
          this.assets = res.data;
        } else {
          // todo 提示文案
          this.$toast('网络获取超时，请重新刷新', {
            horizontalPosition: 'center',
            verticalPosition: 'center',
            className: 'wallet-toast',
          });
        }
        this.$emit('endLoading');
      },
      assetErr() {
        this.$emit('endLoading');
      },
    },
    mounted() {
      this.walletAsset();
    },
    created() {
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-asset {
    padding: 30px 0;
    .wallet-asset-head {
      padding: 0 32px;
      line-height: 30px;
      height: 46px;
      padding-bottom: 16px;
      color: @greyColor;
      font-size: @fontSizeEight;
      .wallet-asset-left {
        float: left;
        width: 33%;
        text-align: left;
      }
      .wallet-asset-middle {
        flex: 1;
        text-align: center;
      }
      .wallet-asset-right {
        float: right;
        width: 33%;
        text-align: right;
      }
    }
    .wallet-asset-contents {
      clear: both;
      padding: 16px 0;
      color: @darkColor;
      border-bottom: 1px solid @borderBottomColor;
      .wallet-asset-contents-hover {
        height: 120px;
        &:hover {
          background: #E5F7FF;
        }
        .wallet-asset-item {
          padding: 30px;
          font-weight: bold;
          .wallet-asset-contents-left {
            float: left;
            width: 33%;
            font-size: @fontSizeSix;
            text-align: left;
            .wallet-asset-contents-img {
              height: 60px;
              width: 78px;
              padding-right: 18px;
            }
          }
          .wallet-asset-contents-middle {
            flex: 1;
            line-height: 60px;
            height: 60px;
            text-align: center;
            font-size: @fontSizeSix;
          }
          .wallet-asset-contents-right {
            float: right;
            width: 33%;
            line-height: 30px;
            height: 60px;
            text-align: right;
            .wallet-asset-contents-right-main {
              font-size: @fontSizeSix;
            }
            .wallet-asset-contents-right-sub {
              font-size: @fontSizeNine;
            }
          }
        }
      }
    }
  }
</style>
