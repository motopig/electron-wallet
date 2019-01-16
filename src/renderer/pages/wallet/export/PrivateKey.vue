<template>
  <div class="wallet-export-privatekey">
    <Header
      headerTitle="导出私钥"
      :backward=back
    ></Header>
    <p class="privatekey-title">私钥</p>
    <div class="privatekey-content">
      <textarea class="privatekey-area" v-model="privateKey" readonly="readonly"></textarea>
    </div>
    <div class="privatekey-items">
      <div class="privatekey-icon"></div>
      <div class="privatekey-item">
        <p class="privatekey-p">私钥未经加密，导出存在风险，建议使用助记词和keystore进行备份。</p>
      </div>
    </div>
    <div class="privatekey-btns">
      <button class="copy-btn"
          v-clipboard:copy="privateKey"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">复制
      </button>
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
        back: `/wallet/info/${this.$route.params.coin}/${this.$route.params.address}?alias=${this.$route.query.alias}&id=${this.$route.query.id}`,
        privateKey: this.$route.query.words,
      };
    },
    methods: {
      onCopy() {
        this.$toast('复制成功', {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
      },
      onError() {
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-export-privatekey {
    .privatekey-title {
      margin: 60px 16px 60px 60px;
      font-size: @fontSizeFour;
      color: @darkColor;
    }
    .privatekey-content {
      margin: 0 30px;
      .privatekey-area {
        padding: 30px;
        height: 360px;
        width: 100%;
        border: 1px solid @darkColor;
        border-radius: 10px;
        font-size: @fontSizeEight;
        color: @greyColor;
      }
    }
    .privatekey-items {
      margin: 30px;
      .privatekey-icon {
        margin-top: 4px;
        margin-left: 15px;
        float: left;
        background-color: @warningColor;
        width: 16px;
        height: 16px;
        border-radius: 8px;
      }
      .privatekey-item {
        margin-left: 45px;
        .privatekey-p {
          font-size: @fontSizeNine;
          line-height: 24px;
          letter-spacing: 1.5px;
          color: @greyColor;
        }
      }
    }
    .privatekey-btns {
      padding: 80px 30px 60px 30px;
      height: 70px;
      .copy-btn {
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
