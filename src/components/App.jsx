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
