const { app, BrowserWindow, Menu, webFrame, screen } = require('electron')
const path = require('path')
const openAboutWindow = require('about-window').default;
const contextMenu = require('electron-context-menu');
const appData = require("./package.json");
const join = require('path').join;

const createWindow = () => {
  const zoomFactor = 0.8
  const display = screen.getPrimaryDisplay()
  const minimumResolution = {
    width: 1366,
    height: 768,
  }
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.maximize()

  contextMenu({
    window: mainWindow,
    prepend: (defaultActions, params, browserWindow) => [],
    showInspectElement: false,
    showSearchWithGoogle: false,
    showSelectAll: false,
  });

  const template = [
    {
      label: "File",
      submenu: [
        { role: "minimize" },
        { role: "close" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "zoomIn" },
        { role: "zoomOut" },
        { role: "resetZoom" },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About This App',
          click: () =>
              openAboutWindow({
                  icon_path: join(__dirname, 'img/icon.png'),
                  product_name: appData.productName,
                  win_options: {
                    titleBarStyle: "hidden",
                    resizable: false,       
                  },
              }),
        },
        {
          role: 'quit',
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  if (display.size.width <= minimumResolution.width && display.size.height <= minimumResolution.height) {
    webFrame.setZoomFactor(zoomFactor)
  }
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
