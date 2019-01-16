<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card class="wallet-multiple-create-btc-list">
        <Header
            :headerTitle="title"
            backward="#"
            @closeDialog="back"
        ></Header>
        <div class="content">
          <div class="members" v-if="members && members.length>0" v-for="(item, key) in members">
            <div class="members-left">
              <div v-if="typeof selected[key] === 'undefined'" class="member-unchecked" @click="selectMembers(key ,item)"></div>
              <div v-else class="member-checked" @click="selectMembers(key ,item)"></div>
            </div>
            <div class="members-right">
              <div class="one">
                <p class="member-text">{{ item.walletAlias }}</p>
                <p class="member-text-2">{{ item.userName }}</p>
              </div>
              <p class="two">{{ item.userEmail }}</p>
              <p class="three">{{ item.walletAddress }}</p>
            </div>
          </div>
        </div>
        <div class="multiple-btc-list-btns">
          <button class="back-btn" @click="back">导入</button>
        </div>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import Header from '@/common/Header';
  import Wallet from '@/api/Wallet';

  export default {
    components: {
      Header,
    },
    props: ['listType', 'selectType', 'list', 'coin'],
    data() {
      return {
        dialog: true,
        title: '',
        members: null,
        selected: [],
        emailList: [],
      };
    },
    methods: {
      fetchWallet() {
        switch (this.listType) {
          case 0:
            this.title = '个人账户钱包';
            Wallet.selfWalletByType({
              currencyType: this.coin,
              type: 1, // 1 single 2 mulitlpe
            }).then(this.fetchSucc).catch(this.fetchErr);
            break;
          case 1:
            this.title = '参与者钱包';
            Wallet.otherWallet({
              type: 1, // 1 single 2 mulitlpe
              currencyType: this.coin,
            }).then(this.fetchSucc).catch(this.fetchErr);
            break;
          case 2:
            this.title = '必要决策人';
            this.members = this.list;
            break;
          default:
            break;
        }
      },
      fetchSucc(res) {
        if (res.resultCode === '200') {
          this.members = res.data;
        }
      },
      fetchErr() {
        this.$toast('加载个人钱包失败', {
          horizontalPosition: 'center',
          verticalPosition: 'center',
          className: 'wallet-toast',
        });
      },
      selectMembers(key, item) {
        if (this.selectType === 'single' && typeof this.selected[key] === 'undefined') {
          this.selected = [];
          this.emailList = [];
        }
        if (this.selectType === 'single' || this.selectType === 'multi') {
          if (typeof this.selected[key] === 'undefined') {
            if (this.emailList.indexOf(this.members[key].userEmail) === -1) {
              this.emailList.push(this.members[key].userEmail);
              this.selected[key] = item;
            } else {
              this.$toast('请勾选不同的参与者', {
                horizontalPosition: 'center',
                verticalPosition: 'center',
                className: 'wallet-toast',
              });
            }
          } else {
            delete this.emailList[this.emailList.indexOf(this.members[key].userEmail)];
            delete this.selected[key];
          }
        }
        this.$forceUpdate();
      },
      back() {
        this.dialog = false;
        this.$emit('dialogChecked', this.selected);
      },
    },
    mounted() {
      this.fetchWallet();
    },
  };
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/varibles.less';
  .wallet-multiple-create-btc-list {
    .content {
      padding: 30px;
      .members {
        clear: both;
        border-bottom: 1px solid @borderBottomColor;
        .members-left {
          float: left;
          height: 150px;
          width: 120px;
          padding: 60px 60px 60px 30px;
          .member-checked {
            height: 30px;
            background: @warningColor;
            border: 1px solid #000;
            border-radius: 5px;
          }
          .member-unchecked {
            height: 30px;
            background: #FFF;
            border: 1px solid #000;
            border-radius: 5px;

          }
        }
        .members-right {
          margin-left: 120px;
          padding: 15px 30px;
          color: @greyColor;
          .one {
            font-size: @fontSizeSix;
            line-height: 40px;
            .member-text {
              float: left;
              padding-right: 34px;
            }
            .member-text-2 {
              flex: 1;
            }
          }
          .two {
            line-height: 40px;
            font-size: @fontSizeSix;
          }
          .three {
            font-size: @fontSizeNine;
          }
        }
      }
    }
    .multiple-btc-list-btns {
      padding: 80px 30px 60px 30px;
      .back-btn {
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
