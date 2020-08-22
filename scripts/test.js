import PouchDB from 'pouchdb';
import TaskMapper from './mappers/task-mapper';

PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('pomodoro-task-tracker');

let tasks = new Map();

// Create indexes
const createIndexes = async () => {
  console.log('--- findByName() ------------------------------');

  let indexes = await db.getIndexes();

  console.log('indexes: ', indexes);

  if (indexes.indexes.length === 1) {
    console.log('Creating indexes!');

    let indexByName = await db.createIndex({
      index: {
        fields: ['name'],
        ddoc: 'index-by-name'
      }
    });

    let indexByType = await db.createIndex({
      index: {
        fields: ['type'],
        ddoc: 'index-by-type'
      }
    });

    let indexByDone = await db.createIndex({
      index: {
        fields: ['done'],
        ddoc: 'index-by-done'
      }
    });

    console.log('indexByName: ', indexByName);
    console.log('indexByType: ', indexByType);
    console.log('indexByDone: ', indexByDone);
  }

  console.log('---------------------------------------------');
}

// Restore database from disk.

// Dump database to disk.

// Queries using find()
// Name
const findByName = async (taskName) => {
  console.log('--- findByName() ------------------------------');

  try {
    let findResult = await db.find({
      selector: {
        name: taskName
      },
      use_index: 'index-by-name'
    });

    console.log('findResult: ', findResult);
  } catch (error) {
    console.log('Caught error', error);
  }

  console.log('taskName: ', taskName);

  console.log('---------------------------------------------');
}

// Type
const findByType = async (typeName) => {
  console.log('--- findByType() ------------------------------');

  try {
    let findResult = await db.find({
      selector: {
        type: typeName
      },
      use_index: 'index-by-type'
    });

    console.log('findResult: ', findResult);
  } catch (error) {
    console.log('Caught error', error);
  }

  console.log('typeName: ', typeName);

  console.log('---------------------------------------------');
}

// Done

// Paging via allDocs.  Kind of like skip/take pattern.

// Get all docs via allDocs.
const getAllDocs = async () => {
  console.log('--- getAllDocs() ------------------------------');

  let docs = null;

  try {
    docs = await db.allDocs({ include_docs: true });
    console.log('docs: ', docs);
  } catch (error) {
    console.log('error: ', error);
  }
  console.log('---------------------------------------------');
  return docs;
}

// Remove document.
const remove = async (task) => {
  console.log('--- remove() ------------------------------');

  let result =  null;

  try {
    result = await db.remove(task._id, task._rev);
    console.log('result: ', result);
    if (result.ok) {
      tasks.delete(task._id);
    }
  } catch (error) {
    console.log('error: ', error);
  }

  console.log('---------------------------------------------');
}

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

const testFindByName = async () => {
  console.log('--- testFindByName() ---------------------------------');

  const task = tasks.get('251d9a36-a0b6-43d3-8bb5-16cc6e825c3c');

  console.log('task: ', task);

  await findByName(task.name);

  console.log('---------------------------------------------');
}

const testRemove = async () => {
  console.log('--- testRemove() ---------------------------------');

  await remove(tasks.get('2085beaf-03eb-4ef8-95af-27193e16845b'));

  console.log('tasks: ', tasks);

  console.log('---------------------------------------------');
}

const testGetAllDocs = async () => {
  console.log('--- testGetAllDocs() ---------------------------------');

  let docs = await getAllDocs();

  for ( let i = 0 ; i < docs.rows.length ; i++ ) {
    console.log(`docs.rows[${i}]: `, docs.rows[i]);

    // The design document for the index will be in the results from allDocs().
    // If it gets processed here, and we upsert the task as design doc, we will overwrite the index!
    // We shouldn't be treating the design document as a Task, so we filter only for documents with the type === 'task'
    if (docs.rows[i].doc.type !== undefined && docs.rows[i].doc.type === 'task') {
      tasks.set(docs.rows[i].id, TaskMapper.mapDataToTask(docs.rows[i].doc));
    }
  }

  console.log('tasks: ', tasks);

  console.log('---------------------------------------------');
}

const testUpsert = async () => {
  console.log('--- testUpsert() ---------------------------------');

  const iter = tasks.keys();

  let item = iter.next();
  let index = 0;
  while ( !item.done ) {
    let task = tasks.get(item.value);
    task.name = `Task 1${index}`;
    tasks.set(item.value, task);
    await upsert(task);
    index = index + 1;
    item = iter.next();
  }

  console.log('tasks', tasks);

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
  await createIndexes();
  await testGetAllDocs();
  await testUpsert();
  await testFindByName();
  await findByType('task');
  await findByType('BS');
  await testGetById();
  await testRemove();
  await testGetById();  // Getting a deleted document.
  console.log('---------------------------------------------');
}

doItAll().then(() => {console.log('Completed tests');}).catch((error) => {console.log('Caught error: ', error);});