const { app, BrowserWindow, Menu } = require('electron');

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname);
}

let mainWindow = null;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: __dirname + '/app/images/logo.icns',
    webPreferences: {
      nodeIntegration: true, // 👈 enables require
      contextIsolation: false, // 👈 required for nodeIntegration to work
    },
  });
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile('app/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  // Create the Application's main menu
  const template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'About Application',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function () { app.quit(); },
        },
      ],
    }, {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:',
        },
        { label: 'Search', accelerator: 'CmdOrCtrl+F' },
        { label: 'Clear All Records', accelerator: 'CmdOrCtrl+R' },
        { label: 'Start Listen', accelerator: 'CmdOrCtrl+D' },
        {
          label: 'Toggle Dev Tools',
          accelerator: 'F12',
          click: () => {mainWindow.webContents.toggleDevTools();},
        },
        {
          label: 'Toggle Dev Tools',
          accelerator: 'CmdOrCtrl+Option+I',
          click: () => {mainWindow.webContents.toggleDevTools();},
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
