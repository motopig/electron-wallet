<template>
  <div class="wallet-trade-transferpwd">
    <Header
        headerTitle="输入支付密码"
        :backward=back
    ></Header>
    <div class="wallet-trade-transferpwd-list">
      <div class="wallet-trade-transferpwd-items">
        <div class="list-title-content">
          <div class="list-title">当前钱包支付密码</div>
          <div class="list-sub-title">
            <input v-model="pwd" type="password" placeholder="请输入支付密码">
          </div>
        </div>
      </div>
    </div>
    <PwdInfoTwo></PwdInfoTwo>
    <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
    <v-list class="transfer-btn">
      <button class="up-btn" :disabled="isLoading" @click="toNext">提交</button>
    </v-list>
  </div>
</template>

<script>
  import Store from 'electron-store';
  import Header from '@/common/Header';
  import Base from '@/config/base';
  import Common from '@/api/Common';
  import Wallet from '@/api/Wallet';
  import Coin from '@/config/coin';
  import Dict from '@/config/dict';
  import Des from '@/libs/des';
  import { ethers } from 'ethers';
  import PwdInfoTwo from '../../../components/PwdInfoTwo';

  export default {
    components: {
      Header,
      PwdInfoTwo,
    },
    data() {
      return {
        pwd: '',
        address: '',
        to: '',
        amount: 0,
        remark: '',
        fee: 0,
        coin: '',
        privateKey: '',
        isLoading: false,
        txId: '',
        back: '',
        txhash: '',
        balance: 0,
        first: false,
        pendingId: 0,
        singleAddress: '',
        multWallet: null,
        pubKeys: [],
        fellow: '',
        isLast: false,
        oneSinged: false,
        tokenName: '',
        provider: 'homestead', // homestead 主网 rinkeby 测试网
      };
    },
    methods: {
      toNext() {
        this.isLoading = true;
        if (this.balance === 0) {
          this.notify('账户余额为0');
        } else {
          const store = new Store();
          const walletListKey = `${Base.walletList}_${this.$store.state.user.id}_ETH`;
          const walletList = store.get(walletListKey);
          let from = null;
          this.multWallet.ownerAddressList.forEach((item) => {
            this.fellow += `${item},`;
            if (Object.prototype.hasOwnProperty.call(walletList, item) === true) {
              from = walletList[item];
              this.singleAddress = item;
            }
          });
          if (!from) {
            this.singleAddress = this.multWallet.creatorAddress;
            from = walletList[this.singleAddress];
          }
          this.fellow = this.fellow.substring(0, (this.fellow.length - 1));
          try {
            this.privateKey = Des.decrypt(from.privatekey, this.pwd);
            if (this.privateKey === '') {
              this.notify('钱包密码不正确');
            } else if (this.oneSinged === true) {
              this.subSingleSignTansfer(
                this.privateKey,
                this.address,
                this.to,
                this.amount,
                this.remark,
              ).then(() => {
                this.updateBackend();
              });
            } else if (this.oneSinged === false && this.first === true) {
              this.subMultiSignTransfer(
                this.privateKey,
                this.address,
                this.to,
                this.amount,
                this.remark,
              ).then(() => {
                this.getTxId(this.privateKey, this.address).then(() => {
                  this.createBackend();
                });
              });
            } else {
              this.getTxId(this.privateKey, this.address).then(() => {
                this.confirmTx(this.privateKey, this.address, this.txId).then(() => {
                  this.updateBackend();
                });
              });
            }
          } catch (e) {
            this.notify('钱包密码不正确');
          }
        }
      },
      getBalance() {
        this.isLoading = true;
        const opt = {
          url: `${Coin.eth.main.balanceUrl}${this.address}`,
        };
        Common.dataRequest(opt, this.balanceSuc);
      },
      balanceSuc(err, res) {
        if (res.message === 'OK') {
          this.balance = res.result / 1000000000000000000;
        }
        this.isLoading = false;
      },
      balanceErr() {
        this.isLoading = false;
      },
      async submitTokenTransfer(
        addressPrivatekey,
        contractAddress, tokenAddress, targetAddress, value, datastr,
      ) {
        const defaultProvider = ethers.getDefaultProvider(this.provider);
        const localwallet = new ethers.Wallet(addressPrivatekey, defaultProvider);
        const deployedContract = new ethers.Contract(contractAddress, Coin.eth.abi, defaultProvider);
        const contractWithSigner = deployedContract.connect(localwallet);
        const transferTx = await contractWithSigner.subTokenTransfer(
          tokenAddress,
          targetAddress,
          ethers.utils.parseEther(value.toString()),
          ethers.utils.toUtf8Bytes(datastr),
        );
        await transferTx.wait();
        console.dir(transferTx);
      },
      async subSingleSignTansfer(addressPrivatekey, contractAddress, targetAddress, value, datastr) {
        const defaultProvider = ethers.getDefaultProvider(this.provider);
        const localwallet = new ethers.Wallet(addressPrivatekey, defaultProvider);
        const deployedContract = new ethers.Contract(contractAddress, Coin.eth.abi, defaultProvider);
        const contractWithSigner = deployedContract.connect(localwallet);
        const tx = await contractWithSigner.submitSingleSignTransaction(
          targetAddress,
          ethers.utils.parseEther(value.toString()),
          ethers.utils.toUtf8Bytes(datastr),
        );
        await tx.wait();
        this.txhash = tx.hash;
      },
      async subMultiSignTransfer(addressPrivatekey, contractAddress, targetAddress, value, datastr) {
        const defaultProvider = ethers.getDefaultProvider(this.provider);
        const localwallet = new ethers.Wallet(addressPrivatekey, defaultProvider);
        const deployedContract = new ethers.Contract(contractAddress, Coin.eth.abi, defaultProvider);
        const contractWithSigner = deployedContract.connect(localwallet);
        const tx = await contractWithSigner.submitTransaction(
          targetAddress,
          ethers.utils.parseEther(value.toString()),
          ethers.utils.toUtf8Bytes(datastr),
        );
        await tx.wait();
        this.txhash = tx.hash;
      },
      async getTxId(addressPrivatekey, contractAddress) {
        const defaultProvider = ethers.getDefaultProvider(this.provider);
        const localwallet = new ethers.Wallet(addressPrivatekey, defaultProvider);
        const deployedContract = new ethers.Contract(contractAddress, Coin.eth.abi, defaultProvider);
        const contractWithSigner = deployedContract.connect(localwallet);
        const bn = await contractWithSigner.getLatestTransactionId();
        const bignumber = new ethers.utils.BigNumber(bn);
        this.txId = bignumber.toNumber();
        console.log(this.txId);
      },
      async confirmTx(addressPrivatekey, contractAddress, txId) {
        const defaultProvider = ethers.getDefaultProvider(this.provider);
        const localwallet = new ethers.Wallet(addressPrivatekey, defaultProvider);
        const deployedContract = new ethers.Contract(contractAddress, Coin.eth.abi, defaultProvider);
        const contractWithSigner = deployedContract.connect(localwallet);
        const tx = await contractWithSigner.confirmTransaction(txId);
        await tx.wait();
        this.txhash = tx.hash;
        console.log(tx.hash);
      },
      updateBackend() {
        Wallet.updateEthMultTransaction({
          id: this.pendingId,
          walletAddress: this.singleAddress,
          isDispose: 2,
          transferAddress: this.address,
          poundage: this.fee,
          remark: this.remark,
          ethTxId: this.txId,
          txHash: this.txhash,
        }).then(this.transSuc).catch(this.transErr);
      },
      createBackend() {
        Wallet.addMoreWalletTxRecordETH({
          userId: this.$store.state.user.id,
          walletId: 0,
          userEmail: this.$store.state.user.email,
          transferAddress: this.address,
          otherAddress: this.to,
          walletType: 2, // 1 单签 2 多签
          status: 1, // 1 正常 2 失效
          isDispose: 2, // 1 未处理 2 待处理 3 已处理
          currentType: Dict.coin[this.coin],
          amount: this.amount,
          itemId: 0,
          projectId: 0,
          isAddressList: `[${this.singleAddress}]`,
          noAddressList: `[${this.fellow}]`,
          txHash: this.txhash,
          ethTxId: this.txId,
          poundage: this.fee,
          operaType: 2, // 1 转入 2 转出
          remark: this.remark,
          blockNumber: '',
          btcSignatures: '',
          refusedAddressList: '',
          txSource: 1, // 交易来源 1.钱包参与者，2.其他
          currencyName: this.tokenName,
        }).then(this.transSuc).catch(this.transErr);
      },
      transSuc(res) {
        // 清空 store transfer 数据
        this.$store.dispatch('transfer', JSON.stringify({}));
        let url = '';
        if (this.isLast === true) {
          this.notify('转账已提交!');
          url = `/wallet/eth/single/tx/${res.data.id}?coin=${this.coin}`;
        } else {
          this.notify('签名成功，等待其他钱包签名!');
          url = '/wallet';
        }
        this.isLoading = false;
        this.notify('转账成功');
        setTimeout(() => {
          this.$router.push(url);
        }, 2000);
      },
      transErr() {
      },
      notify(res) {
        this.$toast(res, {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
        this.isLoading = false;
      },
      fetchMultWalletInfo() {
        Wallet.getMultWalletInfo({
          walletAddress: this.address,
        }).then(this.fetchMultSuc).catch(this.fetchMultErr);
      },
      fetchMultSuc(res) {
        this.multWallet = res.data;
      },
      fetchMultErr() {
      },
    },
    mounted() {
      this.address = this.$route.query.address;
      this.to = this.$route.query.to;
      this.amount = this.$route.query.amount;
      this.remark = this.$route.query.remark;
      if (!this.remark) {
        this.remark = '';
      }
      this.fee = this.$route.query.fee;
      this.coin = this.$route.query.coin;
      this.type = this.$route.query.type;
      this.tokenName = this.$route.query.tokenName;
      if (this.$route.query.single === 'true') {
        this.oneSinged = true;
      }
      if (this.$route.query.first === 'true') {
        this.first = true;
      }
      if (this.$route.query.isapply === 'true') {
        this.isapply = true;
      }
      this.pendingId = this.$route.query.pendingId;
      if (this.first === true) {
        // this.fetchPubkeys();
      } else {
        // check is last sign 只有续签才会有transfer存储，续签签名来自pending页面触发
        const mulTx = JSON.parse(this.$store.state.tx.transfer);
        const unSignArray = mulTx.noAddressList.substring(1, (mulTx.noAddressList - 1)).split(',');
        const SignArray = mulTx.isAddressList.substring(1, (mulTx.isAddressList - 1)).split(',');
        if (unSignArray.length === 1 || (SignArray.length + 1 === mulTx.passNum)) {
          this.isLast = true;
        } else {
          this.isLast = false;
        }
      }
      this.back = `/wallet/transfermul/eth?address=${this.address}&coin=${this.coin}&to=${this.to}&amount=${this.amount}&first=${this.first}&isapply=${this.isapply}&pendingId=${this.pendingId}&fee=${this.fee}&single=${this.oneSinged}&remark=${this.remark}`;
      this.fetchMultWalletInfo();
      this.getBalance();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-trade-transferpwd {
    .wallet-trade-transferpwd-list {
      margin-top: 45px;
      padding: 0 30px;
      .wallet-trade-transferpwd-items {
        height: 120px;
        .list-title-content {
          padding: 0 30px;
          border-bottom: 1px solid @borderBottomColor;
          height: 120px;
          .list-title {
            padding-top: 15px;
            height: 75px;
            line-height: 60px;
            font-size: @fontSizeFive;
            color: @darkColor;
          }
          .list-sub-title {
            height: 45px;
            line-height: 45px;
            font-size: @fontSizeEight;
            color: @greyColor;
          }
        }
      }
    }
    .transfer-btn {
      padding: 60px 30px 30px 30px;
      .up-btn {
        height: 70px;
        width: 100%;
        background: @warningColor;
        color: #FFF;
        border-radius: 35px;
        font-size: @fontSizeFive;
      }
    }
  }
</style>
