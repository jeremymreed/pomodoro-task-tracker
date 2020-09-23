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

class TimeConverter {
  static getAsDays(durationInSeconds: moment.Duration): string {
    if (Math.trunc(durationInSeconds.asDays()) < 10) {
      return `0${Math.trunc(durationInSeconds.asDays())}`;
    } else {
      return `${Math.trunc(durationInSeconds.asDays())}`;
    }
  }

  static getHours(durationInSeconds: moment.Duration): string {
    if (durationInSeconds.hours() < 10) {
      return `0${durationInSeconds.hours()}`;
    } else {
      return `${durationInSeconds.hours()}`;
    }
  }

  static getAsMinutes(durationInSeconds: moment.Duration): string {
    if (Math.trunc(durationInSeconds.asMinutes()) < 10) {
      return `0${Math.trunc(durationInSeconds.asMinutes())}`;
    } else {
      return `${Math.trunc(durationInSeconds.asMinutes())}`;
    }
  }

  static getMinutes(durationInSeconds: moment.Duration): string {
    if (durationInSeconds.minutes() < 10) {
      return `0${durationInSeconds.minutes()}`;
    } else {
      return `${durationInSeconds.minutes()}`;
    }
  }

  static getSeconds(durationInSeconds: moment.Duration): string {
    if (durationInSeconds.seconds() < 10) {
      return `0${durationInSeconds.seconds()}`;
    } else {
      return `${durationInSeconds.seconds()}`;
    }
  }
}

export default TimeConverter;
