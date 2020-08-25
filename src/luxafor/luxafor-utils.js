import {Luxafor} from 'node-luxafor2';

class LuxaforUtils {
  constructor() {
    this.luxafor = null;
  }

  // Try to start Luxafor, if init fails, we assume we don't have a luxafor device attached.
  init() {
    try {
      this.luxafor = new Luxafor();
      this.luxafor.init();
    } catch (error) {
      console.log('Failed to init luxafor, disabling!')
      this.luxafor = null;
    }
  }
}

export default LuxaforUtils;
