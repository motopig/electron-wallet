<template>
  <div class="wallet-search-list">
    <div class="wallet-search-list-title">
      <div class="left">
        <p class="wallet-search-concat"></p>
        <div class="wallet-search-start">
          <v-menu
              ref="menuStart"
              :close-on-content-click="false"
              v-model="menuStart"
              :nudge-right="40"
              :return-value.sync="start"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
          >
            <v-text-field
                slot="activator"
                v-model="start"
                prepend-icon="event"
                readonly
            ></v-text-field>
            <v-date-picker v-model="start" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menuStart = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menuStart.save(start)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </div>
      </div>
      <div class="right">
        <img class="wallet-search-btn" src="../../../../../static/images/common/search.png" @click="fetchTx">
        <div class="wallet-search-end">
          <v-menu
              ref="menuEnd"
              :close-on-content-click="false"
              v-model="menuEnd"
              :nudge-right="40"
              :return-value.sync="end"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
          >
            <v-text-field
                slot="activator"
                v-model="end"
                prepend-icon="event"
                readonly
            ></v-text-field>
            <v-date-picker v-model="end" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menuEnd = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menuEnd.save(end)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </div>
      </div>
    </div>
    <div class="wallet-search-head">
      <p class="wallet-search-left">类型/名称</p>
      <p class="wallet-search-middle">交易方式/时间</p>
      <p class="wallet-search-right">数量/价格</p>
    </div>
    <div class="wallet-search-contents" v-if="tradeList" v-for="(item, key) in tradeList" :key="key">
      <div class="wallet-search-contents-hover">
        <div class="wallet-search-item">
          <div class="wallet-search-contents-left">
            <div class="wallet-search-contents-main">
              <div class="wallet-search-contents-img">
                <img class="wallet-search-contents-img-single" v-if="walletType==='1'">
                <img class="wallet-search-contents-img-multiple" v-if="walletType==='2'">
              </div>
            </div>
            <div class="wallet-search-contents-sub">
              <p class="wallet-search-contents-item">{{ item.txHash.substr(0, 6) }}...{{ item.txHash.substr(item.txHash.length - 6) }}</p>
            </div>
          </div>
          <div class="wallet-search-contents-middle">
            <p class="wallet-search-contents-main">{{ item.operaType|typeFilter }}</p>
            <p class="wallet-search-contents-sub">{{ getTransactionTime(item.transactionTime) }}</p>
          </div>
          <div class="wallet-search-contents-right">
            <div class="wallet-search-contents-main">
              <p class="wallet-search-contents-main-right">{{ Number(item.amount.toFixed(4)) }}</p>
              <img class="wallet-search-contents-img-right" :src="item.currencyName | process">
            </div>
            <p class="wallet-search-contents-sub">{{ Number(currentPrice.toFixed(4)) }}RMB</p>
          </div>
        </div>
      </div>
    </div>
    <div class="wallet-search-list-btn">
      <router-link class="transfer" :to="transferPath">
        <button>转账</button>
      </router-link>
      <router-link class="receive" :to="receivePath">
        <button>收款</button>
      </router-link>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Tabbar from '@/common/Tabbar';
  import Dict from '@/config/dict';

  export default {
    props: {
      currentAddress: String,
      currentAlias: String,
      currentCoin: String,
      currentType: String,
    },
    components: {
      Header,
      Tabbar,
    },
    data() {
      return {
        menuStart: false,
        menuEnd: false,
        start: new Date(new Date() - 604800000).toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10),
        type: '',
        address: '',
        alias: '',
        coin: '',
        tradeList: null,
        currentPrice: 0,
        walletType: '',
        transferPath: '',
        receivePath: '',
      };
    },
    watch: {
      currentAddress(newValue) {
        this.address = newValue;
        this.getUrl(this.address, this.alias, this.coin, this.type);
        this.fetchTx();
      },
      currentAlias(newValue) {
        this.alias = newValue;
      },
      currentCoin(newValue) {
        this.coin = newValue;
        this.getUrl(this.address, this.alias, this.coin, this.type);
      },
      currentType(newValue) {
        this.type = newValue;
        this.getUrl(this.address, this.alias, this.coin, this.type);
      },
    },
    filters: {
      typeFilter(type) {
        // switch (type) {
        //   case 'IN':
        //     return '转入';
        //   case 'OUT':
        //     return '转出';
        //   default:
        //     return '';
        // }
        return type;
      },
      process(name) {
        return `../../../../../static/images/coin/${Dict.network[name].toLowerCase()}.png`;
      },
    },
    methods: {
      fetchTx() {
        // this.$emit('startLoading');
        return [];
      },
      getUrl(address, alias, coin, type) {
        if (this.type === '1') {
          this.transferPath = `/wallet/transfer/?address=${address}&alias=${alias}&coin=${coin}&type=${type}`;
          this.receivePath = `/wallet/receive/?address=${address}&alias=${alias}&coin=${coin}&type=${type}`;
        } else if (this.type === '2') {
          // todo 多签进入不同转账页面
          this.$store.dispatch('transfer', JSON.stringify({}));
          const coin = this.coin.toLowerCase();
          this.transferPath = `/wallet/transfermul/${coin}?address=${address}&alias=${alias}&coin=${this.coin}&first=true&isapply=false&pendingId=0&amount=0&to=`;
          this.receivePath = `/wallet/receivemul/?address=${address}&alias=${alias}&coin=${this.coin}`;
        }
      },
    },
    mounted() {
      this.address = this.currentAddress;
      this.alias = this.currentAlias;
      this.coin = this.currentCoin;
      this.type = this.currentType;
      this.fetchTx();
      this.getUrl(this.address, this.alias, this.coin, this.type);
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-search-list {
    padding: 30px 0;
    .wallet-search-list-title {
      height: 90px;
      .left {
        float: left;
        width: 50%;
        .wallet-search-concat {
          float: right;
          margin: 29px 26px;
          height: 2px;
          width: 16px;
          background: @greyColor;
        }
        .wallet-search-start {
          margin-right: 68px;
        }
      }
      .right {
        float: right;
        width: 50%;
        .wallet-search-btn {
          float: right;
          padding-top: 15px;
          padding-left: 30px;
          width: 60px;
        }
        .wallet-search-end {
          margin-right: 60px;
        }
      }
    }
    .wallet-search-head {
      padding: 0 32px;
      line-height: 30px;
      height: 46px;
      padding-bottom: 16px;
      color: @greyColor;
      font-size: @fontSizeEight;
      .wallet-search-left {
        float: left;
        width: 33%;
        text-align: left;
      }
      .wallet-search-middle {
        float: left;
        width: 34%;
        text-align: center;
      }
      .wallet-search-right {
        float: right;
        width: 33%;
        text-align: right;
      }
    }
    .wallet-search-contents {
      clear: both;
      padding: 14px 0;
      color: @darkColor;
      border-bottom: 1px solid @borderBottomColor;
      .wallet-search-contents-hover {
        padding: 30px;
        &:hover {
          background: #E5F7FF;
          .wallet-search-contents-img-single {
            background: url("../../../../../static/images/wallet/single_1.png") !important;
          }
          .wallet-search-contents-img-multiple {
            background: url("../../../../../static/images/wallet/multiple_1.png") !important;
          }
        }
        .wallet-search-item {
          height: 74px;
          font-weight: bold;
          .wallet-search-contents-left {
            float: left;
            width: 33%;
            font-size: @fontSizeSix;
            text-align: left;
            .wallet-search-contents-main {
              .wallet-search-contents-img {
                margin-left: 65px;
                .wallet-search-contents-img-single {
                  height: 0;
                  width: 30px;
                  padding-bottom: 100%;
                  background: url("../../../../../static/images/wallet/single_2.png");
                }
                .wallet-search-contents-img-multiple {
                  height: 0;
                  width: 30px;
                  padding-bottom: 100%;
                  background: url("../../../../../static/images/wallet/multiple_2.png");
                }
              }
            }
            .wallet-search-contents-item {
              float: left;
            }
            .wallet-search-contents-img {
              float: left;
              height: 30px;
              width: 30px;
            }
          }
          .wallet-search-contents-middle {
            float: left;
            width: 34%;
            text-align: center;
            font-size: @fontSizeSix;
          }
          .wallet-search-contents-right {
            float: right;
            height: 30px;
            width: 33%;
            text-align: right;
            .wallet-search-contents-main-right {
              padding-left: 24px;
              float: right;
            }
            .wallet-search-contents-img-right {
              float: right;
              height: 30px;
              width: 30px;
            }
          }
          .wallet-search-contents-main {
            line-height: 30px;
            font-size: @fontSizeSix;
          }
          .wallet-search-contents-sub {
            clear: both;
            padding-top: 14px;
            line-height: 30px;
            font-size: @fontSizeNine;
          }
        }
      }
    }
    .wallet-search-list-btn {
      padding: 60px 30px;
      height: 130px;
      text-align: center;
      font-size: @fontSizeFive;
      .transfer {
        float: left;
        height: 70px;
        line-height: 70px;
        width: 47.62%;
        color: #FFF;
        background: @warningColor;
        border-radius: 35px;
      }
      .receive {
        float: right;
        height: 70px;
        line-height: 70px;
        width: 47.62%;
        background: #23A622;
        color: #FFF;
        border-radius: 35px;
      }
    }
  }
</style>

<style lang="less">
  @import '~@/assets/styles/varibles.less';
  .wallet-search-list {
    .wallet-search-list-title {
      .v-text-field__slot {
        padding-left: 5px;
        font-size: @fontSizeEight;
      }
    }
  }
</style>
