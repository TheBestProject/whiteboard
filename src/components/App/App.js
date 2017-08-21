import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { checkUser, fetchUser, fetchGroups, fetchProjects, fetchBoards } from '../../ducks/actions/index'

import Welcome from './../Welcome-Login/Welcome';
import Dashboard from './../Dashboard/Dashboard';
import Whiteboard from './../Whiteboard/Whiteboard';
import NotFound from './../NotFound/NotFound';


import './base.css';

class App extends Component {
  componentDidMount(){
    this.props.checkUser();
  }
  componentWillReceiveProps(newProps) {
    if (newProps.userInfo.loggedIn !== this.props.userInfo.loggedIn && newProps.userInfo.loggedIn) {
      this.props.fetchUser();
    }
    if (newProps.userInfo.id !== this.props.userInfo.id && newProps.userInfo.id) {
      let id = newProps.userInfo.id;
      this.props.fetchGroups(id);
      this.props.fetchProjects(id);
      this.props.fetchBoards(id);
    }
  }
  render() {
    return (
      <div id='App'>
        <Switch>
          <Route component={Welcome} path='/' exact />
          <Route component={Dashboard} path='/dashboard' />
          {this.props.userInfo.loggedIn
          ?
            <Route component={Whiteboard} path='/board/:boardid' />
          :
            null
          }
          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  }
}
export default withRouter(connect(mapStateToProps, { checkUser, fetchUser, fetchGroups, fetchProjects, fetchBoards })(App));