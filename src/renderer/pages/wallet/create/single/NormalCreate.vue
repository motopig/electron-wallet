<template>
  <div class="wallet-create-single-list">
    <div class="wallet-create-single-list-items">
      <div class="wallet-create-single-list-item">
        <p class="wallet-create-single-list-main">设置支付密码</p>
        <div class="wallet-create-single-list-sub">
          <input class="wallet-create-single-list-text" v-model="password" type="password" placeholder="请输入支付密码">
        </div>
      </div>
      <div class="wallet-create-single-list-item">
        <p class="wallet-create-single-list-main">确认支付密码</p>
        <div class="wallet-create-single-list-sub">
          <input class="wallet-create-single-list-text" v-model="confirmPassword" type="password" placeholder="请再次输入密码">
        </div>
      </div>
      <div class="wallet-create-single-list-item">
        <p class="wallet-create-single-list-main">钱包别名</p>
        <div class="wallet-create-single-list-sub">
          <input class="wallet-create-single-list-text" v-model="alias"  placeholder="请输入钱包名">
        </div>
      </div>
    </div>
    <div class="wallet-create-pwd-info">
      <PwdInfo></PwdInfo>
    </div>
    <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
    <div class="create-btn">
      <button class="up-btn" @click="create" :disabled="isLoading">创建</button>
    </div>
  </div>
</template>
<script>
  import bip32 from 'bip32';
  import bip39 from 'bip39';
  import Store from 'electron-store';
  import bitcoin from 'bitcoinjs-lib';
  import { ethers } from 'ethers';
  import Header from '@/common/Header';
  import Coin from '@/config/coin';
  import Des from '@/libs/des';
  import PwdInfo from '../../components/PwdInfo';

  export default {
    components: {
      Header,
      PwdInfo,
    },
    data() {
      return {
        password: '',
        confirmPassword: '',
        alias: '',
        testnet: true,
        isLoading: false,
        eth: {
          keystore: '',
          mnemonic: '',
          address: '',
          privatekey: '',
          backup: false,
        },
      };
    },
    methods: {
      create() {
        this.isLoading = true;
        // check input
        if (!this.password || !this.confirmPassword || !this.alias) {
          this.notify('请填写所有信息');
          this.isLoading = false;
        } else if (this.password !== this.confirmPassword) {
          this.notify('密码输入不一致');
          this.isLoading = false;
        } else if (this.$route.query.coin === 'BTC' || this.$route.query.coin === 'USDT') {
          const data = {};
          const words = bip39.generateMnemonic(128, null, bip39.wordlists.chinese_simplified);
          const seed = bip39.mnemonicToSeed(words, this.password);
          const root = bip32.fromSeed(seed);
          data.words = Des.encrypt(words, this.password);
          data.seed = Des.encrypt(seed.toString('hex'), this.password);
          data.alias = this.alias;
          data.backup = false;
          data.root = {
            xprv: Des.encrypt(root.toBase58(), this.password),
            xpub: Des.encrypt(root.neutered().toBase58(), this.password),
          };
          const child0 = root.derivePath("m/44'/0'/0'/0/0");
          data.privateKey = Des.encrypt(child0.toWIF(), this.password);
          data.address = this.getAddress(child0);
          data.publicKey = child0.publicKey.toString('hex');
          // save wallet to store
          this.saveWalletToStore(this.getAddress(child0), data);
          // save wallet to backend
          this.saveWalletToBack(this.getAddress(child0), child0.publicKey.toString('hex'));
        } else if (this.$route.query.coin === 'ETH') {
          const wallets = ethers.Wallet.createRandom();
          wallets.encrypt(this.password).then((json) => {
            this.eth.keystore = json;
            this.createEthByPwd(json);
          });
          // this.newWalletFromKeystore(keystore);
        }
      },
      saveWalletToStore(address, data) {
        const walletList = `${Coin.walletList}_${this.$route.query.coin}`;
        const store = new Store();
        let newData = {};
        const old = store.get(walletList);
        if (typeof old === 'undefined') {
          newData = { [address]: data };
          store.set(walletList, newData);
        } else if (Object.prototype.hasOwnProperty.call(old, address) === false) {
          const copy = Object.assign(old, { [address]: data });
          store.set(walletList, copy);
        }
      },
      saveWalletToBack(address, publickey) {
        console.log(address);
        console.log(publickey);
        // Wallet.saveWallet({
        //   walletAlias: this.alias,
        //   walletAddress: address,
        //   userEmail: this.$store.state.user.email,
        //   projectId: this.$store.state.fund.projectid,
        //   status: 1,
        //   type: 1, // 1 单签 2 多签
        //   contactList: '[]',
        //   passNum: 1,
        //   userId: this.$store.state.user.id,
        //   walletSource: 1, // 1 自我创建 2 相继导入 3 参与多签
        //   publicKey: publickey,
        //   currencyType: Dict.coin[this.$route.query.coin],
        // }).then(this.saveSucc).catch(this.saveErr);
      },
      createEthByPwd(keystore) {
        ethers.Wallet.fromEncryptedJson(keystore, this.password).then(this.ethCb);
      },
      ethCb(wallet) {
        this.eth.mnemonic = Des.encrypt(wallet.mnemonic, this.password);
        this.eth.address = wallet.address;
        this.eth.publicKey = Des.encrypt(wallet.privateKey, this.password);
        this.eth.coin = 'ETH';
        this.eth.type = 1;
        this.eth.alias = this.alias;
        const data = this.eth;
        // save wallet to store
        this.saveWalletToStore(wallet.address, data);
        // save wallet to backend
        this.saveWalletToBack(wallet.address, wallet.signingKey.publicKey);
        this.isLoading = false;
      },
      newWalletFromKeystore(keystore) {
        const json = JSON.stringify(keystore);
        ethers.Wallet.fromEncryptedJson(json, this.password).then(this.ethCb);
      },
      saveSucc(res) {
        this.isLoading = false;
        if (res.resultCode === '200') {
          this.$router.push('/wallet');
          this.notify('创建成功');
        } else {
          this.notify(res.resultMsg);
        }
      },
      saveErr() {
        this.notify('创建失败');
      },
      getAddress(node, network) {
        return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address;
      },
      notify(content) {
        this.$toast(content, {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
      },
    },
    mounted() {
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-create-single-list {
    .wallet-create-single-list-items {
      margin-top: 16px;
      .wallet-create-single-list-item {
        height: 120px;
        .wallet-create-single-list-main {
          padding: 0 30px;
          color: @darkColor;
          font-size: @fontSizeFive;
          height: 72px;
          line-height: 72px;
        }
        .wallet-create-single-list-sub {
          padding: 0 30px;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid @borderBottomColor;
          .wallet-create-single-list-text {
            height: 30px;
            line-height: 30px;
            width: 100%;
            font-size: @fontSizeEight;
            color: @greyColor;
          }
        }
      }
    }
    .wallet-create-pwd-info {
      margin: 0 -30px;
    }
    .create-btn {
      padding: 30px;
      width: 100%;
      .up-btn {
        height: 70px;
        width: 100%;
        background: @warningColor;
        color: #FFF;
        border-radius: 35px;
        font-size: @fontSizeFive;
        letter-spacing: 20px;
      }
    }
  }
</style>
