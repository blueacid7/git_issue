// import '../lib/react-ui-tree.css';
import './app.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SimpleTable from './SimpleTable';
import {TextField, Paper, Button} from '@material-ui/core'

class App extends Component {

  constructor(props) {
    super(props);
    this.state =  {
      issues: {},
      url: '',
      error: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  handleSubmit() {
      this.setState({error: "", issues: {}});
      fetch(`/fetch-data?url=${this.state.url}`).then((res) => {
        return res.json();
      }).then((res) => {
        if(res.message) {
          this.setState({error: res.message});
        } else {
          this.setState({issues: res});
        }
      });
  }

  render() {
    return (
      <div className="app">
        <Paper style={{width: '600px', height: '400px', marginLeft: '30%', marginTop: "100px", padding: '20px'}}>
          <TextField
            id="standard-name"
            label="GitHub Url"
            value={this.state.name}
            onChange={e => this.setState({url: e.target.value})}
            margin="normal"
            style={{marginLeft: "50px", width: '300px'}}
          />
          <Button 
            onClick={this.handleSubmit}
            variant="contained" 
            color="primary" 
            style={{margin: '30px'}}>
            Search Issues
          </Button>
          {this.state.error ? <div style={{color: 'red', marginLeft: "170px"}}>{this.state.error}</div> :
            <SimpleTable issues={this.state.issues}/>
          }
        </Paper>
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
