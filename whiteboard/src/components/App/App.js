import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux'
import Welcome from './../Welcome-Login/Welcome';
import Dashboard from './../Dashboard/Dashboard';
import Whiteboard from './../Whiteboard/Whiteboard';

import { fetchUser } from '../../ducks/actions/index'

import './base.css';

class App extends Component {

  componentDidMount(){
    this.props.fetchUser(1)

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
export default connect(null, {fetchUser})(App);