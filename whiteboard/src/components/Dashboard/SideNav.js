import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import Create from './../Modules/Create/Create';
import Edit from './../Modules/Edit/Edit';
import Profile from './../Modules/Profile/Profile';

import './SideNav.css';

class SideNav extends Component {
  constructor() {
    super();
    this.state = {
      fakeFlag: false,
      createFlag: false,
      purpose: '',
      groupID: null
    }
    this.groupCreate = this.groupCreate.bind(this);
    this.projectCreate = this.projectCreate.bind(this);
    this.createFlag = this.createFlag.bind(this);
  }
  groupCreate() {
    this.setState({
      createFlag: true,
      purpose: 'Group'
    })
  }
  projectCreate(groupID) {
    this.setState({
      createFlag: true,
      purpose: 'Project',
      groupID
    })
  }
  createFlag() {
    this.setState({
      createFlag: false,
      purpose: '',
      groupID: null
    })
  }
  componentWillReceiveProps(newProps) {
    // if (newProps.history.location.pathname !== this.props.history.location.pathname) {
      console.log('change')
    
  }
  render() {
    console.log('url', this.props.history.location.pathname);
  
    const { username, profilepic } = this.props.userInfo;
    const picStyle = {
      backgroundImage: `url(${profilepic})`
    }
    return (
      <div id='SideNav'>
        <div className='sideNav_title'>
          <h1>The Board Room</h1>
        </div>
        <div className='sideNav_userDisplay'>
          <div className='sideNav_username'>
            <h2>{username}</h2>
            <p>edit</p>
          </div>
          <div className='sideNav_profilePic' style={picStyle}></div>
        </div>
        <div className='sideNav_groupsList'>
          <div className='sideNav_groupHeader'>
            <h2>Your Groups</h2>
            <div className='sideNav_groupButton' onClick={this.groupCreate}>
              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" xmlSpace="preserve">
                <polygon points="42,20 22,20 22,0 20,0 20,20 0,20 0,22 20,22 20,42 22,42 22,22 42,22 "/>
              </svg>
            </div>
          </div>
          <div className='sideNav_groupsContainer'>
            {
              this.props.userData.groups.map((group, i) => {
                
                return <div key={i} className='sideNav_groupBox'>
                  <div className='sideNav_hoverBox'>
                    <Link to={`/dashboard/${group.ID}`} className='sideNav_h3Link' onClick={() => this.setState({fakeFlag: !this.state.fakeFlag})}>{group.name}</Link>
                    <div className='sideNav_hoverMenu' >
                      <p onClick={() => this.projectCreate(group.ID)}>Add Project</p>
                      <p>Edit Group</p>
                    </div>
                  </div>
                  {
                    this.props.userData.projects.map((project, j) => {
                      {/* console.log('project', project); */}
                      if (project.groupID === group.ID && this.props.history.location.pathname.includes(`/dashboard/${group.ID}`)) {
                        return <div key={j}>
                          <div className='sideNav_hoverBox2'>
                            <Link to={`/dashboard/${group.ID}/${project.ID}`} className='sideNav_h4Link' onClick={() => this.setState({fakeFlag: !this.state.fakeFlag})}>{project.name}</Link>
                            <div className='sideNav_hoverMenu2'>
                              <p>Edit Project</p>
                            </div> 
                          </div> 
                        </div>
                      }
                    })
                  }
                </div>
              })
            }
          </div>
        </div>
        {this.state.createFlag
        ?
          <Create purpose={this.state.purpose} groupID={this.state.groupID} createFlag={this.createFlag}/>
        :
          null
        }
        <Edit />
        <Profile />
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
    userData: state.userData
  }
}
export default withRouter(connect(mapStateToProps)(SideNav));