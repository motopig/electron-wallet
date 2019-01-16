import Vue from 'vue';
import Router from 'vue-router';
import WalletLp from '@/pages/wallet/WalletLp';
import Wallet from './wallet';

Vue.use(Router);

const routes = [
  {
    // /
    path: '/',
    redirect: '/wallet',
  },
  {
    // wallet
    path: '/wallet',
    component: WalletLp,
    children: Wallet,
  },
];

const router = new Router({
  // mode: 'history',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
