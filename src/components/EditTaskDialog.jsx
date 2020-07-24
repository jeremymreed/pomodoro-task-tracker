import React from 'react';
import { ipcRenderer } from 'electron';

class EditTaskDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);

    this.state = {
      name: '',
      description: ''
    }
  }

  componentDidMount() {
    ipcRenderer.on('ping', (event, args) => {
      console.log('args:', args);
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

    ipcRenderer.send('submitTaskData', { name: this.state.name, description: this.state.description });
  }

  render() {
    return (
      <div>
        <h1>This is a test dialog!</h1>
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
