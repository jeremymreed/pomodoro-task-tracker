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

import electronSettings from 'electron-settings';

// This class will execute the Pomodoro technique.
// The timer will ask this class for the 'next setting for the timer'.
// This class determines what that should be.

// Definitions:
// A Set has a number of Intervals.
// An Interval is a number of phases.
// A Phase is some duration of time. (number of seconds);
class Pomodoro {
  constructor() {
    // These are in seconds.
    this.currentPhase = 0;
    // TODO: These should be in a settings file.  Something like settings.json.
    this.pomodoro = electronSettings.getSync('pomodoro');
    this.shortRest = electronSettings.getSync('shortRest');
    this.longRest = electronSettings.getSync('longRest');

    this.intervalsInSet = electronSettings.getSync('intervalsInSet');
    this.interval = 0;
    this.intervalArray = [];

    this.setupInterval();
  }

  setupInterval() {
    if (this.interval !== this.intervalsInSet - 1) {
      this.intervalArray.push({type: 'Rest', title: 'Short Rest', length: this.shortRest});
    } else {
      this.intervalArray.push({type: 'Rest', title: 'Long Rest', length: this.longRest});
    }

    this.intervalArray.push({type: 'Work', title: 'Work', length: this.pomodoro});
  }

  // Returns current phase.
  // For initial state, call this one.
  getCurrentTimerSetting() {
    return (this.currentPhase);
  }

  // Goes to next phase, starts that phase.
  getNextTimerSetting() {
    if (this.intervalArray.length === 0) {
      if (this.interval === this.intervalsInSet - 1) {
        this.interval = 0;
      } else {
        this.interval = this.interval + 1;
      }
      this.setupInterval();
    }

    this.currentPhase = this.intervalArray.pop();
    return (this.currentPhase);
  }
}

export default Pomodoro;
