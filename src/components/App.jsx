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
import { Router, createMemorySource, createHistory, LocationProvider, Link } from '@reach/router';
import HelloWorld from './hello-world';
import Test from './test';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.source = createMemorySource('/');
    this.history = createHistory(this.source);
  }

  render() {
    return (
      <div>
        <LocationProvider history={ this.history } >
          <Router>
            <HelloWorld path='/' />
            <Test path='test' />
            <NotFound default />
          </Router>
        </LocationProvider>
      </div>
    );
  }
}

function NotFound () {
  return (
    <div>
      <p>Nothing to see here!</p>
      <Link to='/'>Go back!</Link>
    </div>
  )
}

export default App;
