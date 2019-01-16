<template>
  <div class="wallet-multiple-eth-setting">
    <Header
        headerTitle="支持单签设置"
    ></Header>
    <p class="setting-title">选中个人钱包密码</p>
    <div>
      <input class="password" v-model="password" type="password">
    </div>
    <p class="setting-title">签名是否为单人签名</p>
    <div class="setting-select">
      <button class="setting-unselect-btn" :class="{'setting-select-btn': single}" @click="singleSetting(true)">是</button>
      <button class="setting-unselect-btn" :class="{'setting-select-btn': !single}" @click="singleSetting(false)">否</button>
    </div>
    <div v-if="single">
    <p class="setting-title">单日最高转账额度</p>
    <input class="setting-limit" v-model="limit" placeholder="请输入">
    <p class="setting-comment">个ETH</p>
    </div>
    <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
    <div class="setting-btns">
      <button class="commit-btn" @click="multipleEthCreate" :disabled="isLoading">下一步</button>
    </div>
  </div>
</template>

<script>
  import Store from 'electron-store';
  import { ethers } from 'ethers';
  import Header from '@/common/Header';
  import Wallet from '@/api/Wallet';
  // import Dict from '@/config/dict';
  import Base from '@/config/base';
  import Des from '@/libs/des';
  import Coin from '@/config/coin';

  export default {
    components: {
      Header,
    },
    data() {
      return {
        single: false,
        oneSinged: 2, // oneSinged 后端使用 是否支持一个人签名 1:是 2: 否
        limit: 0,
        isLoading: false,
        password: '',
        address: '',
        storeData: null,
        data: null,
        old: null,
        provider: 'homestead', // homestead 主网  rinkeby 测试网
      };
    },
    methods: {
      singleSetting(single) {
        this.single = single;
        if (single === false) {
          this.limit = 0;
        } else {
          this.oneSinged = 1;
        }
      },
      async deployTroamContract(privateKey, troamContractModel) {
        const defaultProvider = ethers.getDefaultProvider(this.provider);
        const myWallet = new ethers.Wallet(privateKey, defaultProvider);
        const factory = new ethers.ContractFactory(Coin.eth.abi, Coin.eth.bytecode, myWallet);
        let contract = '';
        try {
          contract = await factory.deploy(
            troamContractModel.owners, troamContractModel.required,
            troamContractModel.mustSigners,
            ethers.utils.parseEther(troamContractModel.dailyLimit.toString()),
          );
        } catch (e) {
          console.log(e.message);
          // 暂时只发现了钱包余额不足的报错信息
          if (e.message.indexOf('insufficient funds') !== -1) {
            this.notify('个人钱包余额不足');
          }
          return;
        }
        this.address = contract.address;
        console.log(this.address);
        await contract.deployed();
        // new
        const store = new Store();
        this.storeData = {
          [this.address]: {
            self: this.data.self,
            other: this.data.other,
            confirmNum: this.data.confirmNum,
            alias: this.data.alias,
            supportSingle: this.single,
            dailyLimit: this.limit,
          },
        };
        if (Object.prototype.hasOwnProperty.call(this.old, this.address) === false) {
          const copy = Object.assign(this.old, this.storeData);
          const walletList = `${Base.walletList}_${this.$store.state.user.id}_ETH`;
          store.set(walletList, copy);
          console.log(copy);
        } else {
          // todo duplicate case
        }
        let contacts = `[${this.data.self[0].walletAddress},`;
        Object.keys(this.data.other).forEach((item) => {
          contacts += `${this.data.other[item].walletAddress},`;
        });
        contacts = contacts.substring(0, (contacts.length - 1));
        contacts += ']';
        Wallet.saveMultWallet({
          walletAlias: this.data.alias,
          walletAddress: this.address,
          userEmail: this.$store.state.user.email,
          projectId: this.$store.state.fund.projectid,
          status: 1,
          type: 2, // 1 单签 2 多签
          contactList: contacts,
          passNum: this.data.confirmNum,
          userId: this.$store.state.user.id,
          walletSource: 1, // 1 自我创建 2 相继导入 3 参与多签
          publicKey: '',
          currencyType: '01',
          signAddress: this.data.self[0].walletAddress,
          mustSignAddressList: `[${this.data.must.walletAddress}]`,
          oneSinged: this.oneSinged,
          maxAmount: this.limit,
        }).then(this.saveSucc).catch(this.saveErr);
        this.isLoading = false;
      },
      check() {
        if (!this.password) {
          return false;
        }
        if (this.single && !this.limit) {
          return false;
        }
        return true;
      },
      multipleEthCreate() {
        if (!this.check()) {
          this.notify('请检查输入参数!');
        } else {
          this.isLoading = true;
          this.data = JSON.parse(this.$store.state.wallet.ethCreateProcess);
          const store = new Store();
          const walletList = `${Base.walletList}_${this.$store.state.user.id}_ETH`;
          this.old = store.get(walletList);
          try {
            const selfPrivateKey = Des.decrypt(
              this.old[this.data.self[0].walletAddress].privatekey,
              this.password,
            );
            if (selfPrivateKey) {
              const addresses = [];
              const mustSingerList = [];
              mustSingerList.push(this.data.must.walletAddress);
              this.data.all.forEach((item) => {
                addresses.push(item.walletAddress);
              });
              const contractModel = {
                owners: addresses,
                required: this.data.confirmNum,
                mustSigners: mustSingerList,
                dailyLimit: this.limit,
              };
              this.deployTroamContract(selfPrivateKey, contractModel);
            } else {
              this.notify('密码不正确!');
            }
          } catch (e) {
            this.notify('密码不正确!');
          }
        }
      },
      saveSucc(res) {
        // 清除上一个创建页面的数据
        this.$store.dispatch('ethCreateProcess', JSON.stringify({}));
        if (res.resultCode === '200') {
          this.$router.push('/wallet');
          this.notify('创建成功');
        } else {
          this.notify(res.resultMsg);
        }
      },
      saveErr() {
        this.notify('创建失败，请重新创建!');
      },
      notify(message) {
        this.$toast(message, {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
        this.isLoading = false;
      },
    },
    mounted() {
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-multiple-eth-setting {
    margin: 46px 60px 0 60px;
    .setting-title {
      height: 60px;
      line-height: 60px;
      font-size: @fontSizeFive;
      color: @darkColor;
    }
    .password {
      height: 30px;
      line-height: 30px;
      width: 100%;
      font-size: @fontSizeEight;
      color: @greyColor;
      border-bottom: 1px solid;
    }
    .setting-select {
      height: 106px;
      padding: 16px 30px 30px 30px;
      .setting-unselect-btn {
        margin-right: 30px;
        height: 60px;
        width: 150px;
        border-radius: 30px;
        font-size: @fontSizeFive;
        color: @greyColor;
        border: 1px solid @greyColor;
      }
      .setting-select-btn {
        color: @warningColor;
        border: 1px solid @warningColor;
      }
    }
    .setting-limit {
      float: left;
      margin: 16px 30px;
      padding: 10px;
      height: 60px;
      line-height: 60px;
      border: 1px solid @greyColor;
      border-radius: 5px;
      text-align: center;
      font-size: @fontSizeFive;
      color: @greyColor;
    }
    .setting-comment {
      flex: 1;
      margin: 16px;
      height: 60px;
      line-height: 60px;
      font-size: @fontSizeFive;
      color: @greyColor;
    }
    .setting-btns {
      clear: both;
      position: fixed;
      left: 60px;
      right: 60px;
      bottom: 60px;
      .commit-btn {
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
