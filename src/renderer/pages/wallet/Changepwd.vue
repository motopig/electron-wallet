<template>
  <div class="wallet-changepwd">
    <Header
      headerTitle="修改支付密码"
      :backward=back
    ></Header>
    <div class="wallet-changepwd-items">
      <div class="wallet-changepwd-item">
        <p class="wallet-changepwd-main">原支付密码</p>
        <div class="wallet-changepwd-sub">
          <input class="wallet-changepwd-text" v-model="oldPassword" type="password" placeholder="请输入原支付密码">
        </div>
      </div>
      <div class="wallet-changepwd-item">
        <p class="wallet-changepwd-main">新支付密码</p>
        <div class="wallet-changepwd-sub">
          <input class="wallet-changepwd-text" v-model="newPassword" type="password" placeholder="请输入新密码">
        </div>
      </div>
      <div class="wallet-changepwd-item">
        <p class="wallet-changepwd-main">确认新支付密码</p>
        <div class="wallet-changepwd-sub">
          <input class="wallet-changepwd-text" v-model="confirmNewPassword" type="password" placeholder="请再次输入新密码">
        </div>
      </div>
    </div>
    <PwdInfo></PwdInfo>
    <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
    <v-list class="wallet-changepwd-btn">
      <button class="next-btn" @click="toNext">确认</button>
    </v-list>
  </div>
</template>
<script>
  import { ethers } from 'ethers';
  import Store from 'electron-store';
  import Header from '@/common/Header';
  import Base from '@/config/base';
  import Des from '@/libs/des';
  import PwdInfo from './components/PwdInfo';

  export default {
    components: {
      Header,
      PwdInfo,
    },
    data() {
      return {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        alias: '',
        back: '',
        coin: '',
        eth: {
          keystore: '',
          mnemonic: '',
          address: '',
          privatekey: '',
          backup: false,
        },
        isLoading: false,
      };
    },
    methods: {
      toNext() {
        this.isLoading = true;
        if (this.newPassword !== this.confirmNewPassword) {
          this.notify('请确认新密码是否一致');
        } else if (this.coin === 'eth') {
          // 获取当前eth钱包信息
          const store = new Store();
          const coin = this.coin.toUpperCase();
          const walletList = `${Base.walletList}_${this.$store.state.user.id}_${coin}`;
          const treasure = store.get(walletList);
          const boss = treasure[this.address];
          // console.log(boss);
          try {
            const privatekey = Des.decrypt(boss.privatekey, this.oldPassword);
            this.eth.mnemonic = Des.decrypt(boss.mnemonic, this.oldPassword);
            // console.log(this.eth.mnemonic);
            if (privatekey) {
              const wallet = new ethers.Wallet(privatekey);
              wallet.encrypt(this.newPassword).then((json) => {
                this.eth.keystore = json;
                this.createEthByPwd(json);
              });
            } else {
              this.notify('原密码不正确!');
            }
          } catch (e) {
            this.notify('原密码不正确!');
          }
        } else {
          // todo btc
        }
        this.isLoading = false;
      },
      notify(msg) {
        this.$toast(msg, {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
      },
      ethCb(wallet) {
        this.eth.mnemonic = Des.encrypt(this.eth.mnemonic, this.newPassword);
        this.eth.address = Des.encrypt(wallet.address, this.newPassword);
        this.eth.privatekey = Des.encrypt(wallet.privateKey, this.newPassword);
        this.eth.backup = false;
        const data = this.eth;
        // save wallet to store
        this.saveWalletToStore(wallet.address, data);
      },
      createEthByPwd(keystore) {
        ethers.Wallet.fromEncryptedJson(keystore, this.newPassword).then(this.ethCb);
      },
      saveWalletToStore(address, data) {
        const coin = this.coin.toUpperCase();
        const walletList = `${Base.walletList}_${this.$store.state.user.id}_${coin}`;
        const store = new Store();
        const old = store.get(walletList);
        const copy = Object.assign(old, { [address]: data });
        store.set(walletList, copy);
        this.notify('更新成功!');
      },
    },
    mounted() {
      this.back = `/wallet/info/${this.$route.query.coin}/${this.$route.query.address}?alias=${this.$route.query.alias}&id=${this.$route.query.id}`;
      this.coin = this.$route.query.coin;
      this.address = this.$route.query.address;
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-changepwd {
    .wallet-changepwd-items {
      margin-top: 30px;
      .wallet-changepwd-item {
        margin: 0 30px;
        height: 120px;
        .wallet-changepwd-main {
          padding: 0 30px;
          color: @darkColor;
          font-size: @fontSizeFive;
          height: 72px;
          line-height: 72px;
        }
        .wallet-changepwd-sub {
          padding: 0 30px;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid @borderBottomColor;
          .wallet-changepwd-text {
            height: 30px;
            line-height: 30px;
            width: 100%;
            font-size: @fontSizeEight;
            color: @greyColor;
          }
        }
      }
    }
    .wallet-changepwd-btn {
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
