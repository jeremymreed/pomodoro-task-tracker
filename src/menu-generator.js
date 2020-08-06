import { Menu } from 'electron';

class MenuGenerator {
  static getMenu() {
    const template = [
      {
        label: 'File',
        submenu: [
          {role: 'quit'}
        ]
      }
    ];

    return Menu.buildFromTemplate(template);
  }
}

export default MenuGenerator;