import Task from './data-models/task';
import DB from './mock-db/db';
import FilePersistence from './mock-db/file-persistence';

const jsonData = FilePersistence.loadFromFile();

console.log('jsonData', jsonData);

const db = new DB();

db.restoreData(jsonData);

console.log('db.data', db.data);

db.addTask(new Task(db.getNextId(), 'Last Thing', 'Do that last thing'));

const dataArray = FilePersistence.mapData(db.nextId, db.data);

console.log('dataArray', dataArray);

FilePersistence.saveToFile(dataArray);
