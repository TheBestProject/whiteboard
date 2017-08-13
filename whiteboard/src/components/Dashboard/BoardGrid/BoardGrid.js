import React, { Component } from 'react';
import { connect } from 'react-redux';

class BoardGrid extends Component {
  render() {
    console.log('grid props', this.props);
    return (
      <div id='BoardGrid'>
        {JSON.stringify(this.props.boards)}
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    boards: state.userData.boards
  }
}
export default connect(mapStateToProps)(BoardGrid);