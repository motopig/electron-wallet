<template>
  <div class="wallet-create">
    <Header
        headerTitle="选择类型"
        backward="/my/wallet"
    ></Header>
    <div class="btns">
      <div class="left both">
        <div class="one" @click="toNext('singlecreate', 'ETH')">
          <img src="../../../../../static/images/common/add.png"/>
          <button>ETH单签</button>
        </div>
        <div class="two" @click="toNext('singlecreate', 'BTC')">
          <img src="../../../../../static/images/common/add.png"/>
          <button>BTC单签</button>
        </div>
        <div class="two" @click="toNext('singlecreate', 'USDT')">
          <img src="../../../../../static/images/common/add.png"/>
          <button>USDT单签</button>
        </div>
      </div>
      <div class="right both">
        <div class="one" @click="toNext('eth/multiplecreate')">
          <img src="../../../../../static/images/common/add.png"/>
          <button>ETH多签</button>
        </div>
        <div class="two" @click="toNext('btc/multiplecreate')">
          <img src="../../../../../static/images/common/add.png"/>
          <button>BTC多签</button>
        </div>
        <div class="two" @click="toNext('usdt/multiplecreate')">
          <img src="../../../../../static/images/common/add.png"/>
          <button>USDT多签</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/common/Header';

  export default {
    components: {
      Header,
    },
    data() {
      return {
      };
    },
    methods: {
      toNext(url, type) {
        if (type) {
          this.$router.push({ path: `/wallet/${url}`, query: { coin: type } });
        } else {
          this.$router.push({ path: `/wallet/${url}` });
        }
      },
    },
    mounted() {
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-create {
    .btns {
      margin-top: 60px;
      .left {
        float:left;
        margin-left: 30px;
        width: 42vw;
      }
      .right {
        float:right;
        margin-right: 32px;
        width: 42vw;
      }
      .both {
        text-align: center;
        div {
          color: @darkColor;
          font-size: @fontSizeSix;
          margin-bottom: 50px;
          padding-top: 45px;
          height: 120px;
          opacity: 1;
          background: rgba(255,255,255,1);
          box-shadow: 0 3px 10px 0 rgba(0,0,0,0.15);
          img {
            margin-right: 20px;
          }
        }
      }
    }
  }
</style>
