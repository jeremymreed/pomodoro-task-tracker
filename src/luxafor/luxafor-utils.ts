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

/*
 * Note: We are ignoring this import.
 * Visual Studio Code cannot load the d.ts file we created in src/types.
 * The compiler handles the .d.ts file just fine, but VS Code will complain.
 * Suppressing this error in VS Code until we find a better workaround.
 */
// @ts-ignore
import {Luxafor} from 'node-luxafor2';

class LuxaforUtils {
  luxafor: Luxafor
  active: boolean

  constructor() {
    this.luxafor = new Luxafor();
    this.active = false;
  }

  // Try to start Luxafor, if init fails, we assume we don't have a luxafor device attached.
  init() {
    try {
      this.luxafor.init();
      this.active = true;
    } catch (error) {
      console.log('Failed to init luxafor, disabling!')
      this.active = false;
    }
  }

  color(ledGroup: number, red: number, green: number, blue: number) {
    this.init();

    if (this.active) {
      this.luxafor.color(ledGroup, red, green, blue);
    }
  }

  strobe(ledGroup: number, red: number, green: number, blue: number, time: number, repeat: number) {
    this.init();

    if (this.active) {
      this.luxafor.strobe(ledGroup, red, green, blue, time, repeat);
    }
  }
}

export default LuxaforUtils;
