import Task from '../data-models/task';

// data is raw doc from PouchDB / CouchDB.
class TaskMapper {
  static mapDataToTask(data) {
    return new Task(data._id, data._rev, data.name, data.description, data.timeSpent, data.done);
  }
}

export default TaskMapper;
