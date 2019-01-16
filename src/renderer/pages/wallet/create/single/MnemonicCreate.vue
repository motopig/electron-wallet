<template>
    <v-list class="mnemonic">
      <v-list-tile class="list-tile first">
          <v-list-tile-content class="list-tile-content">
            <v-list-tile-title class="list-tile-title">填写助记词导入钱包</v-list-tile-title>
          </v-list-tile-content>
      </v-list-tile>
      <v-list-tile class="list-tile morehigh">
          <v-list-tile-content class="list-tile-content">
            <textarea rows="3" cols="100" class="item-middleright textarea"  v-model="mnemonic"  placeholder="按空格分隔助记词"></textarea>
          </v-list-tile-content>
      </v-list-tile>

      <v-list-tile class="list-tile first">
          <v-list-tile-content class="list-tile-content">
            <v-list-tile-title class="list-tile-title">选择路径</v-list-tile-title>
          </v-list-tile-content>
      </v-list-tile>
      <!-- <v-list-tile class=""> -->
          <!-- <v-list-tile-content class=""> -->
      <!-- <v-radio-group v-model="column" column>
        <v-radio label="Option 1" value="radio-1"></v-radio>
        <v-radio label="Option 2" value="radio-2"></v-radio>
      </v-radio-group>  -->
            <v-radio-group v-model="path" column class="path">
              <v-radio label="m/44'/0'/0'/0/0" value="1"></v-radio>
              <v-radio label="m/44'/60'/0'/0/0" value="2"></v-radio>
              <v-radio label="m/44'/0'/0'/0/0" value="3"></v-radio>
            </v-radio-group>
          <!-- </v-list-tile-content>
      </v-list-tile> -->

      <v-list-tile class="list-tile first">
          <v-list-tile-content class="list-tile-content">
            <v-list-tile-title class="list-tile-title">设置支付密码</v-list-tile-title>
          </v-list-tile-content>
      </v-list-tile>
      <v-list-tile class="list-tile">
          <v-list-tile-content class="list-tile-content">
            <input class="item-middleright" v-model="password" type="password" placeholder="请输入支付密码">
          </v-list-tile-content>
      </v-list-tile>
      <v-divider class="divider"></v-divider>
      <v-list-tile class="list-tile">
          <v-list-tile-content class="list-tile-content">
            <v-list-tile-title class="list-tile-title">确认支付密码</v-list-tile-title>
          </v-list-tile-content>
      </v-list-tile>
      <v-list-tile class="list-tile">
          <v-list-tile-content class="list-tile-content">
            <input class="item-middleright" v-model="confirmPassword" type="password" placeholder="请再次输入密码">
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
      <v-list class="create-btn"><button @click="toNext">导入</button></v-list>
    </v-list>
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
        mnemonic: '',
        path: [],
        password: '',
        confirmPassword: '',
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
  .mnemonic {
    .path {
      margin-left: 20px;
    }
    .divider {
      margin: 0 30px 0 30px;
    }
    .list-tile {
      margin-right: 48px;
      .list-tile-content {
        color: @darkColor;
        .textarea {
          border: 1px solid grey;
          padding: 5px;
        }
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
    .intr {
      color: @greyColor;
      line-height: 1.5;
      .num {
        color:orange;
        margin-right: 10px;
        float: left;
        .one {
          background-color: red;
          width: 10px;
          height: 10px;
          border-radius: 10px;
          margin-top: 35px;
          margin-left: 30px;
        }
        .two {
          background-color: red;
          width: 10px;
          height: 10px;
          border-radius: 10px;
          margin-top: 62px;
          margin-left: 30px;
        }
      }
      .two {
        float: left;
        margin: 30px 30px 0 -30px;
        .t {
          margin-top: 10px;
        }
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
