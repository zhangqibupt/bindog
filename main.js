const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1200, height: 800, icon: __dirname + '/app/images/logo.icns' });
  mainWindow.loadFile('app/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
