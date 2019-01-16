let walletindex = 0;
let ethCreateProcess = null;

try {
  if (localStorage.walletindex) {
    walletindex = localStorage.getItem('walletindex');
  }
  if (localStorage.ethCreateProcess) {
    ethCreateProcess = localStorage.getItem('ethCreateProcess');
  }
} catch (e) {
  console.log(e);
}

const state = {
  walletindex,
  ethCreateProcess,
};

const mutations = {
  character(state, payload) {
    try {
      if (payload.walletindex) {
        state.walletindex = payload.walletindex;
        localStorage.setItem('walletindex', payload.walletindex);
      }
      if (payload.ethCreateProcess) {
        state.ethCreateProcess = payload.ethCreateProcess;
        localStorage.setItem('ethCreateProcess', payload.ethCreateProcess);
      }
    } catch (e) {
      console.log(e);
    }
  },
  removeCharacter(state, payload) {
    try {
      if (payload.item) {
        switch (payload.item) {
          case 'walletindex':
            state.walletindex = '';
            localStorage.removeItem('walletindex');
            break;
          case 'ethCreateProcess':
            state.ethCreateProcess = '';
            localStorage.removeItem('ethCreateProcess');
            break;
          default:
            break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
};

const actions = {
  walletindex(state, payload) {
    state.commit({
      type: 'character',
      walletindex: payload,
    });
  },
  ethCreateProcess(state, payload) {
    state.commit({
      type: 'character',
      ethCreateProcess: payload,
    });
  },
  removeWalletindex(state) {
    state.commit({
      type: 'removeCharacter',
      item: 'walletindex',
    });
  },
  removeethCreateProcess(state) {
    state.commit({
      type: 'removeCharacter',
      item: 'ethCreateProcess',
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
