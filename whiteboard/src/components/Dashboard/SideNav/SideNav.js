import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import Create from './../../Modules/Create';
import Edit from './../../Modules/Edit';
import Profile from './../../Modules/Profile/Profile';

import './SideNav.css';

class SideNav extends Component {
  constructor() {
    super();
    this.state = {
      rerenderFlag: false,
      createFlag: false,
      editFlag: false,
      profileFlag: false,
      purpose: '',
      groupID: null,
      projectID: null,
      name: ''
    }
    this.groupCreate = this.groupCreate.bind(this);
    this.projectCreate = this.projectCreate.bind(this);
    this.groupEdit = this.groupEdit.bind(this);
    this.projectEdit = this.projectEdit.bind(this);
    this.createFlag = this.createFlag.bind(this);
    this.editFlag = this.editFlag.bind(this);
    this.prfileFlag = this.profileFlag.bind(this);
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
  groupEdit(groupID, name) {
    console.log('groupid', groupID)
    this.setState({
      editFlag: true,
      purpose: 'Group',
      groupID,
      name
    })
  }
  projectEdit(groupID, projectID, name) {
    this.setState({
      editFlag: true,
      purpose: 'Project',
      groupID,
      projectID,
      name
    })
  }
  createFlag() {
    this.setState({
      createFlag: false,
      purpose: '',
      groupID: null
    })
  }
  editFlag() {
    this.setState({
      editFlag: false,
      purpose: '',
      groupID: null,
      projectID: null,
      name: ''
    })
  }
  profileFlag() {
    this.setState({
      profileFlag: false
    })
  }
  render() {
    console.log('groups in store', this.props.userData.groups)
    console.log('projects in store', this.props.userData.projects)
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
            <p onClick={() => this.setState({profileFlag: true})}>edit</p>
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
                    <Link to={`/dashboard/${group.id}`} className='sideNav_h3Link' onClick={() => this.setState({rerenderFlag: !this.state.rerenderFlag})}>{group.name}</Link>
                    <div className='sideNav_hoverMenu' >
                      <p onClick={() => this.projectCreate(group.id)}>Add Project</p>
                      <p onClick={() => this.groupEdit(group.id, group.name)}>Edit Group</p>
                    </div>
                  </div>
                  {
                    this.props.userData.projects.map((project, j) => {
                      {/* console.log('project', project); */}
                      if (project.groupid === group.id && this.props.history.location.pathname.includes(`/dashboard/${group.id}`)) {
                        return <div key={j}>
                          <div className='sideNav_hoverBox2'>
                            <Link to={`/dashboard/${group.id}/${project.id}`} className='sideNav_h4Link' onClick={() => this.setState({rerenderFlag: !this.state.rerenderFlag})}>{project.name}</Link>
                            <div className='sideNav_hoverMenu2'>
                              <p onClick={() => this.projectEdit(group.id, project.id, project.name)}>Edit Project</p>
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
          <Create purpose={this.state.purpose} groupID={this.state.groupID} createFlag={this.createFlag} />
        :
          null
        }
        {this.state.editFlag
        ?
          <Edit purpose={this.state.purpose} name= {this.state.name} groupID={this.state.groupID} projectID={this.state.projectID} editFlag={this.editFlag} />
        :
          null
        }
        {this.state.profileFlag
        ?
          <Profile profileFlag={this.prfileFlag} />
        :
          null
        }
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