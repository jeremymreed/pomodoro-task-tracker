class DB {
  constructor() {
    this.data = {};
    this.nextId = 0;
  }

  // Caution, this will update an existing record!
  addTask(task) {
    this.data[task._id] = task;
  }

  removeTask(taskId) {
    if (this.data[taskId] !== undefined) {
      delete this.data[taskId];
    }
  }

  getTasks() {
    return this.data;
  }

  getNextId() {
    const retval = this.nextId;
    this.nextId = this.nextId + 1;
    return retval;
  }
}

export default DB;
