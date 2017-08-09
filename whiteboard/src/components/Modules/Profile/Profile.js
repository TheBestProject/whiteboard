import React, { Component } from 'react';
import { connect } from 'react-redux';

class Profile extends Component {
  render() {
    return (
      <div id='Profile'>
        Profile
      </div>
    )
  }
}
export default connect(null, { something: 'something' })(Profile);