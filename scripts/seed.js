import os from 'os';
import Database from './database';
import Task from './data-models/task';

const databasePath = os.homedir() + '/.config/pomodoro-task-tracker/pomodoro-task-tracker-data';
console.log('App constructor: databasePath', databasePath);

const db = new Database(databasePath);

let tasks = [
  new Task('2085beaf-03eb-4ef8-95af-27193e16845b', null, 'Foo', 'Foo Bar', 0, false),
  new Task('9304ec0b-8f4f-45b3-a79e-5198a88806cf', null, 'Bar', 'Bar Foo', 50000, true),
  new Task('251d9a36-a0b6-43d3-8bb5-16cc6e825c3c', null, 'Test', 'Test Task', 10000, false),
];

/*
  Initial database seed.
 */

const seedDB = async () => {
  console.log('--- seedDB() ---------------------------------');

  for ( let i = 0 ; i < tasks.length ; i++ ) {
    const rev = await db.upsert(tasks[i]);

    if (rev !== null) {
      tasks[i]._rev = rev;
    } else {
      console.log('Got invalid rev!');
    }
  }

  console.log('tasks: ', tasks);
  console.log('---------------------------------------------');
}

seedDB().then(() => { console.log('Seeded the database!'); }).catch((error) => { console.log('Caught error: ', error); });
