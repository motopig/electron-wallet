import base from '../config/base';

let websock = null;
let globalCallback = null;

export default{

  initWebSocket(sid, callback) {
    const wssuri = `${base.wssUrl}${sid}`;
    websock = new WebSocket(wssuri);
    globalCallback = callback;
    websock.onmessage = (e => this.websocketonmessage(e));
    // websock.addEventListener('message', (e => this.websocketonmessage(e)));
    websock.onclose = (e => this.websocketonclose(e));
    websock.onopen = (e => this.websocketonopen(e));
    websock.onerror = (e => this.websocketonerror(e));
  },

  sendSock(sid, agentData, callback) {
    globalCallback = callback;
    if (websock === null) {
      this.initWebSocket(sid, (e => this.nothing(e)));
      setTimeout(() => {
        this.sendSock(agentData, callback);
      }, 2000);
    } else if (websock.readyState === websock.OPEN) {
      this.websocketsend(agentData);
    } else if (websock.readyState === websock.CONNECTING) {
      setTimeout(() => {
        this.sendSock(agentData, callback);
      }, 1000);
    } else {
      setTimeout(() => {
        this.sendSock(agentData, callback);
      }, 1000);
    }
  },

  nothing(e) {
    return `connection nothing${e})`;
  },

  addMessageListener(callback) {
    websock.addEventListener('message', (e => callback(e)));
  },

  websocketonmessage(e) {
    globalCallback(JSON.parse(e.data));
  },

  websocketsend(agentData) {
    websock.send(JSON.stringify(agentData));
  },

  websocketonclose(e) {
    return `connection closed${e.code})`;
  },

  websocketonopen(e) {
    return `connection open ${e})`;
  },

  websocketonerror(e) {
    return `connection err ${e})`;
  },
};
