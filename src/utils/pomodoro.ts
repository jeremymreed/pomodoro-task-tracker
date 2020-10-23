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

import electronSettings from "electron-settings";
import PhaseType from "../enums/phase-type-enum";

// Extra types for electron-settings/
// TODO: Really should be in a .d.ts file.
type SettingsValue =
  | null
  | boolean
  | string
  | number
  | SettingsObject
  | SettingsValue[];

type SettingsObject = {
  [key: string]: SettingsValue;
};

// This class will execute the Pomodoro technique.
// The timer will ask this class for the 'next setting for the timer'.
// This class determines what that should be.

interface Phase {
  type: PhaseType;
  title: string;
  length: number;
}

const isNumberGuard = (value: SettingsValue): boolean => {
  return (value as number) !== undefined;
};

const getNumber = (value: SettingsValue): number => {
  if (isNumberGuard(value)) {
    return value as number;
  }

  throw new Error("getNumber: Could not convert value to Number!");
};

// Definitions:
// A Set has a number of Intervals.
// An Interval is a number of phases.
// A Phase is some duration of time. (number of seconds);
class Pomodoro {
  currentPhase: Phase | undefined;

  pomodoro: number;

  shortRest: number;

  longRest: number;

  intervalsInSet: number;

  currentInterval: number;

  intervalArray: Phase[];

  constructor() {
    // These are in seconds.
    // TODO: These should be in a settings file.  Something like settings.json.
    this.pomodoro = getNumber(electronSettings.getSync("pomodoro"));
    this.shortRest = getNumber(electronSettings.getSync("shortRest"));
    this.longRest = getNumber(electronSettings.getSync("longRest"));

    this.intervalsInSet = getNumber(electronSettings.getSync("intervalsInSet"));
    this.currentInterval = 0;
    this.intervalArray = [];

    this.setupIntervalArray();
  }

  setupIntervalArray(): void {
    if (this.currentInterval !== this.intervalsInSet - 1) {
      this.intervalArray.push({
        type: PhaseType.REST,
        title: "Short Rest",
        length: this.shortRest,
      });
    } else {
      this.intervalArray.push({
        type: PhaseType.REST,
        title: "Long Rest",
        length: this.longRest,
      });
    }

    this.intervalArray.push({
      type: PhaseType.WORK,
      title: "Work",
      length: this.pomodoro,
    });
  }

  // Returns current phase.
  // For initial state, call this one.
  getCurrentTimerSetting(): Phase | undefined {
    return this.currentPhase;
  }

  // Goes to next phase, starts that phase.
  getNextTimerSetting(): Phase {
    if (this.intervalArray.length === 0) {
      if (this.currentInterval === this.intervalsInSet - 1) {
        this.currentInterval = 0;
      } else {
        this.currentInterval += 1;
      }
      this.setupIntervalArray();
    }

    const nextPhase = this.intervalArray.pop();

    if (nextPhase !== undefined) {
      this.currentPhase = nextPhase;
      return this.currentPhase;
    }

    throw new Error("nextPhase is undefined!");
  }
}

export default Pomodoro;
