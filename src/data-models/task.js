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

// TODO: Should we consider adding getters/setters, and avoid directly accessing these data members directly from code?
class Task {
  constructor(id = 0, name = '', description = '', timeSpent = 0, done = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.timeSpent = timeSpent;  // In seconds.
    this.done = done;
  }
}

export default Task;
