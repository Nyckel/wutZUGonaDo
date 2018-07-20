import { app, BrowserWindow, screen, ipcMain, globalShortcut } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win, settings, serve, height, width, lastShortcutCall;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

try {

  app.on('ready', () => {
    // createWindows();
    createWindow();
    createShortcut();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}


function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  lastShortcutCall = new Date();

  // Create the browser window.
  win = new BrowserWindow({
      width: 400,
      height: 600,
      show: false,
      icon:__dirname+'/assets/img/icon.png',
      frame: false,
      transparent: true,
      resizable: true,
      minWidth: 400,
      minHeight: 305
  });
  win.setMenuBarVisibility(false);

  if (serve) {
    require('electron-reload')(__dirname, {
     electron: require(`${__dirname}/node_modules/electron`)});
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  //win.webContents.openDevTools();

  win.setPosition(size.width - 400, size.height - 600,true);
  win.once('ready-to-show', () => {
    win.show();
  
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  initIPCListeners();
}


function initIPCListeners() {
  ipcMain.on('openSettings', (event, arg) => {
    settings.show();
  });
  ipcMain.on('closeSettings', (event, arg) => {
    settings.hide();
    win.focus();
  });

  ipcMain.on('quitApp', (event, arg) => {
    win.close();
  })
  win.on('close', (event) => {
    // event.preventDefault();
    // settings.close();
    // settings = null;
    win = null;
    // win.hide();
    app.quit();
  });

}

function createShortcut() {
  const ret = globalShortcut.register('CommandOrControl+W', () => {
    let now =  new Date();
    let delay = now.getTime() - lastShortcutCall.getTime();
    
    if (delay > 400) {
      lastShortcutCall = now;

      if (win.isVisible() && !win.isMinimized() && win.isFocused()) {
        win.hide();
      } else {
        win.show();
      }
    }
  })

  if (!ret) {
    console.log('shortcut registration failed')
  }
}