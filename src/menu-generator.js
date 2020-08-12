import { Menu, dialog } from 'electron';

class MenuGenerator {
  static getMenu(window, version) {
    const template = [
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