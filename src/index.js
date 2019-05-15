import logMessage from './js/logger';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    state = {
      showNavBar: true
    };
  
    render() {
      return (
        <div className="app">
        fsjfksh
        </div>
      );
    }
  
    handleChange = tree => {
      this.setState({
        tree: tree
      });
    };
  
  }
  
  ReactDOM.render(<App />, document.getElementById('app'));