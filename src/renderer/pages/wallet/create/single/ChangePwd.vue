<template>
  <div class="list">
    <Header
      headerTitle="修改支付密码"
      backward="/wallet"
    ></Header>
    <v-list>
        <v-list-tile class="list-tile first">
            <v-list-tile-content class="list-tile-content">
              <v-list-tile-title class="list-tile-title">原支付密码</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile class="list-tile">
            <v-list-tile-content class="list-tile-content">
              <input class="item-middleright" v-model="oldPassword" type="password" placeholder="请输入原支付密码">
            </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
            <v-list-tile-content class="list-tile-content">
              <v-list-tile-title class="list-tile-title">新支付密码</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile class="list-tile">
            <v-list-tile-content class="list-tile-content">
              <input class="item-middleright" v-model="newPassword" type="password" placeholder="请输入新密码">
            </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
            <v-list-tile-content class="list-tile-content">
              <v-list-tile-title class="list-tile-title">确认新支付密码</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile class="list-tile">
            <v-list-tile-content class="list-tile-content">
              <input class="item-middleright" v-model="confirmNewPassword" type="password" placeholder="请再次输入新密码">
            </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <v-list-tile class="list-tile">
            <v-list-tile-content class="list-tile-content">
              <v-list-tile-title class="list-tile-title">钱包别名</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile class="list-tile">
            <v-list-tile-content class="list-tile-content">
              <input class="item-middleright" v-model="alias"  placeholder="请输入钱包名">
            </v-list-tile-content>
        </v-list-tile>
        <v-divider class="divider"></v-divider>
        <PwdInfo></PwdInfo>
        <v-list class="create-btn"><button @click="toNext">创建</button></v-list>
    </v-list>
  </div>
</template>>
<script>
  import Header from '@/common/Header';
  import PwdInfo from '../../components/PwdInfo';

  export default {
    components: {
      Header,
      PwdInfo,
    },
    data() {
      return {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        alias: '',
      };
    },
    methods: {
      toNext() {
      },
    },
    mounted() {
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .list {
    margin-left: 30px;
    margin-top: 30px;
    .divider {
      margin: 0 30px 0 30px;
    }
    .list-tile {
      margin-right: 48px;
      .list-tile-content {
        color: @darkColor;
        .list-tile-title {
          font-size: @fontSizeEight;
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .first {
      div {
        padding: 0;
      }
    }
    .create-btn {
      margin-top: 250px;
      margin-bottom: 30px;
      margin-left: 50px;
      margin-right: 50px;
      height: 40px;
      width: 80%;
      background: #FF7C2C;
      color: #FFF;
      border-radius: 50px;
      font-size: @fontSizeEight;
      letter-spacing: 30px;
      text-align: center;
      padding-top: 5px;
    }
  }
</style>
