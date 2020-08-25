/*
Copyright © 2020 Jeremy M. Reed

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

import { BrowserWindow, app, ipcMain, Notification } from 'electron';
import path from 'path';
import LuxaforUtils from './luxafor/luxafor-utils';
import MenuGenerator from './menu-generator';
import NotificationOptions from './utils/notification-options';

// TODO: electron-settings is using the remote module, and this is going to be deprecated.
// TODO: We may want to consider using a different system for settings management.
import electronSettings from 'electron-settings';

const notificationOptions = new NotificationOptions();

let mainWindow = null;
const luxaforUtils = new LuxaforUtils();
luxaforUtils.init();

// TODO: This should live in a config module.
// If there are no settings, set our initial setting state.
function initializeSettings() {
  const settings = electronSettings.getSync();

  if (Object.keys(settings).length === 0 && settings.constructor === Object){
    electronSettings.setSync({
      'pomodoro': 25 * 60,
      'shortRest': 5 * 60,
      'longRest': 15 * 60,
      'intervalsInSet': 4,
      'shouldDisplaySeconds': false,
      'databaseFileName': 'data.json',
      'theme': 'light'
    });
  }
}

function initializeDatabase() {
}

// Creates the browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 820,
    height: 650,
    webPreferences: {
      nodeIntegration: true
    }
  })

  initializeSettings();

  initializeDatabase();

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Get rid of default menu on startup.
app.on('browser-window-created', (event, window) => {
  // TODO: Isn't this a little weird?
  window.setMenu(MenuGenerator.getMenu(window, app.getVersion()));
});

// Quit when all the windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until the user quits
// explictly with Cmd + Q.
app.on('window-all-closed', () => {
  // Be sure we've turned the luxafor off.
  luxaforUtils.color(0xff, 0, 0, 0);

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.

ipcMain.on('getData', () => {
});

ipcMain.on('submitTaskData', () => {
});

ipcMain.on('removeTask', () => {
})

ipcMain.on('setLuxaforRest', () => {
  luxaforUtils.color(0xff, 0, 255, 0);
});

ipcMain.on('setLuxaforWork', () => {
  luxaforUtils.color(0xff, 255, 0, 0);
});

ipcMain.on('setLuxaforOff', () => {
  luxaforUtils.color(0xff, 0, 0, 0);
});

ipcMain.on('setLuxaforWorkStrobe', () => {
  luxaforUtils.strobe(0xff, 255, 0, 0, 5, 0);
});

ipcMain.on('setLuxaforRestStrobe', () => {
  luxaforUtils.strobe(0xff, 0, 255, 0, 5, 0);
});

ipcMain.on('showNotification', (event, notificationName) => {
  if (Notification.isSupported()) {
    const options = notificationOptions.getNotification(notificationName);
    const notification = new Notification(options);

    notification.show();
  }
});
