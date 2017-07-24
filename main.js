/*!
 * @author xueyangchu
 * @date 2017/7/18
 */
"use strict";


const {app, BrowserWindow, ipcMain} = require('electron');
const path = require("path");
const url = require('url');

const server = require('./app/server');

let win;

function createWindow() {
    win = new BrowserWindow({width: 450, height: 300});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});


ipcMain.on('start', function (e, arg) {
    let result = server.start(arg.path);
    e.sender.send('start-callback', result);
});

ipcMain.on('stop', function (e, arg) {
    let result = server.stop();
    e.sender.send('stop-callback', result);
});

ipcMain.on('setPath', function (e, arg) {

});

