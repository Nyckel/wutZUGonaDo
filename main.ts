import { app, BrowserWindow, screen, ipcMain, globalShortcut } from 'electron';
import * as path from 'path';

let win, settings, serve, height, width;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindows() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

/*   win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  }); */

  win = createWindow("index", true, 400, 600);
  settings = createWindow("options", false, 800, 600);
  win.setPosition(size.width - 400, size.height - 600,true);
  win.show();
  // win.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  if (serve) {
    win.webContents.openDevTools();
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
      resizable: true
  });
  
  bw.loadURL('file://' + __dirname + '/' + filename + '.html');
  bw.setMenuBarVisibility(false);
  return bw;

}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindows();
    const ret = globalShortcut.register('CommandOrControl+W', () => {
      if (win.isVisible()) {
        win.hide();
      } else {
        let sz = win.getSize();
        win.setSize(0, 0);
        win.show();
        win.setSize(sz[0], sz[1]);
      }
    })
  
    if (!ret) {
      console.log('registration failed')
    }
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
/*     if (process.platform !== 'darwin') {
      app.quit();
    } */
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
  })
  win.on('close', (event) => {
    event.preventDefault();
    // settings.close();
    // settings = null;
    // win = null;
    win.hide();
    // app.quit();
  });
}