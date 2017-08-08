import React, { Component } from 'react';
import { connect } from 'react-redux';

class SideNav extends Component {
  render() {
    return (
      <div id='SideNav'>
        Nav
        {JSON.stringify(this.props.userInfo)}
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  }
}
export default connect(mapStateToProps)(SideNav);