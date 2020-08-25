import {Luxafor} from 'node-luxafor2';

class LuxaforUtils {
  constructor() {
    this.luxafor = null;
    this.active = false;
  }

  // Try to start Luxafor, if init fails, we assume we don't have a luxafor device attached.
  init() {
    try {
      this.luxafor = new Luxafor();
      this.luxafor.init();
      this.active = true;
    } catch (error) {
      console.log('Failed to init luxafor, disabling!')
      this.luxafor = null;
      this.active = false;
    }
  }

  color(ledGroup, red, green, blue) {
    if (this.active) {
      this.luxafor.color(ledGroup, red, green, blue);
    }
  }
}

export default LuxaforUtils;
