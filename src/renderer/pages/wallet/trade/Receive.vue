<template>
  <div class="receive">
    <Header
      headerTitle="收款码"
      backward="/wallet"
    ></Header>
    <div class="receive-img">
      <v-avatar
          size="120"
          color="grey lighten-4"
      >
        <img src="/static/images/account/group.png">
      </v-avatar>
      <p v-if="alias" class="receive-name">{{ alias }}</p>
      <p v-if="address" class="receive-address">{{ address }}</p>
    </div>
    <qriously class="qr" :value="address" :size="330"/>
    <div class="copy">
      <button type="button" class="copy-btn"
        v-clipboard:copy="address"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError">复制收款人地址
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
        address: '',
        alias: '',
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
    mounted() {
      this.address = this.$route.query.address;
      this.alias = this.$route.query.alias;
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .receive {
    .receive-img {
      margin: 30px 30px 24px 30px;
      text-align: center;
      .receive-img-left {
        float: left;
        margin-top: 30px;
        height: 60px;
        width: 30px;
      }
      .receive-img-right {
        float: right;
        margin-top: 30px;
        height: 60px;
        width: 30px;
      }
      .receive-name {
        margin: 24px 0 60px 0;
        color: @darkColor;
        text-align: center;
        font-size: @fontSizeSeven;
      }
      .receive-address {
        color: @greyColor;
        font-size: @fontSizeNine;
      }
    }
    .qr {
      text-align: center;
      margin-top: 50px;
    }
    .copy {
      text-align: center;
      margin-top: 50px;
      .copy-btn {
        background-color: orangered;
        border-radius: 30px;
        width: 300px;
        height: 50px;
        color:white;
      }
    }
  }
</style>
