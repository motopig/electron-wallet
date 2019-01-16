<template>
  <div class="wallet-exprot-pwdconfirm">
    <Header
        headerTitle="密码验证"
        :backward=back
    ></Header>
    <div class="wallet-exprot-pwdconfirm-name">
      <p class="wallet-exprot-pwdconfirm-main">输入支付密码</p>
      <div class="wallet-exprot-pwdconfirm-sub">
        <input class="wallet-exprot-pwdconfirm-text" v-model="password" type="password" placeholder="请输入当前钱包支付密码">
      </div>
    </div>
    <PwdInfoTwo></PwdInfoTwo>
    <v-list class="wallet-exprot-pwdconfirm-btn">
      <button class="next-btn" @click="toNext">下一步</button>
    </v-list>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Store from 'electron-store';
  import Base from '../../../config/base';
  import Des from '../../../libs/des';
  import PwdInfoTwo from '../components/PwdInfoTwo';

  export default {
    components: {
      Header,
      PwdInfoTwo,
    },
    data() {
      return {
        password: '',
        address: this.$route.params.address,
        coin: this.$route.params.coin,
        alias: this.$route.query.alias,
        type: this.$route.query.type, // record 备份助记词 private 私钥
        back: `/wallet/info/${this.$route.params.coin}/${this.$route.params.address}?alias=${this.$route.query.alias}&id=${this.$route.query.id}`,
        words: '',
      };
    },
    methods: {
      toNext() {
        // todo check password
        const store = new Store();
        const coin = this.coin.toUpperCase();
        const walletList = `${Base.walletList}_${this.$store.state.user.id}_${coin}`;
        const treasure = store.get(walletList);
        const boss = treasure[this.address];
        if (this.coin === 'btc' || this.coin === 'usdt') {
          try {
            this.privateKey = Des.decrypt(boss.address0.privateKey, this.password);
            this.words = Des.decrypt(boss.words, this.password);
          } catch (e) {
            this.notify('钱包密码不正确');
          }
        } else {
          try {
            this.privateKey = Des.decrypt(boss.privatekey, this.password);
            this.words = Des.decrypt(boss.mnemonic, this.password);
          } catch (e) {
            this.notify('钱包密码不正确');
          }
        }
        if (this.words) {
          let data = '';
          if (this.type === 'record') {
            data = this.words;
          } else if (this.type === 'private') {
            data = this.privateKey;
          }
          this.$router.push(`/wallet/backsingle/${this.type}/${this.coin}/${this.address}?alias=${this.alias}&words=${data}&id=${this.$route.query.id}`);
        } else {
          this.notify('钱包密码不正确');
        }
      },
      notify(msg) {
        this.$toast(msg, {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-exprot-pwdconfirm {
    .wallet-exprot-pwdconfirm-name {
      margin: 30px 30px 0 30px;
      height: 120px;
      .wallet-exprot-pwdconfirm-main {
        padding: 0 30px;
        color: @darkColor;
        font-size: @fontSizeFive;
        height: 72px;
        line-height: 72px;
      }
      .wallet-exprot-pwdconfirm-sub {
        padding: 0 30px;
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid @borderBottomColor;
        .wallet-exprot-pwdconfirm-text {
          height: 30px;
          line-height: 30px;
          width: 100%;
          font-size: @fontSizeEight;
          color: @greyColor;
        }
      }
    }
    .wallet-exprot-pwdconfirm-btn {
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
