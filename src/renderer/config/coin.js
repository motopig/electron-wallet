export default {
  web3: {
    baseUrl: 'https://infura.io',
  },
  btc: {
    main: {
      feeUrl: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
      unspentUrl: 'https://blockchain.info/unspent?cors=true&active=',
      // publishUrl: 'https://blockexplorer.com/api/tx/send',
      publishUrl: 'https://chain.api.btc.com/v3/tools/tx-publish',
      balanceUrl: 'https://blockchain.info/balance?cors=true&active=',
      txUrl: 'https://blockchain.info/rawtx/',
    },
    test: {
      feeUrl: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
      unspentUrl: 'https://testnet.blockchain.info/unspent?cors=true&active=',
      publishUrl: 'https://testnet.blockchain.info/pushtx',
      balanceUrl: 'https://testnet.blockchain.info/balance?cors=true&active=',
      txUrl: 'https://testnet.blockchain.info/rawtx/',
    },
  },
  usdt: {
    main: {
      txUrl: 'https://api.omniexplorer.info/v1/transaction/tx/',
      publishUrl: 'https://api.omniexplorer.info/v1/transaction/pushtx/',
      unspentUrl: 'https://insight.bitpay.com/api/addr/', // ${address}/utxo/
      balanceUrl: 'https://api.omniexplorer.info/v1/address/addr/',
      feeUrl: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
    },
    test: {
      txUrl: 'https://api.omniexplorer.info/v1/transaction/tx/',
      publishUrl: 'https://api.omniexplorer.info/v1/transaction/pushtx/',
      unspentUrl: 'https://test-insight.swap.online/insight-api/addr/', // ${address}/utxo/
    },
  },
  eth: {
    main: {
      feeUrl: 'https://ethgasstation.info/json/ethgasAPI.json',
      balanceUrl: 'https://api.etherscan.io/api?module=account&action=balance&tag=latest&address=',
      txUrl: 'https://api.blockcypher.com/v1/eth/main/txs/',
    },
    test: {
      balanceUrl: 'https://api-rinkeby.etherscan.io/api?module=account&action=balance&tag=latest&address=',
    },
    bytecode: '',
    abi: [],
  },
};
