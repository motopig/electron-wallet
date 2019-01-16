<template>
  <div class="wallet-pending">
    <div class="wallet-pending-head">
      <p class="wallet-pending-left">基金/持仓</p>
      <p class="wallet-pending-middle">交易方式/时间</p>
      <p class="wallet-pending-right">数量/价格</p>
    </div>
    <div class="wallet-pending-contents" v-for="(item, key) in pendingList" :key="key" @click="transferUrl(item)">
      <div class="wallet-pending-contents-hover">
        <div class="wallet-pending-item">
          <div class="wallet-pending-contents-left">
            <div class="wallet-pending-contents-main">
              <div class="wallet-pending-contents-img">
                <img class="wallet-pending-contents-img-single" v-if="item.walletType==='1'">
                <img class="wallet-pending-contents-img-multiple" v-if="item.walletType==='2'">
              </div>
              <p class="wallet-pending-contents-item">{{ currentAlias }}</p>
            </div>
            <div class="wallet-pending-contents-sub">
              <img class="wallet-pending-contents-img" src="../../../../../static/images/wallet/untreated.png" v-if="item.isDispose==='1'">
              <img class="wallet-pending-contents-img" src="../../../../../static/images/wallet/pending.png" v-if="item.isDispose==='2'">
              <p class="wallet-pending-contents-item">
                {{ item.itemName }}
                <span v-if="item.itemName && item.fundName"> / </span>
                {{ item.fundName }}
              </p>
            </div>
          </div>
          <div class="wallet-pending-contents-middle">
            <p class="wallet-pending-contents-main">{{ item.operaType|typeFilter }}</p>
            <p class="wallet-pending-contents-sub" v-if="item.createTime.indexOf('.')===-1">{{ item.createTime }}</p>
            <p class="wallet-pending-contents-sub" v-else>{{ item.createTime.substr(0, item.createTime.indexOf('.')) }}</p>
          </div>
          <div class="wallet-pending-contents-right">
            <div class="wallet-pending-contents-main">
              <p class="wallet-pending-contents-main-right" v-if="item.currentPrice" >{{ Number(item.currentPrice.toFixed(4)) }}</p>
              <img class="wallet-pending-contents-img-right" :src="item.currentType | process">
            </div>
            <p class="wallet-pending-contents-sub"  v-if="item.currentPrice">{{ Number((item.amount * item.currentPrice).toFixed(4)) }}RMB</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Tabbar from '@/common/Tabbar';
  import Wallet from '@/api/Wallet';
  import Dict from '@/config/dict';

  export default {
    props: {
      currentAddress: String,
      currentAlias: String,
    },
    components: {
      Header,
      Tabbar,
    },
    data() {
      return {
        pendingList: [],
      };
    },
    watch: {
      currentAddress() {
        this.walletUntrade();
      },
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
      process(coin) {
        return `../../../../../static/images/coin/${Dict.network[coin].toLowerCase()}.png`;
      },
    },
    methods: {
      walletUntrade() {
        this.$emit('startLoading');
        Wallet.walletUntradeList({
          walletAddress: this.currentAddress,
        }).then(this.unSuc).catch(this.unErr);
      },
      unSuc(res) {
        if (res.resultCode === '200') {
          this.pendingList = res.data.list;
          this.$emit('undoned', this.pendingList.length);
        }
        this.$emit('endLoading');
      },
      unErr() {
        this.$emit('endLoading');
      },
      transferUrl(data) {
        const coin = Dict.network[data.currentType].toLowerCase();
        // isapply 是否申请[true 是，false 否](是否签过名，saas后台申请转账的记录)  first 是否pro list页面转账按钮跳转过来的第一次签名
        if (data.walletType === '2') {
          if (data.isDispose === '1') { // 1 未处理 说明是申请转账没有签过名 开启第一次签名流程
            this.$store.dispatch('transfer', JSON.stringify(data));
            this.$router.push(`/wallet/transfermul/${coin}?address=${this.currentAddress}&alias=${this.currentAlias}&coin=${coin}&first=true&isapply=true&pendingId=${data.id}&amount=${data.amount}&to=${data.otherAddress}`);
          } else {
            // 不管当前用户是否签名 都进入显示转账页面，已经签名的则不显示签名按钮
            this.$store.dispatch('transfer', JSON.stringify(data));
            this.$router.push(`/wallet/transfermul/${coin}?address=${this.currentAddress}&alias=${this.currentAlias}&coin=${coin}&first=false&isapply=true&pendingId=${data.id}&amount=${data.amount}&to=${data.otherAddress}&sponsor=${data.sponsor}`);
          }
        } else if (data.walletType === '1') { // 后台申请的单签转账
          this.$store.dispatch('transfer', JSON.stringify(data));
          this.$router.push(`/wallet/transfer/?address=${this.currentAddress}&alias=${this.currentAlias}&coin=${coin}&type=1&to=${data.otherAddress}&amount=${data.amount}`);
        }
      },
    },
    mounted() {
      this.walletUntrade();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-pending {
    padding: 30px 0;
    .wallet-pending-head {
      padding: 0 32px;
      line-height: 30px;
      height: 46px;
      padding-bottom: 16px;
      color: @greyColor;
      font-size: @fontSizeEight;
      .wallet-pending-left {
        float: left;
        width: 33%;
        text-align: left;
      }
      .wallet-pending-middle {
        float: left;
        width: 34%;
        text-align: center;
      }
      .wallet-pending-right {
        float: right;
        width: 33%;
        text-align: right;
      }
    }
    .wallet-pending-contents {
      clear: both;
      padding: 14px 0;
      color: @darkColor;
      border-bottom: 1px solid @borderBottomColor;
      .wallet-pending-contents-hover {
        padding: 30px;
        &:hover {
          background: #E5F7FF;
          .wallet-pending-contents-img-single {
            background: url("../../../../../static/images/wallet/single_1.png") !important;
          }
          .wallet-pending-contents-img-multiple {
            background: url("../../../../../static/images/wallet/multiple_1.png") !important;
          }
        }
        .wallet-pending-item {
          height: 74px;
          font-weight: bold;
          .wallet-pending-contents-left {
            float: left;
            width: 33%;
            font-size: @fontSizeSix;
            text-align: left;
            .wallet-pending-contents-main {
              .wallet-pending-contents-img {
                .wallet-pending-contents-img-single {
                  height: 0;
                  width: 30px;
                  padding-bottom: 100%;
                  background: url("../../../../../static/images/wallet/single_2.png");
                }
                .wallet-pending-contents-img-multiple {
                  height: 0;
                  width: 30px;
                  padding-bottom: 100%;
                  background: url("../../../../../static/images/wallet/multiple_2.png");
                }
              }
            }
            .wallet-pending-contents-item {
              margin-left: 66px;
            }
            .wallet-pending-contents-img {
              float: left;
              height: 30px;
              width: 30px;
            }
          }
          .wallet-pending-contents-middle {
            float: left;
            width: 34%;
            text-align: center;
            font-size: @fontSizeSix;
          }
          .wallet-pending-contents-right {
            float: right;
            height: 30px;
            width: 33%;
            text-align: right;
            .wallet-pending-contents-main-right {
              padding-left: 24px;
              float: right;
            }
            .wallet-pending-contents-img-right {
              float: right;
              height: 30px;
              width: 30px;
            }
          }
          .wallet-pending-contents-main {
            line-height: 30px;
            font-size: @fontSizeSix;
          }
          .wallet-pending-contents-sub {
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
