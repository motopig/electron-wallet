<template>
  <div class="destop-tabbar">
    <div class="footer-emptyline"></div>
    <div class="wallet-tabbar">
      <div class="wallet">
        <router-link to="/wallet">
          <div v-if="this.$route.path==='/wallet'" class="tab2-selected"></div>
          <div v-else class="tab2-unselected"></div>
        </router-link>
      </div>
      <!-- <div class="my">
        <router-link to="/my">
          <div v-if="this.$route.path==='/my'" class="tab3-selected"></div>
          <div v-else class="tab3-unselected"></div>
        </router-link>
      </div> -->
    </div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .destop-tabbar {
    .footer-emptyline {
      height: 98px;
    }
    .wallet-tabbar {
      position: fixed;
      z-index: @zTopThree;
      bottom: 0;
      width: 100%;
      height: 98px;
      background: #FFF;
      .wallet {
        float: left;
        width: 100%;
      }
      // .my {
      //   float: left;
      //   width: 50%;
      // }
      .tab1-selected, .tab1-unselected, .tab2-selected, .tab2-unselected,.tab3-selected, .tab3-unselected {
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
        height: 98px;
        width: 100%;
        background-color: #F7F7F7;
      }
      .tab2-selected {
          background-image: url("../../../static/images/tabbar/trade_01.png");
      }
      .tab2-unselected {
        background-image: url("../../../static/images/tabbar/trade_02.png");
      }
      .tab3-selected {
        background-image: url("../../../static/images/tabbar/my_01.png");
      }
      .tab3-unselected {
        background-image: url("../../../static/images/tabbar/my_02.png");
      }
    }
  }
</style>
