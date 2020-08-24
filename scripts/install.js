import PouchDB from 'pouchdb';

PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('data/pomodoro-task-tracker');

const createIndexes = async () => {
  let indexes = await db.getIndexes();

  if (indexes.indexes.length === 1) {

    await db.createIndex({
      index: {
        fields: ['name'],
        ddoc: 'index-by-name'
      }
    });

    await db.createIndex({
      index: {
        fields: ['type'],
        ddoc: 'index-by-type'
      }
    });

    await db.createIndex({
      index: {
        fields: ['done'],
        ddoc: 'index-by-done'
      }
    });
  }
}

/*
  Initial database seed.
 */

const installDB = async () => {
  console.log('--- installDB() ---------------------------------');

  await createIndexes();

  console.log('---------------------------------------------');
}

installDB().then(() => { console.log('Installed the database!'); }).catch((error) => { console.log('Caught error: ', error); });
