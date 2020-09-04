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

import PouchDB from 'pouchdb';

PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-debug'));

class Database {
  constructor(databasePath) {
    this.db = new PouchDB(databasePath);
  }

  // Check to see if indexes exist, if they don't, create them.
  // Do nothing otherwise.
  async createIndexes() {
    let indexes = await this.db.getIndexes();
  
    if (indexes.indexes.length === 1) {
  
      await this.db.createIndex({
        index: {
          fields: ['name'],
          ddoc: 'index-by-name'
        }
      });
  
      await this.db.createIndex({
        index: {
          fields: ['type'],
          ddoc: 'index-by-type'
        }
      });
  
      await this.db.createIndex({
        index: {
          fields: ['done'],
          ddoc: 'index-by-done'
        }
      });

      await this.db.createIndex({
        index: {
          fields: ['label'],
          ddoc: 'index-by-label'
        }
      });

      await this.db.createIndex({
        index: {
          fields: ['type', 'label'],
        },
        ddoc: 'index-by-type-label'
      });
    }
  }

  async getTasks() {
    try {
      let findResult = await this.db.find({
        selector: {
          type: 'task'
        },
        use_index: 'index-by-type'
      });

      return findResult.docs;
    } catch (error) {
      console.log('Caught error', error);
    }
  }

  async filterTasksByDone(done) {
    try {
      let findResult = await this.db.find({
        selector: {
          done: done
        },
        use_index: 'index-by-done'
      });

      return findResult.docs;
    } catch (error) {
      console.log('Caught error', error);
    }
  }

  async filterTasks(filterName) {
    try {
      if (filterName === 'all') {
        return this.getTasks();
      } else if (filterName === 'tasksDone') {
        return this.filterTasksByDone(true);
      } else if (filterName === 'tasksNotDone') {
        return this.filterTasksByDone(false);
      }
    } catch (error) {
      console.log('Caught error: ', error);
    }
  }

  async getLabels() {
    try {
      let findResult = await this.db.find({
        selector: {
          type: 'label'
        },
        use_index: 'index-by-type'
      });

      return findResult.docs;
    } catch (error) {
      console.log('Caught error: ', error);
    }
  }

  async upsert(doc) {
    try {
      const response = await this.db.put(doc);
      if (response.ok) {
        return response.rev;
      } else {
        throw new Error('Failed to upsert!');
      }
    } catch (error) {
      console.log('error:', error);
    }
  }

  async remove(doc) {
    try {
      const result = await this.db.remove(doc._id, doc._rev);

      return result;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  enableDebug() {
    PouchDB.debug.enable('*');
  }

  disableDebug() {
    PouchDB.debug.disable();
  }
}

export default Database;
