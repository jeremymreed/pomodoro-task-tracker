class Task {
  constructor(id, name, description, done) {
    this._id = id || 0;
    this._name = name || '';
    this._description = description || '';
    this.done = done || false;
  }
}

export default Task;