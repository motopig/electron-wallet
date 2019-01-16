<template>
  <div class="wallet-singlecreate">
    <Header
      headerTitle="创建或导入钱包"
      backward="/wallet/create"
    ></Header>
    <v-tabs
        class="group-name-tabs"
        slider-color="#4979C3"
    >
      <v-tab
          class="group-name-tab"
          v-for="(item, key) in tabNames"
          :key="key"
      >
        {{ item }}
      </v-tab>
      <v-tab-item
          v-for="(item, key) in tabNames"
          :key="key"
      >
        <Normal
            v-if="key==='0'"
        ></Normal>
        <!-- <Mnemonic
            v-if="key==='1'"
        ></Mnemonic> -->
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
  import Header from '@/common/Header';
  import Normal from './NormalCreate';
  // import Mnemonic from './MnemonicCreate';

  export default {
    components: {
      Header,
      Normal,
      // Mnemonic,
    },
    data() {
      return {
        tabNames: {
          0: '创建钱包',
          // 1: '助记词导入',
        },
      };
    },
    methods: {
    },
    mounted() {
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-singlecreate {
    .group-name-tabs {
      margin: 46px 30px 0 30px;
    }
    .group-name-tab {
      color: @darkColor;
    }
  }
</style>

<style lang="less">
  @import '~@/assets/styles/varibles.less';
  .wallet-singlecreate {
    .v-tabs__container {
      height: 60px;
    }
    .v-tabs__item {
      margin-bottom: 24px;
      font-size: @fontSizeSix;
    }
  }
</style>
