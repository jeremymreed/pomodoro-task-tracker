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
}

export default Database;
