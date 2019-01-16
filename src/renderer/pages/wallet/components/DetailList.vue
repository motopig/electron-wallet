<template>
  <div class="wallet-search-list">
    <Header
      :headerTitle=coinUper
      backward="/wallet"
    ></Header>
    <div class="wallet-search-head">
      <p class="wallet-search-left">类型/名称</p>
      <p class="wallet-search-middle">交易方式/时间</p>
      <p class="wallet-search-right">数量</p>
    </div>
    <router-link :to="item | process(coin)" :key=index v-if="tradeList" v-for="(item, index) in tradeList">
    <!-- <div class="wallet-search-contents" v-if="tradeList" v-for="(item, key) in tradeList" :key="key"> -->
      <div class="wallet-search-contents">
        <div class="wallet-search-contents-hover">
          <div class="wallet-search-item">
            <div class="wallet-search-contents-left">
              <div class="wallet-search-contents-main">
                <div class="wallet-search-contents-img">
                  <img class="wallet-search-contents-img-single" v-if="item.walletType==='1'">
                  <img class="wallet-search-contents-img-multiple" v-if="item.walletType==='2'">
                </div>
              </div>
              <div class="wallet-search-contents-sub">
                <p class="wallet-search-contents-item">{{ item.txHash | hashFilter }}</p>
              </div>
            </div>
            <div class="wallet-search-contents-middle">
              <p class="wallet-search-contents-main">{{ item.operaType | typeFilter }}</p>
              <p class="wallet-search-contents-sub">{{ item.createTime }}</p>
            </div>
            <div class="wallet-search-contents-right">
              <div class="wallet-search-contents-main">
                <p class="wallet-search-contents-main-right">{{ Number(item.amount) }}</p>
                <img class="wallet-search-contents-img-right" v-if="item.currencyName==='BTC'" src="../../../../../static/images/common/btc.png">
                <img class="wallet-search-contents-img-right" v-if="item.currencyName==='ETH'" src="../../../../../static/images/common/eth.png">
              </div>
            </div>
          </div>
        </div>
      </div>
    </router-link>
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
  import Wallet from '@/api/Wallet';

  export default {
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
        coinUper: '',
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
      hashFilter(hash) {
        if (hash !== null && hash.length) {
          const head = hash.substr(0, 6);
          const tail = hash.substr(hash.length - 6);
          return `${head}...${tail}`;
        }
        return '';
      },
      process(item, coin) {
        return `/wallet/btc/single/tx/${item.txHash}?coin=${coin.toLowerCase()}`;
      },
    },
    methods: {
      fetchTx() {
        this.$emit('startLoading');
        Wallet.getWalletTxByAddress({
          contractAddress: this.address,
          currencyName: this.coin.toUpperCase(),
          walletAddress: this.$route.query.address,
        }).then(this.fetchSucc).catch(this.fetchErr);
      },
      fetchSucc(res) {
        if (res.resultCode === '200') {
          this.tradeList = res.data;
        } else {
          this.$toast(res.resultMsg, {
            horizontalPosition: 'center',
            verticalPosition: 'center',
            className: 'wallet-toast',
          });
        }
        this.$emit('endLoading');
      },
      fetchErr() {
        this.$emit('endLoading');
      },
      getTransactionTime(time) {
        const date = new Date(time * 1000);
        let month = date.getMonth() + 1;
        if (month.toString().length < 2) {
          month = `0${month}`;
        }
        let day = date.getDate();
        if (day.toString().length < 2) {
          day = `0${day}`;
        }
        let hour = date.getHours();
        if (hour.toString().length < 2) {
          hour = `0${hour}`;
        }
        let minute = date.getMinutes();
        if (minute.toString().length < 2) {
          minute = `0${minute}`;
        }
        let second = date.getSeconds();
        if (second.toString().length < 2) {
          second = `0${second}`;
        }
        return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
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
      this.address = this.$route.params.address;
      this.alias = this.$route.query.alias;
      this.coin = this.$route.params.coin;
      this.type = this.$route.query.currentType;
      this.coinUper = this.$route.params.coin.toUpperCase();
      this.fetchTx();
      this.getUrl(this.$route.query.address, this.alias, this.coin, this.type);
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
      font-size: 22px;
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
            font-size: 26px;
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
            font-size: 26px;
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
            font-size: 26px;
          }
          .wallet-search-contents-sub {
            clear: both;
            padding-top: 14px;
            line-height: 30px;
            font-size: 20px;
          }
        }
      }
    }
    .wallet-search-list-btn {
      padding: 60px 30px;
      height: 130px;
      text-align: center;
      font-size: 28px;
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
  .wallet-search-list {
    .wallet-search-list-title {
      .v-text-field__slot {
        padding-left: 5px;
        font-size: 22px;
      }
    }
  }
</style>

