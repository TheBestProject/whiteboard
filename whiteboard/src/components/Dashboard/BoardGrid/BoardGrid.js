import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

import { fetchBoards } from './../../../ducks/actions/index';

import './BoardGrid.css';

class BoardGrid extends Component {
  constructor() {
    super();
    this.addBoard = this.addBoard.bind(this);
  }
  addBoard() {
    axios.post(`/api/new/whiteboard/${this.props.match.params.projectid}`, {name: 'Blank Board'}).then(res => {
      this.props.fetchBoards(this.props.userInfo.id);
    })
  }
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
        <div className='grid_tile grid_addTile'>
          <div className='grid_pic'></div>
          <div className='grid_picTransparent' onClick={this.addBoard}>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 42 42" xmlSpace="preserve">
              <polygon points="42,20 22,20 22,0 20,0 20,20 0,20 0,22 20,22 20,42 22,42 22,22 42,22 "/>
            </svg>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
    boards: state.userData.boards
  }
}
export default withRouter(connect(mapStateToProps, { fetchBoards })(BoardGrid));