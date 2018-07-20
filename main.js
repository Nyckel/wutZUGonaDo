"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win, settings, serve, height, width, lastShortcutCall;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
try {
    electron_1.app.on('ready', function () {
        // createWindows();
        createWindow();
        createShortcut();
    });
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    lastShortcutCall = new Date();
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        width: 400,
        height: 600,
        show: false,
        icon: __dirname + '/assets/img/icon.png',
        frame: false,
        transparent: true,
        resizable: true,
        minWidth: 400,
        minHeight: 305
    });
    win.setMenuBarVisibility(false);
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    //win.webContents.openDevTools();
    win.setPosition(size.width - 400, size.height - 600, true);
    win.once('ready-to-show', function () {
        win.show();
    });
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    initIPCListeners();
}
function initIPCListeners() {
    electron_1.ipcMain.on('openSettings', function (event, arg) {
        settings.show();
    });
    electron_1.ipcMain.on('closeSettings', function (event, arg) {
        settings.hide();
        win.focus();
    });
    electron_1.ipcMain.on('quitApp', function (event, arg) {
        win.close();
    });
    win.on('close', function (event) {
        // event.preventDefault();
        // settings.close();
        // settings = null;
        win = null;
        // win.hide();
        electron_1.app.quit();
    });
}
function createShortcut() {
    var ret = electron_1.globalShortcut.register('CommandOrControl+W', function () {
        var now = new Date();
        var delay = now.getTime() - lastShortcutCall.getTime();
        if (delay > 400) {
            lastShortcutCall = now;
            if (win.isVisible() && !win.isMinimized() && win.isFocused()) {
                win.hide();
            }
            else {
                win.show();
            }
        }
    });
    if (!ret) {
        console.log('shortcut registration failed');
    }
}
