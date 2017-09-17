import { app, BrowserWindow, screen, ipcMain, globalShortcut } from 'electron';
import * as path from 'path';

let win, settings, serve, height, width, lastShortcutCall;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindows() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  lastShortcutCall = new Date();

  win = createWindow("index", true, 400, 600);
  // settings = createWindow("options", false, 800, 600);
  win.setPosition(size.width - 400, size.height - 600,true);
  win.once('ready-to-show', () => {
    win.show()
  })
  // win.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  if (serve) {
    // win.webContents.openDevTools();
  }
  initIPCListeners();
}

function createWindow(filename, isVisible, wid, hei) {
  let bw = new BrowserWindow({
      width: wid,
      height: hei,
      show: isVisible,
      icon:__dirname+'/assets/img/icon.png',
      frame: false,
      transparent: true,
      resizable: true,
      minWidth: 400,
      minHeight: 305
  });
  
  bw.loadURL('file://' + __dirname + '/' + filename + '.html');
  bw.setMenuBarVisibility(false);
  return bw;

}

try {

  app.on('ready', () => {
    createWindows();

    const ret = globalShortcut.register('CommandOrControl+W', () => {
      let now =  new Date();
      let delay = now.getTime() - lastShortcutCall.getTime();
      
      if (delay > 400) {
        lastShortcutCall = now;

        if (win.isVisible() && !win.isMinimized()) {
          win.hide();
        } else {
          win.show();
        }
      }
    })
  
    if (!ret) {
      console.log('shortcut registration failed')
    }
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
      createWindows();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
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