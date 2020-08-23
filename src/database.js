import PouchDB from 'pouchdb';

PouchDB.plugin(require('pouchdb-find'));

class Database {
  constructor() {
    this.db = new PouchDB('data/pomodoro-task-tracker');
  }

  async getAllDocs() {
    let docs = null;

    try {
      docs = await this.db.allDocs({ include_docs: true });
      console.log('docs: ', docs);
    } catch (error) {
      console.log('error: ', error);
    }
    return docs;
  }

  async upsert(task) {
    try {
      const response = await this.db.put(task);
      console.log('response: ', response);
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
