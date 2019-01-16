import CryptoJS from 'crypto-js';
import TripleDes from 'crypto-js/tripledes';

export default {
  encrypt(source, pwd) {
    return TripleDes.encrypt(source, pwd).toString();
  },

  decrypt(enc, pwd) {
    return TripleDes.decrypt(enc, pwd).toString(CryptoJS.enc.Utf8);
  },
};

