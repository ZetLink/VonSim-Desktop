const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { openAboutWindow } = require('about-window').default;
const contextMenu = require('electron-context-menu');
const appData = require("./package.json");
const join = require('path').join;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.maximize();

  contextMenu({
    window: mainWindow,
    prepend: (defaultActions, params, browserWindow) => [],
    showInspectElement: false,
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
        { label: `About ${appData.productName}`, 
          click: () =>
            openAboutWindow({
              product_name: appData.productName,
              icon_path: path.join(__dirname, './img/icon.png'),
              copyright: appData.copyright,
              homepage: 'https://vonsim.github.io',
              license: 'GNU',
              win_options: {
                titleBarStyle: "hidden",
                resizable: false,
                open_devtools: false,
              },
            }),
        }
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
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
