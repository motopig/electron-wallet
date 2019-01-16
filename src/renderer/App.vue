<template>
  <div id="app" class="app" data-app=true>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'electron-wallet',
  };
</script>

<style lang="less">
  .app {
    font-family: "PingFangSC-Regular","Microsoft Yahei";
  }
</style>
