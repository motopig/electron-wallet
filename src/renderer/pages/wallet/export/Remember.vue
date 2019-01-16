<template>
  <div class="wallet-export-remember">
    <Header
        headerTitle='备份助记词'
    ></Header>
    <v-dialog
        persistent
        content-class="wallet-export-remember-dialog"
        v-model="showDialog"
        max-width="84vw"
    >
      <div v-if="check">
        <p class="remember-dialog-title">您的钱包已经备份成功</p>
        <img class="remember-dialog-image" src="../../../../../static/images/common/ok.png">
        <p class="remember-dialog-sub-title">确保您备份的助记词放置在安全的地方，如果该应用删除，不记得助记词，您的钱包资产将不会恢复。</p>
        <button class="remember-dialog-btn" @click="returnOk">我知道了</button>
      </div>
     <div v-else>
       <p class="remember-dialog-title">备份失败</p>
       <img class="remember-dialog-image" src="../../../../../static/images/common/warning.png">
       <p class="remember-dialog-sub-title">正确地写下你的助记词很重要，如果你的钱包出了 问题，你需要它来恢复你的钱，请检查并再试一次。</p>
       <button class="remember-dialog-btn" @click="returnNg">我知道了</button>
     </div>
    </v-dialog>
    <div class="word-selected">
      <div class="wallet-export-items" v-for="(item, key) in select">
        <p class="wallet-export-item" @click="remove(key)">{{ item }}</p>
      </div>
    </div>
    <p class="wallet-export-remember-text">请将下面的助记词按照顺序选择出来</p>
    <div class="word-unselected">
      <div class="wallet-export-items" v-for="item in unselectOrder">
        <p class="wallet-export-item wallet-export-item-select" v-if="unselect[item].flag" @click="add(item)">{{ unselect[item].value }}</p>
        <p class="wallet-export-item wallet-export-item-selectd" v-else>{{ unselect[item].value }}</p>
      </div>
    </div>
    <div class="remember_btn" v-if="select.length === unselect.length">
      <button class="up-btn cancel" @click="rememberCancel">清除</button>
      <button class="up-btn toremember" @click="remember">确认</button>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Store from 'electron-store';
  import Base from '../../../config/base';

  export default {
    components: {
      Header,
    },
    data() {
      return {
        words: this.$route.query.words,
        select: [],
        unselect: [],
        unselectOrder: [],
        check: false,
        showDialog: false,
        coin: '',
        address: '',
      };
    },
    methods: {
      setUnselect() {
        this.$route.query.words.split(' ').forEach((item, key) => {
          this.unselect.push({
            value: item,
            flag: true,
          });
          this.unselectOrder.push(key);
        });
      },
      updateUnselectOrder() {
        let swapFrom = this.unselectOrder.length - 1;
        let swapTo;
        while (swapFrom) {
          swapTo = Math.floor(Math.random() * swapFrom);
          [
            this.unselectOrder[swapFrom],
            this.unselectOrder[swapTo],
          ] = [
            this.unselectOrder[swapTo],
            this.unselectOrder[swapFrom],
          ];
          swapFrom -= 1;
        }
      },
      add(key) {
        this.select.push(this.unselect[key].value);
        this.unselect[key].flag = false;
        this.updateUnselectOrder();
      },
      remove(key) {
        let unselectIndex = 0;
        while (unselectIndex < this.unselect.length) {
          if (this.unselect[unselectIndex].value === this.select[key]) {
            this.unselect[unselectIndex].flag = true;
            break;
          }
          unselectIndex += 1;
        }
        let index = key;
        while (index < this.select.length) {
          this.select[index] = this.select[index + 1];
          index += 1;
        }
        this.select = this.select.slice(0, this.select.length - 1);
        this.$forceUpdate();
        this.updateUnselectOrder();
      },
      remember() {
        let words = '';
        this.select.forEach((item) => {
          if (words) {
            words = `${words} `;
          }
          words = `${words}${item}`;
        });
        this.check = words === this.words;
        this.showDialog = true;
      },
      rememberCancel() {
        this.select = [];
        this.unselect = [];
        this.unselectOrder = [];
        this.setUnselect();
      },
      returnOk() {
        // 更新钱包助记词备份状态
        const store = new Store();
        const coin = this.coin.toUpperCase();
        const walletList = `${Base.walletList}_${this.$store.state.user.id}_${coin}`;
        const treasure = store.get(walletList);
        const boss = treasure[this.address];
        // 设置为已经备份的状态
        boss.backup = true;
        const copy = Object.assign(treasure, { [this.address]: boss });
        store.set(walletList, copy);
        this.showDialog = false;
        this.$router.push('/my/wallet');
      },
      returnNg() {
        this.showDialog = false;
      },
    },
    mounted() {
      this.coin = this.$route.query.coin;
      this.address = this.$route.query.address;
      this.setUnselect();
      this.updateUnselectOrder();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-export-remember {
    margin: 60px 30px;
    .wallet-export-remember-text {
      padding: 30px 30px 0 30px;
      height: 60px;
      line-height: 30px;
      color: @darkColor;
      font-size: @fontSizeFive;
    }
    .word-selected, .word-unselected {
      height: 256px;
      padding: 14px 15px;
      line-height: 76px;
    }
    .word-selected {
      border: 2px solid @darkColor;
      border-radius: 10px;
    }
    .wallet-export-items {
      float: left;
      padding: 15px;
      height: 76px;
      width: 25%;
      line-height: 46px;
      text-align: center;
      font-size: @fontSizeEight;
      .wallet-export-item {
        border: 2px solid @darkColor;
        border-radius: 23px;
      }
      .wallet-export-item-select {
        color: @warningColor;
        border: 2px solid @warningColor;
        border-radius: 23px;
      }
      .wallet-export-item-selectd {
        color: #8FA1B3;
        background: #EFEFF5;
        border: 0
      }
    }
    .remember_btn {
      position: absolute;
      left: 60px;
      right: 60px;
      bottom: 30px;
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
      .toremember {
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
  .wallet-export-remember-dialog {
    padding: 60px 60px 32px 60px;
    background: #FFF;
    text-align: center;
    color: @darkColor;
    border-radius: 10px;
    .remember-dialog-title {
      height: 30px;
      line-height: 30px;
      font-size: @fontSizeFour;
    }
    .remember-dialog-image {
      margin: 32px 0;
      height: 90px;
      width: 90px;
    }
    .remember-dialog-sub-title {
      text-align: left;
      font-size: @fontSizeEight;
      line-height: 30px;
    }
    .remember-dialog-btn {
      margin: 48px 0 32px 0;
      height: 60px;
      width: 100%;
      font-size: @fontSizeSix;
      color: @warningColor;
      border: 2px solid @warningColor;
      border-radius: 30px;
    }
  }
</style>
