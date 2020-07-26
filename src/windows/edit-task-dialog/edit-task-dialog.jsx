import React from 'react';
import { ipcRenderer } from 'electron';

class EditTaskDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleTaskData = this.handleTaskData.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);

    this.state = {
      name: '',
      description: ''
    }
  }

  componentDidMount() {
    ipcRenderer.on('taskData', this.handleTaskData);
  }

  handleTaskData(event, task) {
    console.log('task:', task);

    this.setState({
      id: task._id,
      name: task._name,
      description: task._description
    });
  }

  handleNameChange(event) {
    const newName = event.target.value;
    this.setState({name: newName});
  }

  handleDescriptionChange(event) {
    const newDescription = event.target.value;
    this.setState({description: newDescription});
  }

  formSubmit(event) {
    event.preventDefault();
    console.log('this.state.name:', this.state.name);
    console.log('this.state.description:', this.state.description);
    console.log('form submitted');

    ipcRenderer.send('submitTaskData', { _id: this.state.id, _name: this.state.name, _description: this.state.description });
  }

  render() {
    return (
      <div>
        <h1>Task Editor</h1>
        <form onSubmit={(event) => this.formSubmit(event)}>
          <p>
            <label>
              Name:
              <input type="text" value={this.state.name} onChange={(event) => this.handleNameChange(event)} />
            </label>
          </p>

          <p>
            <label>
              Description:
              <input type="text" value={this.state.description} onChange={(event) => this.handleDescriptionChange(event)} />
            </label>
          </p>

          <p>
            <input type="submit" value="Submit"></input>
          </p>
        </form>
      </div>
    );
  }
}

export default EditTaskDialog;
