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

import { v4 as uuidv4 } from 'uuid';

// TODO: Should we consider adding getters/setters, and avoid directly accessing these data members directly from code?
class Label {
  _id: string
  _rev: string
  type: string
  name: string
  description: string
  labelId: string

  constructor(id = uuidv4(), rev = '', name = '', description = '', label = '') {
    this._id = id;
    this._rev = rev;
    this.type = 'label';
    this.name = name;
    this.description = description;
    this.labelId = label;
  }
}

export default Label
