<template>
  <div class="tx">
    <Header
      headerTitle="交易详情"
      backward="/my/wallet"
    ></Header>
    
    <v-list class="list">
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title>发款方: </v-list-tile-title>
            <v-list-tile-sub-title>{{ tx.from }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title>收款方: </v-list-tile-title>
            <v-list-tile-sub-title>{{ tx.to }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title>转账数量: </v-list-tile-title>
            <v-list-tile-sub-title>{{ tx.amount }} {{ coin }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title>手续费: </v-list-tile-title>
            <v-list-tile-sub-title>{{ tx.fee }} {{ coin === 'USDT' ? 'BTC' : coin  }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title>TXHash: </v-list-tile-title>
            <v-list-tile-sub-title>{{ tx.hash }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title>交易时间: </v-list-tile-title>
            <v-list-tile-sub-title>{{ tx.time }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title>区块: </v-list-tile-title>
            <v-list-tile-sub-title v-model="tx.block">{{ tx.block }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile> -->
        <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title>备注: </v-list-tile-title>
            <v-list-tile-sub-title>{{ tx.remark }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <ball-beat-loader v-if="isLoading" color="#3B78C3"></ball-beat-loader>
    </v-list>
    
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Wallet from '@/api/Wallet';

  export default {
    components: {
      Header,
    },
    data() {
      return {
        tx: {
          from: '',
          to: '',
          fee: '',
          hash: '',
          time: '',
          // block: '',
          amount: 0,
          remark: '',
        },
        coin: '',
        isLoading: true,
        coinusdt: 'USDT',
      };
    },
    methods: {
      fetchTx() {
        Wallet.getWalletTxByHashOrId({
          id: this.txId,
        }).then(this.fetchSuc).catch(this.fetchErr);
      },
      fetchSuc(res) {
        if (res.data) {
          this.tx.from = res.data.transferAddress;
          this.tx.to = res.data.otherAddress;
          this.tx.time = res.data.createTime;
          this.tx.hash = res.data.txHash;
          this.tx.fee = res.data.poundage;
          this.tx.remark = this.hexCharCodeToStr(res.data.remark);
          this.tx.amount = res.data.amount;
          this.isLoading = false;
        } else {
          this.fetchErr();
        }
      },
      fetchErr() {
        this.isLoading = false;
        this.notify('无效交易ID');
      },
      hexCharCodeToStr(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
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
      this.txId = this.$route.params.txid;
      this.coin = this.$route.query.coin;
      this.fetchTx();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .tx {
    .list {
      padding: 30px;
      color: @darkColor;
    }
  }
</style>
