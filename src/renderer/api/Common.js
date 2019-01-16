import axios from 'axios';
import store from '../store';
import base from '../config/base';

export default {

  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios(base.url + url, {
        method: 'get',
        data: params,
        headers: {
          token: store.state.user.token ? store.state.user.token : '',
        },
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        if (error.message === 'Network Error') {
          resolve({resultMsg: error.message});
        } else if (error.response && error.response.data) {
          reject(error.response.data);
        }
      });
    });
  },

  post(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios(base.url + url, {
        method: 'post',
        data: params,
        withCredentials: true,
        headers: {
          token: store.state.user.token ? store.state.user.token : '',
        },
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        if (error.message === 'Network Error') {
          resolve({resultMsg: error.message});
        } else if (error.response && error.response.data) {
          reject(error.response.data);
        }
      });
    });
  },

  fetch(url, params = {}, header) {
    return new Promise((resolve, reject) => {
      axios(url, {
        method: 'get',
        data: params,
        headers: header,
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        if (error.message === 'Network Error') {
          resolve({resultMsg: error.message});
        } else if (error.response && error.response.data) {
          reject(error.response.data);
        }
      });
    });
  },

  submit(url, params = {}, header) {
    if (header === null) {
      header = {'Content-Type': 'application/json;charset=UTF-8'};
    }
    return new Promise((resolve, reject) => {
      axios(url, {
        method: 'post',
        data: params,
        headers: header,
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        if (error.message === 'Network Error') {
          resolve({resultMsg: error.message});
        } else if (error.response && error.response.data) {
          reject(error.response.data);
        }
      });
    });
  },

  pushx(url, params = {}, header) {
    return new Promise((resolve, reject) => {
      axios(url, {
        method: 'post',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transformRequest: [function (data) {
          let ret = '';
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }],
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        if (error.message === 'Network Error') {
          resolve({resultMsg: error.message});
        } else if (error.response && error.response.data) {
          reject(error.response.data);
        }
      });
    });
  },

  dataRequest(opt, cb) {
    const request = require('request');
    return request.post(opt, this.reqHandler(cb));
  },

  reqHandler(cb) {
    return (error, response, body) => {
      if ( !cb ) return;
      if ( error ) return cb(error, {});
      if ( response && response.statusCode !== 200 ) return cb(response, {});
      return cb(null, JSON.parse(body));
    }
  },
};
