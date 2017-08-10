import React, { Component } from 'react';
import { connect } from 'react-redux';

class Edit extends Component {
  render() {
    return (
      <div id='Edit'>
        Edit
      </div>
    )
  }
}
export default connect(null, { something: 'something' })(Edit);