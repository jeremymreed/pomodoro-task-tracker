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

  async getAllDocs() {
    let docs = null;

    try {
      docs = await this.db.allDocs({ include_docs: true });
    } catch (error) {
      console.log('error: ', error);
    }
    return docs;
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
