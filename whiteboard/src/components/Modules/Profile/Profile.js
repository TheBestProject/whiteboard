import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import './../commonModule.css';
import './Profile.css';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      username: this.props.userInfo.username,
      profilepic: this.props.userInfo.profilepic,
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
      ] 
    }
    this.handleChange = this.handleChange.bind(this);
    this.lock = this.lock.bind(this);
    this.unlock = this.unlock.bind(this);
    this.preview = this.preview.bind(this);
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
  preview(e) {
    let files = e.target.files;
    let file = files[0];
    let fileReader = new FileReader();
    let result;
    fileReader.onload = function(fileLoadedEvent){
      result = fileLoadedEvent.target.result;
      this.setState({profilepic: result});
    }
    fileReader.onload = fileReader.onload.bind(this);
    fileReader.readAsDataURL(file);
  }
  save() {
    console.log(this.state.username, this.state.profilepic);
    this.unlock();
    this.props.profileFlag();
  }
  componentDidMount() {
    this.lock();
    // this.DO AN AXIOS
    // .then(res => {
    //   let users = res.data.filter(user => user.groupID === this.state.groupID)
    //   this.setState({users})
    // })
  }
  render() {
    // console.log(this.props)
    const avatarStyle = {
      backgroundImage: `url(${this.state.profilepic})`
    }
    return (
      <div id='Profile'>
        <div className='module_mask'>
          <div className='module_box'>
            <div className='module_exitButton' onClick={() => {
              this.props.profileFlag();
              this.unlock();
              }}>
              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" xmlSpace="preserve">
                <polygon points="42,20 22,20 22,0 20,0 20,20 0,20 0,22 20,22 20,42 22,42 22,22 42,22 "/>
              </svg>
            </div>
            <h1>Edit Profile</h1>
            <div className='profile_avatarBox'>
              <div className='profile_avatar' style={avatarStyle}></div>
              <div className='profile_inputMask'>Choose New Avatar</div>
              <input type='file' onChange={e => this.preview(e)}/>
            </div>
            <h3>Choose New Username</h3>
            <input value={this.state.username} onChange={e => this.handleChange('username', e.target.value)} />
            <button onClick={this.save}>Save Profile</button>
          </div>
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
export default withRouter(connect(mapStateToProps)(Profile));