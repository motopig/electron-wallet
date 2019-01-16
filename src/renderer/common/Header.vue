<template>
  <div>
    <div class="header-emptyline"></div>
    <div class="wallet-header">
      <div class="wallet-header-left">
        <img v-if="hasBackward" src="../../../static/images/common/head_left.png" @click="backwardPage">
      </div>
      <div class="wallet-header-right">
        <img v-if="forward==='noticeFilter_2'" src="../../../static/images/common/notice_2.png" @click="forwardLink">
      </div>
      <div class="wallet-header-middle">
        {{ headerTitle }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      headerTitle: String,
      backward: String || null,
      forward: String || null,
    },
    methods: {
      forwardLink() {
        this.$emit('forwardLink');
      },
      backwardPage() {
        if (this.backward === '#') {
          this.$emit('closeDialog');
        } else if (this.backward) {
          this.$router.push(this.backward);
        } else {
          this.$router.go(-1);
        }
      },
    },
    computed: {
      hasBackward() {
        let hasBackward = true;
        if (this.$router.currentRoute.path === '/wallet') {
          hasBackward = false;
        }
        return hasBackward;
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .header-emptyline {
    height: 80px;
  }
  .wallet-header {
    position: fixed;
    z-index: @zTopThree;
    top: 0;
    left: 0;
    right: 0;
    line-height: 80px;
    height: 80px;
    background: @darkColor;
    color: #FFF;
    .wallet-header-left {
      float: left;
      margin-left: 30px;
      height: 30px;
      width: 18px;
    }
    .wallet-header-middle {
      margin-left: 80px;
      margin-right: 80px;
      text-align: center;
      font-size: @fontSizeSeven;
    }
    .wallet-header-right {
      float: right;
      width: 66px;
      padding-right: 30px;
      text-align: right;
    }
  }
</style>
