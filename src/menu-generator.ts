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

import { Menu, dialog } from 'electron';

class MenuGenerator {
  static getMenu(window: any, version: any) {
    const template: any = [
      {
        label: 'File',
        submenu: [
          {role: 'quit'}
        ]
      },
      {
        label: 'Settings',
        submenu: [
          {
            label: 'Edit Settings',
            click: () => {
              window.webContents.send('showEditSettingsView');
            }
          }
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'About',
            click: () => {
              dialog.showMessageBoxSync(
                {
                  title: 'About this app',
                  message: `This application is a task tracker, using the pomodoro technique to track time spent on tasks. \n See https://en.wikipedia.org/wiki/Pomodoro_Technique\n Version: ${version}`,
                  buttons: ['Close'],
                });
            }
          },
          {
            label: 'Toggle Developer Tools',
            click: () => {
              window.webContents.openDevTools();
            }
          }
        ]
      }
    ];

    return Menu.buildFromTemplate(template);
  }
}

export default MenuGenerator;