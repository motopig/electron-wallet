<template>
  <div class="wallet-allpending">
    <Header
        headerTitle="所有未处理"
        backward="/wallet"
    ></Header>
    <div class="wallet-allpending-head">
      <p class="wallet-allpending-left">基金/持仓</p>
      <p class="wallet-allpending-middle">交易方式/时间</p>
      <p class="wallet-allpending-right">数量/价格</p>
    </div>
    <div class="wallet-allpending-contents" v-for="(item, key) in pendingList" :key="key">
      <div class="wallet-allpending-contents-hover">
        <div class="wallet-allpending-item">
          <div class="wallet-allpending-contents-left">
            <div class="wallet-allpending-contents-main">
              <div class="wallet-allpending-contents-img">
                <img class="wallet-allpending-contents-img-single" v-if="item.walletType==='1'">
                <img class="wallet-allpending-contents-img-multiple" v-if="item.walletType==='2'">
              </div>
              <p class="wallet-allpending-contents-item">{{ item.walletAlias }}</p>
            </div>
            <div class="wallet-allpending-contents-sub">
              <img class="wallet-allpending-contents-img" src="../../../../static/images/wallet/untreated.png" v-if="item.isDispose==='1'">
              <img class="wallet-allpending-contents-img" src="../../../../static/images/wallet/pending.png" v-if="item.isDispose==='2'">
              <p class="wallet-allpending-contents-item">
                {{ item.itemName }}
                <span v-if="item.itemName && item.fundName"> / </span>
                {{ item.fundName }}
              </p>
            </div>
          </div>
          <div class="wallet-allpending-contents-middle">
            <p class="wallet-allpending-contents-main">{{ item.operaType|typeFilter }}</p>
            <p class="wallet-allpending-contents-sub" v-if="item.createTime.indexOf('.')===-1">{{ item.createTime }}</p>
            <p class="wallet-allpending-contents-sub" v-else>{{ item.createTime.substr(0, item.createTime.indexOf('.')) }}</p>
          </div>
          <div class="wallet-allpending-contents-right">
            <div class="wallet-allpending-contents-main">
              <p class="wallet-allpending-contents-main-right">{{ Number(item.amount.toFixed(4)) }}</p>
              <img class="wallet-allpending-contents-img-right" v-if="item.currentType==='00'" src="../../../../static/images/common/btc.png">
              <img class="wallet-allpending-contents-img-right" v-if="item.currentType==='01'" src="../../../../static/images/common/eth.png">
            </div>
            <p class="wallet-allpending-contents-sub" v-if="item.currentPrice">{{ Number(item.currentPrice.toFixed(4)) }}RMB</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Wallet from '@/api/Wallet';

  export default {
    components: {
      Header,
    },
    data() {
      return {
        pendingList: [],
      };
    },
    filters: {
      typeFilter(type) {
        switch (type) {
          case '1':
            return '转入';
          case '2':
            return '转出';
          default:
            return '';
        }
      },
    },
    methods: {
      getAllPending() {
        Wallet.allWalletUntradeList({
          userId: this.$store.state.user.id,
        }).then(this.getAllPendingSuc).catch(this.getAllPendingErr);
      },
      getAllPendingSuc(res) {
        if (res.resultCode === '200') {
          this.pendingList = res.data;
        }
      },
      getAllPendingErr() {
      },
    },
    mounted() {
      this.getAllPending();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-allpending {
    padding: 30px 0;
    .wallet-allpending-head {
      padding: 0 32px;
      line-height: 30px;
      height: 46px;
      padding-bottom: 16px;
      color: @greyColor;
      font-size: @fontSizeEight;
      .wallet-allpending-left {
        float: left;
        width: 33%;
        text-align: left;
      }
      .wallet-allpending-middle {
        float: left;
        width: 34%;
        text-align: center;
      }
      .wallet-allpending-right {
        float: right;
        width: 33%;
        text-align: right;
      }
    }
    .wallet-allpending-contents {
      clear: both;
      padding: 14px 0;
      color: @darkColor;
      border-bottom: 1px solid @borderBottomColor;
      .wallet-allpending-contents-hover {
        padding: 30px;
        &:hover {
          background: #E5F7FF;
          .wallet-allpending-contents-img-single {
            background: url("../../../../static/images/wallet/single_1.png") !important;
          }
          .wallet-allpending-contents-img-multiple {
            background: url("../../../../static/images/wallet/multiple_1.png") !important;
          }
        }
        .wallet-allpending-item {
          height: 74px;
          font-weight: bold;
          .wallet-allpending-contents-left {
            float: left;
            width: 33%;
            font-size: @fontSizeSix;
            text-align: left;
            .wallet-allpending-contents-main {
              .wallet-allpending-contents-img {
                .wallet-allpending-contents-img-single {
                  height: 0;
                  width: 30px;
                  padding-bottom: 100%;
                  background: url("../../../../static/images/wallet/single_2.png");
                }
                .wallet-allpending-contents-img-multiple {
                  height: 0;
                  width: 30px;
                  padding-bottom: 100%;
                  background: url("../../../../static/images/wallet/multiple_2.png");
                }
              }
            }
            .wallet-allpending-contents-item {
              margin-left: 66px;
            }
            .wallet-allpending-contents-img {
              float: left;
              height: 30px;
              width: 30px;
            }
          }
          .wallet-allpending-contents-middle {
            float: left;
            width: 34%;
            text-align: center;
            font-size: @fontSizeSix;
          }
          .wallet-allpending-contents-right {
            float: right;
            height: 30px;
            width: 33%;
            text-align: right;
            .wallet-allpending-contents-main-right {
              padding-left: 24px;
              float: right;
            }
            .wallet-allpending-contents-img-right {
              float: right;
              height: 30px;
              width: 30px;
            }
          }
          .wallet-allpending-contents-main {
            line-height: 30px;
            font-size: @fontSizeSix;
          }
          .wallet-allpending-contents-sub {
            clear: both;
            padding-top: 14px;
            line-height: 30px;
            font-size: @fontSizeNine;
          }
        }
      }
    }
  }
</style>
