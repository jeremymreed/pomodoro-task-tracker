import PouchDB from 'pouchdb';
import Task from './data-models/task';

const db = new PouchDB('pomodoro-task-tracker');

let tasks = [
  new Task('2085beaf-03eb-4ef8-95af-27193e16845b', null, 'Test0', 'Task 0'),
  new Task('9304ec0b-8f4f-45b3-a79e-5198a88806cf', null, 'Task1', 'Task 1'),
  new Task('251d9a36-a0b6-43d3-8bb5-16cc6e825c3c', null, 'Task2', 'Task 2')
];

// Restore database from disk.

// Dump database to disk.

// Queries using find()

// Paging via allDocs.  Kind of like skip/take pattern.

// Get all docs via allDocs.

// Remove document.

// Upsert document.
const upsert = async (task) => {
  console.log('--- upsert() ---------------------------------');

  try {
    const response = await db.put(task);
    console.log('response: ', response);
    if (response.ok) {
      return response.rev;
    } else {
      console.log('response.ok was false!');
      return null;
    }
  } catch (error) {
    console.log('error:', error);
  }

  console.log('---------------------------------------------');
}

// Get document by id.
const getById = async (id) => {
  console.log('--- getById() ---------------------------------');

  try {
    const response = await db.get(id);
    console.log('response: ', response);
  } catch (error) {
    console.log('error: ', error);
  }

  console.log('---------------------------------------------');
}



/*
  Functions to exercise the PouchDB API.
 */

const testUpsert = async () => {
  console.log('--- testUpsert() ---------------------------------');

  for ( let i = 0 ; i < tasks.length ; i++ ) {
    tasks[i].name = `TASK 1${i}`;
    const rev = await upsert(tasks[i]);

    if (rev !== null) {
      tasks[i]._rev = rev;
    } else {
      console.log('Got invalid rev!');
    }
  }

  console.log('tasks: ', tasks);
  console.log('---------------------------------------------');
}

const testGetById = async () => {
  console.log('--- testGetById() ---------------------------------');

  const testId = '2085beaf-03eb-4ef8-95af-27193e16845b';

  await getById(testId);
  console.log('---------------------------------------------');
}

const doItAll = async () => {
  console.log('--- doItAll() ---------------------------------');
  await seedDB();
  await testUpsert();
  await testGetById();
  console.log('---------------------------------------------');
}

doItAll().then(() => {console.log('seeded database');}).catch((error) => {console.log('Caught error: ', error);});