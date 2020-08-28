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

import moment from 'moment';
import humanizeDuration from 'humanize-duration';

class GhettoProfiler {
  constructor(name) {
    this.name = name;
    this.start = null;
    this.end = null;
  }

  start() {
    if (this.start === null) {
      this.start = moment();
    } else {
      throw new Error('Cannot start running profiler when it has already been started!');
    }
  }

  stop() {
    if (this.start !== null) {
      this.end = moment();
    } else {
      throw new Error('Cannot stop running profiler when it has not been started!');
    }
  }

  status() {
    if (this.start !== null && this.stop !== null) {
      console.log(`Profiler ${this.name} ran for ${humanizeDuration(this.stop.diff(this.start), {round: false, maxDecimalPoints: 0, units: ['h', 'm', 's', 'ms']})}`)
    }
  }
}

export default GhettoProfiler;
