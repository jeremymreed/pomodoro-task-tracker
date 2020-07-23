/*
Copyright © 2020 Jeremy M. Reed

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

import React from 'react';
import { ipcRenderer } from 'electron';

class MainView extends React.Component {
  constructor (props) {
    super(props);

    this.handleDataReady = this.handleDataReady.bind(this);

    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    ipcRenderer.on('dataReady', this.handleDataReady);
    ipcRenderer.send('getData');
  }

  handleDataReady(event, args) {
    let data = [];
    const iter = args.values();

    let item = iter.next();
    while ( !item.done ) {
      data.push(item.value);
      item = iter.next();
    }

    this.setState({data: data});
  }

  getTaskList() {
    const listTasks = this.state.data.map((task) => {
      return (
        <tr key={ task._id }>
          <td>{ task._id }</td>
          <td>{ task._name }</td>
          <td>{ task._description }</td>
          <td><button>Start</button></td>
          <td><button>Edit</button></td>
          <td><button>Remove</button></td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          { listTasks }
        </tbody>
      </table>
    );
  }

  render () {
    return (
      <div>
        <p>Testing Main View</p>
        { this.getTaskList() }
        <p><button>Add new task</button></p>
      </div>
    );
  }
}

export default MainView;
