import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import './../commonModule.css';
import './Create.css';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,
      name: '',
      member: '',
      members: [],
      users: [
        {
          id: 3, 
          username: 'Aaron',
          profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg',
          groupID: 4
        },
        {
          id: 3, 
          username: 'Angela',
          profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg',
          groupID: 9
        },
        {
          id: 3, 
          username: 'Aaron2',
          profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg',
          groupID: 4
        },
        {
          id: 3, 
          username: 'Angela2',
          profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg',
          groupID: 9
        },
        {
          id: 3, 
          username: 'Aaron3',
          profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg',
          groupID: 3
        },
        {
          id: 3, 
          username: 'Angela3',
          profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg',
          groupID: 9
        },
        {
          id: 3, 
          username: 'Aaron4',
          profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg',
          groupID: 8
        },
        {
          id: 3, 
          username: 'Angela4',
          profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg',
          groupID: 9
        }
      ],
      position: null,
      purpose: this.props.purpose,
      groupID: this.props.groupID
    }
    this.handleChange = this.handleChange.bind(this);
    this.lock = this.lock.bind(this);
    this.unlock = this.unlock.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.save = this.save.bind(this);
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
    console.log(this.state.name);
    this.state.members.map(member => {
      console.log(member);
    })
    this.unlock();
    this.props.createFlag();
  }
  componentDidMount() {
    this.lock();
    // this.DO AN AXIOS
    // .then(res => {
    //   let users = res.data.filter(user => user.groupID === this.state.groupID)
    //   this.setState({users})
    // })
    if (this.state.groupID) {
      let users = this.state.users.filter(user => user.groupID === this.state.groupID)
      this.setState({users})
    }
  }
  render() {
    return (
      <div id='Create' ref='myref' >
        <div className='module_mask'>
        {this.state.flag
        ?
          <div className='module_box'>
            <div className='module_exitButton' onClick={() => {
              this.props.createFlag();
              this.unlock();
              }}>
              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" xmlSpace="preserve">
                <polygon points="42,20 22,20 22,0 20,0 20,20 0,20 0,22 20,22 20,42 22,42 22,22 42,22 "/>
              </svg>
            </div>
            <h1>Enter a {this.state.purpose} Name</h1>
            <input value={this.state.name} onChange={(e) => this.handleChange('name', e.target.value)}/>
            <button onClick={() => this.setState({flag: false})}>Next</button>
          </div>
        :
          <div className='module_box'>
            <div className='module_exitButton' onClick={() => {
              this.props.createFlag();
              this.unlock();
              }}>
              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" xmlSpace="preserve">
                <polygon points="42,20 22,20 22,0 20,0 20,20 0,20 0,22 20,22 20,42 22,42 22,22 42,22 "/>
              </svg>
            </div>
            <h2>{this.state.name}</h2>
            <h1>Add Other Members</h1>
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
    users: state.users
  }
}
export default connect(mapStateToProps, { something: 'something' })(Create);