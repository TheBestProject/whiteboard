import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchGroups, fetchProjects, fetchBoards } from './../../ducks/actions/index';

import Loader from './../Loader/Loader.js';
import SideNav from './SideNav/SideNav';
import BoardGrid from './BoardGrid/BoardGrid';

import './Dashboard.css';

class Dashboard extends Component {
  componentWillReceiveProps(newProps) {
    let id = newProps.userInfo.id;
    if (this.props.userInfo.id !== newProps.userInfo.id) {
      console.log('hiya')
    
      this.props.fetchGroups(id);
      this.props.fetchProjects(id);
      this.props.fetchBoards(id);

    
    }
  }
  render() {
    return (
      <div id='Dashboard'>
         {this.props.groupsLoad && this.props.projectsLoad && this.props.boardsLoad
        ?
          <Loader small={false}/>
        :
          null
        } 
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
    userInfo: state.userInfo,
    groupsLoad: state.userData.groupsLoad,
    projectsLoad: state.userData.projectsLoad,
    boardsLoad: state.userData.boardsLoad
  }
}
export default connect(mapStateToProps, { fetchGroups, fetchProjects, fetchBoards })(Dashboard);
