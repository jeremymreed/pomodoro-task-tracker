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

import Task from '../data-models/task';

class DB {
  constructor() {
    this.data = new Map();
    this.nextId = 0;
  }

  // Caution, this will update an existing record!  This is ok now, we use this to update records too!
  // TODO: Consider name change, since this does adds AND updates.
  addTask(task) {
    this.data.set(task.id, task);
  }

  removeTask(taskId) {
    this.data.delete(taskId);
  }

  getTasks() {
    return this.data;
  }

  getTaskById(taskId) {
    return this.data.get(taskId);
  }

  getNextId() {
    const retval = this.nextId;
    this.nextId = this.nextId + 1;
    return retval;
  }

  // TODO: Isn't this fragile?  Every time Task changes, this function needs to be modified.  This has bitten us in the ass before!
  restoreData(jsonData) {
    this.nextId = jsonData.nextId;
    for (let i = 0 ; i < jsonData.data.length ; i++ ) {
      this.addTask(new Task(
        jsonData.data[i].id,
        jsonData.data[i].name,
        jsonData.data[i].description,
        jsonData.data[i].timeSpent,
        jsonData.data[i].done)
      );
    }
  }
}

export default DB;
