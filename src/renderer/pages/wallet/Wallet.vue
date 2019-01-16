<template>
  <div class="wallet-main">
    <Header
        headerTitle="钱包"
        :forward="'noticeFilter_2'"
        @forwardLink="selectNoticeType"
    ></Header>
    <div class="wallet-mainnotice" v-show="showList">
      <div class="wallet-mainnotice-triangle"></div>
      <div class="wallet-mainnotice-content">
        <div class="wallet-mainnotice-area">
          <img class="wallet-mainnotice-img" src="../../../../static/images/wallet/all_untreated.png">
          <p class="wallet-mainnotice-text">
            <router-link to="/wallet/create" class="wallet-mainnotice-text-p">
              创建钱包
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="wallet-mainimg">
      <div class="wallet-mainimg-head">
        <img class="wallet-mainimg-left" v-if="wallets && !isLoading" @click="prevWallet" src="../../../../static/images/common/left.png"/>
        <img class="wallet-mainimg-left" v-else-if="wallets" src="../../../../static/images/common/left.png"/>
        <v-avatar
                size="120"
                color="grey lighten-4"
        >
          <img src="../../../../static/images/wallet/group.png">
        </v-avatar>
        <img class="wallet-mainimg-right" v-if="wallets && !isLoading" @click="nextWallet" src="../../../../static/images/common/right.png"/>
        <img class="wallet-mainimg-right" v-else-if="wallets" src="../../../../static/images/common/right.png"/>
      </div>
      <p v-if="wallets && typeof wallets[index] !== 'undefined'" class="wallet-mainname">{{ wallets[index].walletAlias }}</p>
      <p v-if="wallets && typeof wallets[index] !== 'undefined'" class="wallet-mainaddress">{{ wallets[index].walletAddress }}
        <img class="qr-code" @click="qrpage" src="../../../../static/images/wallet/qr.png">
      </p>
    </div>
    <v-tabs
        class="wallet-mainname-tabs"
        fixed-tabs
        slider-color="#4979C3"
        v-model="active"
    >
      <v-tab
          class="wallet-mainname-tab"
          v-for="(item, key) in tabNames"
          :key="key"
      >
        {{ item }} <span v-if="key==='0'"></span>
      </v-tab>
      <v-tab-item
          v-for="(item, key) in tabNames"
          :key="key"
      >
        <Pending
            v-if="key==='0' && currentAddress"
            :currentAddress="currentAddress"
            :currentAlias="currentAlias"
            :currentCoin="currentCoin"
            @undoned="undoneBack"
            @startLoading="startLoading"
            @endLoading="endLoading"
        ></Pending>
        <Asset
            v-if="key==='1' && currentCoin && currentAddress"
            :currentAddress="currentAddress"
            :currentCoin="currentCoin"
            :currentType="currentType"
            :currentAlias="currentAlias"
            @startLoading="startLoading"
            @endLoading="endLoading"
        ></Asset>
        <List
            v-if="key==='2' && currentCoin && currentAlias"
            :currentAddress="currentAddress"
            :currentAlias="currentAlias"
            :currentCoin="currentCoin"
            :currentType="currentType"
            @startLoading="startLoading"
            @endLoading="endLoading"
        ></List>
      </v-tab-item>
    </v-tabs>
    <Tabbar></Tabbar>
    <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Tabbar from '@/common/Tabbar';
  import Wallet from '@/api/Wallet';
  import Pending from './components/Pending';
  import Asset from './components/Asset';
  import List from './components/List';
  import dict from '../../config/dict';

  export default {
    components: {
      Header,
      Tabbar,
      Pending,
      Asset,
      List,
    },
    data() {
      return {
        index: 0,
        imgSrc: '',
        tabNames: {
          0: '未处理',
          1: '资产状况',
          2: '交易记录',
        },
        showList: false,
        active: 0,
        currentAddress: '',
        currentAlias: '',
        currentCoin: '',
        currentType: '',
        wallets: null,
        isLoading: 0,
      };
    },
    methods: {
      fetchWallet() {
        this.startLoading();
        if (this.$store.state.wallet.walletindex) {
          this.index = this.$store.state.wallet.walletindex;
        }
        Wallet.selfWallet({
          userId: this.$store.state.user.id,
        }).then(this.selfSucc).catch(this.selfErr);
      },
      selfSucc(res) {
        this.wallets = res.data;
        if (typeof this.wallets[this.index] === 'undefined') {
          this.$store.dispatch('removeWalletindex');
        }
        this.setCurrentWallet();
        this.endLoading();
      },
      selfErr() {
        this.endLoading();
      },
      setCurrentWallet() {
        if (this.wallets) {
          this.currentAddress = this.wallets[this.index].walletAddress;
          this.currentCoin = dict.network[this.wallets[this.index].currencyType];
          this.currentAlias = this.wallets[this.index].walletAlias;
          this.currentType = this.wallets[this.index].type;
        }
      },
      selectNoticeType() {
        this.showList = !this.showList;
      },
      notifyChanged() {
        this.showList = false;
        this.active = 0;
      },
      walletInfo() {
      },
      prevWallet() {
        if (this.index > 0) {
          this.index -= 1;
        } else {
          this.index = this.wallets.length - 1;
        }
        this.$store.dispatch('walletindex', this.index);
        this.setCurrentWallet();
      },
      nextWallet() {
        if (this.index < this.wallets.length - 1) {
          this.index += 1;
        } else {
          this.index = 0;
        }
        this.$store.dispatch('walletindex', this.index);
        this.setCurrentWallet();
      },
      qrpage() {
        this.$router.push({ path: '/wallet/receive', query: { address: this.currentAddress, alias: this.currentAlias } });
      },
      startLoading() {
        this.isLoading += 1;
      },
      endLoading() {
        this.isLoading -= 1;
      },
    },
    mounted() {
      this.fetchWallet();
    },
    created() {
    },
    destroyed() {
      // this.websock.close();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-main {
    .wallet-mainnotice {
      z-index: @zTopOne;
      position: fixed;
      top: 62px;
      right: 20px;
      width: 270px;
      .wallet-mainnotice-triangle {
        z-index: -1;
        position: relative;
        top: -5px;
        left: 215px;
        width: 0;
        height: 0;
        border-left: 25px solid transparent;
        border-right: 25px solid transparent;
        border-bottom: 50px solid #FFF;
        box-shadow: 0 0 0 0 rgba(0,0,0,0.3);
      }
      .wallet-mainnotice-content {
        background: #FFF;
        margin-top: -40px;
        padding: 14px;
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.3);
        .wallet-mainnotice-area {
          padding: 14px;
          line-height: 30px;
          height: 58px;
          .wallet-mainnotice-img {
            float: left;
            width: 30px;
            height: 30px;
          }
          .wallet-mainnotice-text {
            margin-left: 60px;
            font-size: @fontSizeSeven;
            .wallet-mainnotice-text-red {
              color: @upColor;
            }
            .wallet-mainnotice-text-p {
              color: #000;
            }
          }
        }
        .wallet-mainnotice-line {
          height: 1px;
          background: @greyColor;
        }
      }
    }
    .wallet-mainimg {
      margin: 30px 30px 30px 30px;
      text-align: center;
      .wallet-mainimg-head {
        display: flex;
        justify-content: center;
        .wallet-mainimg-left {
          margin-top: 30px;
          margin-right: 60px;
          height: 60px;
          width: 30px;
        }
        .wallet-mainimg-right {
          float: right;
          margin-top: 30px;
          margin-left: 60px;
          height: 60px;
          width: 30px;
        }
      }
    }
    .wallet-mainname {
      clear: both;
      margin: 16px 0 30px 0;
      color: @darkColor;
      text-align: center;
      font-size: @fontSizeSeven;
    }
    .wallet-mainaddress {
      line-height: 30px;
      height: 30px;
      color: @greyColor;
      font-size: @fontSizeNine;
      .qr-code {
        margin-left: 30px;
        line-height: 30px;
        height: 30px;
        width: 30px;
      }
    }
    .wallet-mainname-tabs {
      margin: 0 30px;
      .wallet-mainname-tab {
        padding-bottom: 14px;
        width: 100%;
        color: @darkColor;
        font-size: @fontSizeSix;
        .wallet-mainname-undone {
          color: @upColor;
        }
      }
    }
  }
</style>

<style lang="less">
  .wallet-main {
    .v-tabs__container {
      height: 60px;
    }
  }
</style>
