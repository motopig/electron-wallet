<template>
  <div class="wallet-export-record">
    <Header
      headerTitle='记录助记词'
    ></Header>
    <div class="wallet-export-comment-items">
      <div class="wallet-export-comment-icon"></div>
      <div class="wallet-export-comment-item">
        <p class="wallet-export-comment-p">助记词用于恢复钱包或者重置钱包密码，将它准确的抄写到纸上，并存放在只有你知道的安全的地方。点击确认后， 钱包将删除该钱包的助记词记录，并不能提供找回助记词的服务。</p>
      </div>
    </div>
    <p class="wallet-export-record-title">抄下你的钱包助记词</p>
    <div class="wallet-export-record-content">
      <div class="wallet-export-items" v-for="item in words.split(' ')">
        <p class="wallet-export-item">{{ item }}</p>
      </div>
    </div>
    <div class="wallet-export-comment-items">
      <div class="wallet-export-comment-icon"></div>
      <div class="wallet-export-comment-item">
        <p class="wallet-export-comment-p">请勿截屏！如果有人获取您的助记词将直接获取您的资产！请抄写助记词并存放在安全的地方！</p>
      </div>
    </div>
    <div class="wallet-export-record-btn">
      <button class="next-btn" @click="toNext">我已经记录下来啦</button>
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
        words: this.$route.query.words,
      };
    },
    methods: {
      toNext() {
        this.$router.push(`/wallet/backsingle/remember?words=${this.words}&coin=${this.$route.params.coin}&address=${this.$route.params.address}`);
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-export-record {
    margin: 30px 0;
    .wallet-export-comment-items {
      clear: both;
      margin: 30px;
      .wallet-export-comment-icon {
        margin-top: 4px;
        margin-left: 15px;
        float: left;
        background-color: @warningColor;
        width: 16px;
        height: 16px;
        border-radius: 8px;
      }
      .wallet-export-comment-item {
        margin-left: 45px;
        .wallet-export-comment-p {
          font-size: @fontSizeNine;
          line-height: 24px;
          letter-spacing: 1.5px;
          color: @greyColor;
        }
      }
    }
    .wallet-export-record-title {
      margin: 26px 60px 32px 60px;
      font-size: @fontSizeFour;
      color: @darkColor;
    }
    .wallet-export-record-content {
      margin: 0 45px;
      height: 228px;
      .wallet-export-items {
        float: left;
        padding: 15px;
        height: 76px;
        width: 25%;
        line-height: 46px;
        text-align: center;
        .wallet-export-item {
          color: @darkColor;
          font-size: @fontSizeEight;
          border: 1px solid @darkColor;
          border-radius: 23px;
        }
      }
    }
    .wallet-export-record-btn {
      padding: 80px 60px 60px 60px;
      height: 210px;
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
