import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import { fetchUser } from '../../ducks/actions/index'

import Welcome from './../Welcome-Login/Welcome';
import Dashboard from './../Dashboard/Dashboard';
import Whiteboard from './../Whiteboard/Whiteboard';


import './base.css';

class App extends Component {

  componentDidMount(){
    this.props.fetchUser();

  }
  render() {
    return (
      <div id='App'>
        <Switch>
          <Route component={Welcome} path='/' exact />
          <Route component={Dashboard} path='/dashboard' />
          <Route component={Whiteboard} path='/board/:boardid' />
        </Switch>
      </div>
    )
  }
}
export default withRouter(connect(null, {fetchUser})(App));