import Database from './database';

const db = new Database();

/*
  Initial database seed.
 */

const installDB = async () => {
  console.log('--- installDB() ---------------------------------');

  await db.createIndexes();

  console.log('---------------------------------------------');
}

installDB().then(() => { console.log('Installed the database!'); }).catch((error) => { console.log('Caught error: ', error); });
