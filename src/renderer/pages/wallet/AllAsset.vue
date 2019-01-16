<template>
  <div class="wallet-allasset">
    <Header
      headerTitle="所有资产"
      backward="/wallet"
    ></Header>
    <div class="wallet-allasset-head">
      <p class="wallet-allasset-left">币种</p>
      <p class="wallet-allasset-right">资产</p>
      <p class="wallet-allasset-middle">价格</p>
    </div>
    <div class="wallet-allasset-contents" v-for="(item, key) in assetList" :key="key" >
      <div class="wallet-allasset-contents-hover">
        <div class="wallet-asset-contents-left">
          <img class="wallet-allasset-contents-img" :src="`../../../../../../static/images/coin/${getCoin(item.currentType).toLowerCase()}.png`">
          <span>{{ getCoin(item.currentType) }}</span>
        </div>
        <div class="wallet-allasset-contents-right">
          <p class="wallet-allasset-contents-right-main">{{ Number(item.balance.toFixed(4)) }}</p>
          <p class="wallet-allasset-contents-right-sub">{{ Number((item.balance * item.currentPrice).toFixed(4)) }}RMB</p>
        </div>
        <div class="wallet-allasset-contents-middle">{{ Number(item.currentPrice.toFixed(4)) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Wallet from '@/api/Wallet';
  import Dict from '../../config/dict';

  export default {
    components: {
      Header,
    },
    data() {
      return {
        assetList: null,
      };
    },
    methods: {
      getCoin(type) {
        return Dict.network[type];
      },
      allWalletAsset() {
        Wallet.allWalletAsset({
          userId: this.$store.state.user.id,
        }).then(this.allWalletAssetSucc).catch(this.allWalletAssetErr);
      },
      allWalletAssetSucc(res) {
        if (res.resultCode === '200') {
          this.assetList = res.data;
        }
      },
      allWalletAssetErr() {
      },
    },
    mounted() {
      this.allWalletAsset();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-allasset {
    padding: 0 30px 30px 30px;
    text-align: center;
    .wallet-allasset-head {
      line-height: 30px;
      height: 106px;
      padding: 60px 32px 16px 32px;
      color: @greyColor;
      font-size: @fontSizeEight;
      .wallet-allasset-left {
        float: left;
        width: 33%;
        text-align: left;
      }
      .wallet-allasset-middle {
        flex: 1;
        text-align: center;
      }
      .wallet-allasset-right {
        float: right;
        width: 33%;
        text-align: right;
      }
    }
    .wallet-allasset-contents {
      clear: both;
      padding: 15px 0;
      color: @darkColor;
      border-bottom: 1px solid @borderBottomColor;
      height: 151px;
      .wallet-allasset-contents-hover {
        padding: 30px 0;
        height: 120px;
        &:hover {
          background: #E5F7FF;
        }
        .wallet-asset-contents-left {
          float: left;
          width: 33%;
          padding-left: 30px;
          font-size: @fontSizeSix;
          text-align: left;
          height: 120px;
          .wallet-allasset-contents-img {
            height: 60px;
            width: 78px;
            padding-right: 18px;
          }
        }
        .wallet-allasset-contents-middle {
          flex: 1;
          line-height: 60px;
          height: 60px;
          text-align: center;
          font-size: @fontSizeSix;
        }
        .wallet-allasset-contents-right {
          float: right;
          width: 33%;
          padding-right: 30px;
          line-height: 30px;
          height: 60px;
          text-align: right;
          .wallet-allasset-contents-right-main {
            font-size: @fontSizeSix;
          }
          .wallet-allasset-contents-right-sub {
            font-size: @fontSizeNine;
          }
        }
      }
    }
  }
</style>
