import React, { Component } from 'react';
import { connect } from 'react-redux';
import './welcome.css';

class Welcome extends Component {
  componentWillReceiveProps(newProps) {
    if (newProps.userInfo.loggedIn) {
      this.props.history.push('/dashboard')
    }
  }
  render() {
    return (
      <div id='Welcome'>
        <div id='Hey'>
          <div>
           Welcome to <u>The Board Room</u>, a collaborative whiteboarding environment
          </div>
        </div>
        <div id='Log'>
          <div>Click<a className="Login" href="http://localhost:4000/auth0"><u>Here</u></a>To Login.</div>
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
export default connect(mapStateToProps)(Welcome);


{/*<div>Icons made by <a href="https://www.flaticon.com/authors/madebyoliver" title="Madebyoliver">Madebyoliver</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>*/}