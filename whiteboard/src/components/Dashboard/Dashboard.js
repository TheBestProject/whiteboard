import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import SideNav from './SideNav';
import BoardGrid from './BoardGrid';

class Dashboard extends Component {
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
export default Dashboard;