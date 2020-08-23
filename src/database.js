import PouchDB from 'pouchdb';

PouchDB.plugin(require('pouchdb-find'));

class Database {
  constructor() {
    this.db = new PouchDB('data/pomodoro-task-tracker');
  }

  // Check to see if indexes exist, if they don't, create them.
  // Do nothing otherwise.
  async createIndexes() {
    let indexes = await this.db.getIndexes();
  
    console.log('indexes: ', indexes);
  
    if (indexes.indexes.length === 1) {
      console.log('Creating indexes!');
  
      let indexByName = await this.db.createIndex({
        index: {
          fields: ['name'],
          ddoc: 'index-by-name'
        }
      });
  
      let indexByType = await this.db.createIndex({
        index: {
          fields: ['type'],
          ddoc: 'index-by-type'
        }
      });
  
      let indexByDone = await this.db.createIndex({
        index: {
          fields: ['done'],
          ddoc: 'index-by-done'
        }
      });
  
      console.log('indexByName: ', indexByName);
      console.log('indexByType: ', indexByType);
      console.log('indexByDone: ', indexByDone);
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

      console.log('findResult: ', findResult);
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

      console.log('findResult: ', findResult);
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
}

export default Database;
