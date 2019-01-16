<template>
  <div class="pwd-info-one">
    <div class="intr-items">
      <div class="intr-item-icon"></div>
      <div class="intr-item">
        <p class="intr-p">密码规则：</p>
      </div>
      <div class="intr-item">
        <p class="intr-item-left intr-p">1 至少包含8为字符；</p>
        <p class="intr-item-right intr-p">2 至少包含1个数字；</p>
      </div>
      <div class="intr-item">
        <p class="intr-item-left intr-p">3 至少包含1个大些字母；</p>
        <p class="intr-item-right intr-p">4 不能有空格。</p>
      </div>
    </div>
    <div class="intr-items">
      <div class="intr-item-icon"></div>
      <div class="intr-item">
        <p class="intr-p">您的数字资产收到严格的密码学保护，请谨慎设置并牢记您的支付密码，它是支配钱包的唯一手段。为了保护您的财产安全，钱包将不会记录任何支付密码，也不能提供任何支付密码找回服务。如果您需要更改已经设定的支付密码，您必须提供原有的支付密码，同时请保管好新设置的支付密码。</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
  .pwd-info-one {
    margin: 30px 45px 0 45px;
    color: @greyColor;
    .intr-items {
      margin-bottom: 30px;
      .intr-item-icon {
        margin-top: 4px;
        margin-left: 15px;
        float: left;
        background-color: @warningColor;
        width: 16px;
        height: 16px;
        border-radius: 8px;
      }
      .intr-item {
        margin-left: 45px;
        .intr-item-left {
          float: left;
          width: 45vw;
        }
        .intr-item-right {
          flex: 1;
        }
      }
      .intr-p {
        font-size: @fontSizeNine;
        line-height: 24px;
        letter-spacing: 1.5px;
      }
    }
  }
</style>
