import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './SideNav.css';

class SideNav extends Component {
  render() {
    const { username, profilePic } = this.props.userInfo;
    const picStyle = {
      backgroundImage: `url(${profilePic})`
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
            <div className='sideNav_groupButton'>
              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 42 42" xmlSpace="preserve">
              <polygon points="42,20 22,20 22,0 20,0 20,20 0,20 0,22 20,22 20,42 22,42 22,22 42,22 "/>

              </svg>
            </div>
          </div>
          <div className='sideNav_groupsContainer'>
            {
              this.props.groups.map((group, i) => {
                return <div key={i} className='sideNav_groupBox'>
                  <Link to={`/dashboard/${group.ID}`} className='h3Link'>{group.name}</Link>
                  {
                    this.props.projects.map((project, j) => {
                      if (project.groupID === group.ID) {
                      return <div key={j}>
                        <Link to={`/dashboard/${group.ID}/${project.ID}`} className='h4Link'>{project.name}</Link>
                      </div>
                      }
                    })
                  }
                </div>
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
    groups: state.groups,
    projects: state.projects
  }
}
export default connect(mapStateToProps)(SideNav);