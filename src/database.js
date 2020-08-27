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

  async upsert(task) {
    try {
      const response = await this.db.put(task);
      if (response.ok) {
        return response.rev;
      } else {
        throw new Error('Failed to upsert!');
      }
    } catch (error) {
      console.log('error:', error);
    }
  }

  async remove(task) {
    try {
      const result = await this.db.remove(task._id, task._rev);

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
