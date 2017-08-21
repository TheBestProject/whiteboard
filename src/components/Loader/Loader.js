import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Loader.css';

class Loader extends Component {
  render() {
    return (
      <div id='Loader'>
        {this.props.small
        ?
          <div className='loader_background_small'>
            <div className='loader'></div>
          </div>
        :
          <div className='loader_background_cover'>
            <div className='loader'></div>
          </div>
        }
      </div>
    )
  }
}
export default Loader;