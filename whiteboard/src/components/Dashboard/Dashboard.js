import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchGroups, fetchProjects, fetchBoards } from './../../ducks/actions/index';

import SideNav from './SideNav/SideNav';
import BoardGrid from './BoardGrid/BoardGrid';

import './Dashboard.css';

class Dashboard extends Component {
  componentDidUpdate() {
    let id = this.props.userInfo.id;
    this.props.fetchGroups(id);
    this.props.fetchProjects(id);
    this.props.fetchBoards(id);
  }
  render() {
    return (
      <div id='Dashboard'>
        <SideNav />
        <Switch>
          <Route path='/dashboard' exact render={() => {
            return <div>this will be the landing page before the user creates/joins a group</div>
          }} />
          <Route path='/dashboard/:groupid' exact render={() => {
            return <div>this will be the view when a group has no projects</div>
          }} />
          <Route path='/dashboard/:groupid/:projectid' component={BoardGrid} />
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
export default connect(mapStateToProps, { fetchGroups, fetchProjects, fetchBoards })(Dashboard);
