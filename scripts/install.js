import os from 'os';
import Database from './database';

const databasePath = os.homedir() + '/.config/pomodoro-task-tracker/pomodoro-task-tracker-data';
console.log('App constructor: databasePath', databasePath);

const db = new Database(databasePath);

/*
  Initial database seed.
 */

const installDB = async () => {
  console.log('--- installDB() ---------------------------------');

  await db.createIndexes();

  console.log('---------------------------------------------');
}

installDB().then(() => { console.log('Installed the database!'); }).catch((error) => { console.log('Caught error: ', error); });
