# electron wallet
[![Build Status](https://travis-ci.org/motopig/electron-wallet.svg?branch=master)](https://travis-ci.org/motopig/electron-wallet)
> An electron-vue project

#### Build Setup

``` bash
Dependencies
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

### 比特币多签钱包流程
![多签流程](/static/images/btc_multsig_process.png)
由流程图可以确认多签交易流程需要后端参与，目前只提交了前端electron代码, 后端可以自行完善。
