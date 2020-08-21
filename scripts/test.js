import PouchDB from 'pouchdb';
import TaskMapper from './mappers/task-mapper';

const db = new PouchDB('pomodoro-task-tracker');

let tasks = [];

// Restore database from disk.

// Dump database to disk.

// Queries using find()

// Paging via allDocs.  Kind of like skip/take pattern.

// Get all docs via allDocs.
const getAllDocs = async () => {
  console.log('--- getAllDocs() ------------------------------');

  let docs = null;

  try {
    docs = await db.allDocs({ include_docs: true });
    console.log('docs: ', docs);
    for ( let i = 0 ; i < docs.rows.length ; i++ ) {
      console.log(`docs.rows[${i}]: `, docs.rows[i]);
      tasks.push(TaskMapper.mapDataToTask(docs.rows[i].doc));
    }

  } catch (error) {
    console.log('error: ', error);
  }
  console.log('---------------------------------------------');
  return tasks;
}

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

const testGetAllDocs = async () => {
  console.log('--- testGetAllDocs() ---------------------------------');

  await getAllDocs();

  console.log('tasks: ', tasks);

  console.log('---------------------------------------------');
}

const testUpsert = async () => {
  console.log('--- testUpsert() ---------------------------------');

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
  await testGetAllDocs();
  await testUpsert();
  await testGetById();
  console.log('---------------------------------------------');
}

doItAll().then(() => {console.log('Completed tests');}).catch((error) => {console.log('Caught error: ', error);});