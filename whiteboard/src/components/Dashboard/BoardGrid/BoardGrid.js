import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import './BoardGrid.css';

class BoardGrid extends Component {
  render() {
    console.log('grid props', this.props);
    return (
      <div id='BoardGrid'>
        {this.props.boards.map((board, i) => {
          {/* console.log(this.props.boards) */}
          let img = new Image();
          img.src = board.canvas;
          let gridPicStyle = {
            backgroundImage: `url(${img.src})`
          }
          if (board.projectid == this.props.match.params.projectid) {
            return <Link to={`/board/${board.id}`} key={i} className='grid_tile'>
              <div style={gridPicStyle} className='grid_pic'></div>
              <div className='grid_picTransparent'></div>
              <p>{board.name}</p>
            </Link>
          }
        })
        }
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    boards: state.userData.boards
  }
}
export default withRouter(connect(mapStateToProps)(BoardGrid));