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

import Label from '../data-models/label';

// data is raw doc from PouchDB / CouchDB.
class LabelMapper {
  static mapDataToLabel(rawLabel: any) {
    return new Label(rawLabel._id, rawLabel._rev, rawLabel.name, rawLabel.description, rawLabel.labelId);
  }
}

export default LabelMapper;