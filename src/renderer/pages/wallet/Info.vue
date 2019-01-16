<template>
  <div class="wallet-info">
    <Header
        headerTitle="钱包管理"
        backward="/my/wallet"
    ></Header>
    <div class="wallet-info-name">
      <p class="wallet-info-name-main">修改钱包名称</p>
      <div class="wallet-info-name-sub">
        <input class="wallet-info-text" v-model="alias" type="text" placeholder="请输入新名称">
      </div>
    </div>
    <v-list class="wallet-list">
      <router-link :to="item.link" :key="index" v-for="(item, index) in list">
        <v-list-tile class="wallet-list-tile">
          <v-list-tile-content class="wallet-list-tile-content">
            <v-list-tile-title class="wallet-list-tile-title">{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action class="wallet-list-tile-action">
            <img src="../../../../static/images/common/right.png" v-if="item.link!==''">
            <span v-if="item.link===''">已备份</span>
          </v-list-tile-action>
        </v-list-tile>
      </router-link>
    </v-list>
    <v-list class="wallet-info-btn">
      <button class="next-btn" @click="toNext">确认</button>
    </v-list>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Wallet from '@/api/Wallet';
  import Store from 'electron-store';
  import Base from '@/config/base';

  export default {
    components: {
      Header,
    },
    data() {
      return {
        backup: false,
        alias: this.$route.query.alias,
        list: [{
          title: '备份助记词',
          link: `/wallet/backsingle/confirmpwd/${this.$route.params.coin}/${this.$route.params.address}?alias=${this.$route.query.alias}&type=record&id=${this.$route.query.id}`,
        }, {
          title: '导出私钥',
          link: `/wallet/backsingle/confirmpwd/${this.$route.params.coin}/${this.$route.params.address}?alias=${this.$route.query.alias}&type=private&id=${this.$route.query.id}`,
        }, {
          title: '修改支付密码',
          link: `/wallet/changepwd?coin=${this.$route.params.coin}&address=${this.$route.params.address}&alias=${this.$route.query.alias}&id=${this.$route.query.id}`,
        }],
      };
    },
    methods: {
      toNext() {
        Wallet.updateWallet({
          id: this.$route.query.id,
          walletAlias: this.alias,
        }).then(this.updateSuc).catch(this.updateErr);
      },
      updateSuc() {
        this.notify('更新成功');
      },
      updateErr() {
        this.notify('更新失败');
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
      const store = new Store();
      const coin = this.$route.params.coin.toUpperCase();
      const walletList = `${Base.walletList}_${this.$store.state.user.id}_${coin}`;
      const treasure = store.get(walletList);
      const boss = treasure[this.$route.params.address];
      this.backup = boss.backup;
      if (boss.backup === true) {
        this.list[0].link = '';
      }
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-info {
    .wallet-info-name {
      margin: 30px 30px 0 30px;
      .wallet-info-name-main {
        padding: 0 30px;
        color: @darkColor;
        font-size: @fontSizeFive;
        height: 48px;
        line-height: 48px;
      }
      .wallet-info-name-sub {
        padding: 0 30px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid @borderBottomColor;
        .wallet-info-text {
          height: 30px;
          line-height: 30px;
          width: 100%;
          font-size: @fontSizeEight;
          color: @greyColor;
        }
      }
    }
    .wallet-list {
      margin: 0 30px 0 30px;
      padding: 0;
      .wallet-list-tile {
        padding-top: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid @borderBottomColor;
        .wallet-list-tile-content {
          color: @darkColor;
          .wallet-list-tile-title {
            padding: 0 30px;
            font-size: @fontSizeFive;
            height: 30px;
            line-height: 30px;
          }
        }
        .wallet-list-tile-action {
          height: 30px;
          padding-left: 38px;
        }
      }
    }
    .wallet-info-btn {
      padding: 80px 30px 60px 30px;
      height: 70px;
      .next-btn {
        height: 70px;
        width: 100%;
        background: @warningColor;
        color: #FFF;
        font-size: @fontSizeFive;
        border-radius: 35px;
      }
    }
  }
</style>

<style lang="less">
  .wallet-info {
    .v-list__tile {
      padding: 0;
    }
  }
</style>
