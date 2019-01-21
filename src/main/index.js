import { app, BrowserWindow } from 'electron'; // eslint-disable-line
import { autoUpdater } from 'electron-updater';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 750,
    useContentSize: true,
    width: 600,
    minWidth: 600,
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
function sendUpdateMessage(message, data) {
  mainWindow.webContents.send('update-message', { message, data });
}
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates();
});
// 阻止程序关闭自动安装升级
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.on('error', (data) => {
  sendUpdateMessage('error', data);
});
// 有可用更新
autoUpdater.on('update-available', (data) => {
  sendUpdateMessage('update-available', data);
});
// 已经最新
autoUpdater.on('update-not-available', (data) => {
  sendUpdateMessage('update-not-available', data);
});
// 更新下载进度事件
autoUpdater.on('download-progress', (data) => {
  sendUpdateMessage('download-progress', data);
});
autoUpdater.on('update-downloaded', () => {
  sendUpdateMessage('update-downloaded', {});
  app.once('update-now', () => {
    autoUpdater.quitAndInstall();
  });
});
