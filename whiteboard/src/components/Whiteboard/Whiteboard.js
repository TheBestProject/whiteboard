import React, { Component } from 'react';
import { SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from './sketch'; 
import './Whiteboard.css';
import './range.css';
import io from 'socket.io-client';
import testImg from './test-img';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import {setImageData, addImageData, undo, redo, clear} from './../../ducks/reducers/reducer_imageData';
import { fetchBoards } from './../../ducks/actions/index';
// import dummy from './sketch/dummy';
import { findDOMNode } from 'react-dom';
import Loader from './../Loader/Loader';
import NotFound from './../NotFound/NotFound';


const socket = io();
const height = window.innerHeight;
const width = window.innerWidth;

class Whiteboard extends Component {

  constructor(props){
    super(props);

    socket.on('receive image array', data =>{
      this.props.setImageData(data.items);
      this.setState({loading: false})
    })
    socket.on('receive image item', data => {
      // console.log('received data from server', data.item);
      // console.log(data.item.id);
      // console.log(this.props.items[this.props.items.length - 1][0].id);
      if (data.item.id !== this.props.items[this.props.items.length - 1][0].id) {
        console.log('I passed the test', data.item)
        this.props.addImageData([data.item])
      }
    })
    this.state = {
      loading: true,
      hide: true,
      tool:TOOL_PENCIL,
      size: 2,
      previousCol: '#444444',
      color: '#444444',
      fill: false,
      fillColor: '#444444',
      items: []
    }

      this.save = this.save.bind(this);
      this.clear = this.clear.bind(this);
      //this.showImg = this.showImg.bind(this);
      this.erase = this.erase.bind(this);
     // this.autoSave = this.autoSave.bind(this);
      this.onComplete = this.onComplete.bind(this);
      //this.handleLoad = this.handleLoad.bind('this');
  }

  componentDidMount() {
    socket.emit('join', {boardId: this.props.match.params.boardid})
  }

  componentWillUnmount() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext("2d");
    let URL = canvas.toDataURL();
    axios.put(`/api/update/boardthumbnail/${this.props.match.params.boardid}`, {thumbnail: URL}).then(res => {
      this.props.fetchBoards(this.props.userInfo.id);
      socket.emit('leave', {boardId: this.props.match.params.boardid})
    })
  }

  componentWillMount() {
    // if (!this.props.userInfo.id) {
    //   this.props.history.push('/');
    // }
    // addImageData(dummy);
  }

  onComplete(item){
    console.log('oncomplete item', item);
    socket.emit('new canvas item', {boardId: this.props.match.params.boardid, item})
    // this.props.addImageData(item);
  }

  componentWillReceiveProps(nextProps){
    // if (!nextProps.userInfo.loggedIn && !nextProps.userInfo.loggedLoading) {
    //   this.props.history.push('/')
    // }
    if(this.props.items.length >= nextProps.items.length){
      this.clear();
      // socket.emit('new canvas data', {boardId: this.props.match.params.boardid, items: nextProps.items});
      this.setState({items:nextProps.items})
    } else{      
      // socket.emit('new canvas data', {boardId: this.props.match.params.boardid, items: nextProps.items});
      this.setState({items:nextProps.items})
    }      
  }

  // setImage(URL){
  //   console.log('set Image',URL.length)
  //   this.showImg(URL);
  //   this.setState({URL:URL})
  // }

  // showImg(URL){
  //     // let canvas = document.getElementById('canvas');
  //     // let ctx = canvas.getContext("2d"); 
  //     var img = new Image();
  //     //console.log('show Image',URL.length);
  //     img.src = testImg;
  //     this.ctx.drawImage(img,0,0,width,height,0,0,width,height)
  // }

  // displayThumb(){
  //       document.getElementById("thumb").style.border = "1px solid";  
  //       document.getElementById("thumb").src = this.state.URL;
  //       document.getElementById("thumb").style.display = "inline";
  // }

  save() {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext("2d"); 
        this.setState({URL:canvas.toDataURL()});
    }

  clear() {
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext("2d");
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);       
  }

  erase(){
    this.setState({previousCol: this.state.color, color: 'white', tool:TOOL_PENCIL, size:20});          
  }
  
  // autoSave(){
  //   let canvas = document.getElementById('canvas');
  //   let ctx = canvas.getContext("2d");
  //   let URL = canvas.toDataURL();
  //   socket.emit('new canvas data', {boardId: this.props.match.params.boardid, URL:URL});
  //   if(this.state.URL!=URL){
  //     this.setState({URL:URL, undo:[...this.state.undo, this.state.URL]});
  //   }
  //   console.log('autoSave', URL.length)
  // }


render() {
  //console.log('component state', this.state.items);
  const { hide, tool, size, color, fill, fillColor, items, previousCol } = this.state;
  let permission = false;
  console.log(this.props.boards);
  this.props.boards.map(board => {
    if (board.id == this.props.match.params.boardid) {
      permission = true;
    }
  })
  // console.log(permission);
    return (
      <div className='whiteboard'>
      
          {this.state.loading
          ?
            <Loader small={false} />
          :
            <div>
              <div className="Nav">
                <Link className="link" to={'/dashboard'}>
                    <img src={require('./../../assets/ic_keyboard_arrow_left_black_24px.svg')} alt='left'/>
                    <h1>Back to Dashboard</h1>
                </Link>
                <a className='logout' href='https://whiteboarders.herokuapp.com//auth0/logout'>logout</a>
              </div>
              <div className={`${hide ? 'all-tools-hide': null} all-tools`}>
                    <button id='clear' onClick={()=>this.props.clear(this.props.match.params.boardid)}><img src={require('./../../assets/file-rounded-empty-sheet.svg')} alt='clear'/></button>
                    <button id='undo' onClick={()=>this.props.undo(this.props.match.params.boardid)}><img src={require('./../../assets/ic_undo_black_18px.svg')} alt='undo'/></button>
                    <button id='redo' onClick={()=>this.props.redo(this.props.match.params.boardid)}><img src={require('./../../assets/ic_redo_black_18px.svg')} alt='todo'/></button>
                    <button id='eraser' onClick={() => this.erase()}><img src={require('./../../assets/eraser.svg')} alt='eraser'/></button>      
                    <img src={require('./../../assets/toggleLines.svg')} alt='toggle' id='toggle' onClick={() => this.setState({hide: !hide})}/>
                    <button id='marker'
                      style={tool === TOOL_PENCIL ? {fontWeight:'bold'} : undefined}
                      className={tool === TOOL_PENCIL  ? 'item-active' : 'item'}
                      onClick={() => this.setState({tool:TOOL_PENCIL, color:previousCol, size: 2})}
                    ><img src={require('./../../assets/pen.svg')} alt='pen'/></button>
                    <button id='line'
                      style={tool === TOOL_LINE ? {fontWeight:'bold'} : undefined}
                      className={tool === TOOL_LINE  ? 'item-active' : 'item'}
                      onClick={() => this.setState({tool:TOOL_LINE, color:previousCol, size: 2})}
                    ><img src={require('./../../assets/diagonal-line.svg')} alt='line'/></button>
                    <button id='circle'
                      style={tool === TOOL_ELLIPSE ? {fontWeight:'bold'} : undefined}
                      className={tool === TOOL_ELLIPSE  ? 'item-active' : 'item'}
                      onClick={() => this.setState({tool:TOOL_ELLIPSE,color:previousCol, size: 2})}
                    ><img src={require('./../../assets/oval.svg')} alt='oval'/></button>
                    <button id='square'
                      style={tool === TOOL_RECTANGLE ? {fontWeight:'bold'} : undefined}
                      className={tool === TOOL_RECTANGLE  ? 'item-active' : 'item'}
                      onClick={() => this.setState({tool:TOOL_RECTANGLE})}
                    ><img src={require('./../../assets/square.svg')} alt='rectangle'/></button>
                    <div id='size' className="options">
                      {/* <label htmlFor="">size: </label> */}
                      <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value)})} />
                    </div>
                    <div id='fillcolor'>
                      <p>Fill Color</p>
                      <input id='color2' type="color" value={fillColor} onChange={(e) => this.setState({fillColor: e.target.value})} />
                    </div>
                    <div id='color' className="options" style={{marginBottom:20}}>
                      <p>Line Color</p>
                      <input type="color" value={color} onChange={(e) => this.setState({color: e.target.value})} />
                    </div>
                    <div className={`${fill ? 'active' : null} fillbucketBox`}>
                      <img src={require('./../../assets/paint-bucket.svg')} alt='bucket'/>
                      <input id='fillbucket' type="checkbox" value={fill} style={{margin:'0 8'}} onChange={(e) => this.setState({fill: e.target.checked})} />
                    </div>
              </div>
              <div className="Sketchpad" >  
                <SketchPad
                  boardId={this.props.match.params.boardid}
                  width={width}
                  height={height}
                  animate={false}
                  size={size}
                  color={color}
                  fillColor={fill ? fillColor : ''}
                  items={items}
                  tool={tool}
                  //autoSave={this.autoSave}
                  onCompleteItem={(i) => this.onComplete(i)} 
                  //addItem={this.addItem}
                />
              </div>
            </div>
          }
        
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    items: state.imageData.currentImage,
    boards: state.userData.boards
  }
}

export default connect(mapStateToProps,{setImageData, addImageData, undo, redo, clear, fetchBoards})(Whiteboard);

//<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
//<img onClick={()=>this.showImg(this.state.URL)} id='thumb' style={{display: 'none', height: '150px', width:'150px'}}></img>
