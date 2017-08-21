import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { fetchGroups, fetchProjects } from './../../ducks/actions/index';

import Loader from './../Loader/Loader';

import './commonModule.css';
import './Edit.css';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      name: this.props.name,
      member: '',
      members: [],
      position: null,
      purpose: this.props.purpose,
      groupID: this.props.groupID,
      projectID: this.props.projectID,
      users: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.lock = this.lock.bind(this);
    this.unlock = this.unlock.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
  }
  handleChange(statePiece, value) {
    this.setState({
      [statePiece]: value
    })
  }
  lock() {
    const dash = document.getElementById("Dashboard");
    let windowscroll = window.scrollY;
    dash.style.overflowY = 'hidden';
    dash.style.position = 'absolute';
    dash.style.top = `-${windowscroll}px`;
    this.setState({position: windowscroll})
  }
  unlock() {
    let dash = document.getElementById("Dashboard");
    dash.style.overflowY = 'visible';
    dash.style.position = 'static';
    dash.style.top = `0px`;
    window.scrollTo(0, this.state.position);
  }
  addMember(index) {
    let members = [...this.state.members];
    members.push(this.state.users[index]);
    this.setState({
      member: '',
      members
    })
  }
  removeMember(index) {
    let members = [...this.state.members];
    members.splice(index, 1);
    this.setState({
      members
    })
  }
  save() {
    if (this.state.projectID) {
      console.log('save project');
      axios.put(`/api/update/project/${this.state.projectID}`, {name: this.state.name, members: this.state.members}).then(res => {
        this.unlock();
        this.props.editFlag();
        this.props.fetchProjects(this.props.userInfo.id);
      })
    } else {
      console.log('save group');
      axios.put(`/api/update/group/${this.state.groupID}`, {name: this.state.name, members: this.state.members}).then(res => {
        this.unlock();
        this.props.editFlag();
        this.props.fetchGroups(this.props.userInfo.id);
      })
    }
  }
  delete() {
    if (this.state.projectID) {
      axios.delete(`/api/delete/project/${this.state.projectID}`).then(res => {
        this.unlock();
        this.props.editFlag();
        this.props.fetchProjects(this.props.userInfo.id);
      })
    } else {
      axios.delete(`/api/delete/group/${this.state.groupID}`).then(res => {
        this.unlock();
        this.props.editFlag();
        this.props.fetchGroups(this.props.userInfo.id);
      })

    }
  }
  componentDidMount() {
    this.lock();
    if (this.state.projectID) {
      axios.get(`/api/group/members/${this.state.groupID}`).then(res => {
        axios.get(`/api/project/members/${this.state.projectID}`).then(res2 => {
          this.setState({
            loader: false,
            users: res.data,
            members: res2.data
          })
        })
      })
    } else {
      axios.get('/api/allusers').then(res => {
        axios.get(`/api/group/members/${this.state.groupID}`).then(res2 => {
          this.setState({
            loader: false,
            users: res.data,
            members: res2.data
          })
        })
      })
    }
  }
  render() {
    return (
      <div id='Edit'>
        <div className='module_mask'>
          {this.state.loader
          ?
            <div className='module_box'>
              <div className='module_exitButton' onClick={() => {
                this.props.editFlag();
                this.unlock();
                }}>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" xmlSpace="preserve">
                  <polygon points="42,20 22,20 22,0 20,0 20,20 0,20 0,22 20,22 20,42 22,42 22,22 42,22 "/>
                </svg>
              </div>
              <Loader small={true}/>
            </div>
          :
          <div className='module_box'>
            <div className='module_exitButton' onClick={() => {
              this.props.editFlag();
              this.unlock();
              }}>
              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" xmlSpace="preserve">
                <polygon points="42,20 22,20 22,0 20,0 20,20 0,20 0,22 20,22 20,42 22,42 22,22 42,22 "/>
              </svg>
            </div>
            <h1>Edit {this.state.purpose}</h1>
            <h3>{this.state.purpose} Name</h3>
            <input value={this.state.name} onChange={(e) => this.handleChange('name', e.target.value)}/>
            <h3>Current Members</h3>
            {this.state.members.length
            ?
            <div className={`${this.state.members.length > 3 ? 'module_memberListMaskOverflow' : null} module_memberListMask`}>
              <div className={`${this.state.members.length > 3 ? 'module_memberListOverflow' : null} module_memberList`}>
                {this.state.members.map((member, i) => {
                  let littlePicStyle = {
                    backgroundImage: `url(${member.profilepic})`
                  } 
                  return <div key={i} className='module_member'>
                    <div className='module_memberUserInfo'>
                      <div className='module_memberPic' style={littlePicStyle}></div>
                      <h6>{member.username}</h6>
                    </div>
                    <p onClick={() => this.removeMember(i)}>remove</p>
                  </div>
                })}
              </div>
            </div>
            :
              null
            }
            <h3>Add New Members</h3>
            <div className='module_userInputBox'>
              <input value={this.state.member} onChange={(e) => this.handleChange('member', e.target.value)}/>
              <div className={`${this.state.member ? 'module_userListDisplay' : ''} module_userListMask`}>
                <div className={`module_userList`}>
                  {this.state.users.map((user, i) => {
                    let littlePicStyle = {
                      backgroundImage: `url(${user.profilepic})`
                    }
                    if (user.username.includes(`${this.state.member}`)){
                      return <div key={i} className='module_userListItem' onClick={() => this.addMember(i)}>
                        <div className='module_userListItemPic' style={littlePicStyle}></div>
                        <p>{user.username}</p>
                      </div>
                    }
                  })}
                </div>
              </div>
            </div>
            <button className='edit_delete' onClick={this.delete}>Delete {this.state.purpose}</button>
            <button onClick={this.save}>Save {this.state.purpose}</button>
          </div>
          }
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  }
}
export default connect(mapStateToProps, { fetchGroups, fetchProjects })(Edit);