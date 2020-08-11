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

import fs from 'fs';

// TODO: This class is kind of ugly.
class FilePersistence {
  // Load raw data from file.
  static loadFromFile(dbPath) {
    console.log('dbPath: ', dbPath);
    if (!fs.existsSync(dbPath)) {
      FilePersistence.saveToFile(FilePersistence.mapData(0, new Map()), dbPath);
    }

    const rawData = fs.readFileSync(dbPath);
    const jsonData = JSON.parse(rawData);
    return jsonData;
  }

  // Maps data to proper format for writing to file.
  static mapData(nextId, dataMap) {
    const iter = dataMap.values();
    const dataArray = Array();

    let item = iter.next();
    while ( !item.done ) {
      dataArray.push(item.value);
      item = iter.next();
    }

    return (
      {
        'nextId': nextId,
        'data': dataArray }
      );
  }

  static saveToFile(dataArray, dbPath) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify(dataArray),
      {'encoding': 'utf8'}
    );

    return true;
  }
}

export default FilePersistence;
