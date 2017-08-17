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
// import dummy from './sketch/dummy';
import { findDOMNode } from 'react-dom';


const socket = io();
const height = window.innerHeight-60;
const width = window.innerWidth;

class Whiteboard extends Component {

  constructor(props){
    super(props);

    socket.on('receive image array', data =>{
      this.props.setImageData(data.items);
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
    socket.emit('leave', {boardId: this.props.match.params.boardid})
  }

  componentWillMount() {
    // addImageData(dummy);
  }

  onComplete(item){
    console.log('oncomplete item', item);
    socket.emit('new canvas item', {boardId: this.props.match.params.boardid, item})
    // this.props.addImageData(item);
  }

  componentWillReceiveProps(nextProps){
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
  const { tool, size, color, fill, fillColor, items, previousCol } = this.state;
    return (
      <div className='whiteboard'>
        <div className="Nav">
          <Link className="link" to={'/dashboard'}>
              <img src={require('./../../assets/ic_keyboard_arrow_left_black_24px.svg')} alt='left'/>
              <h1>Back to Dashboard</h1>
            </Link>
          <p>Our First Project</p>
        </div>
        <div className='all-tools'>
          <div className="main-tools">
              <button onClick={()=>this.save()}><img src={require('./../../assets/diskette.svg')} alt='save'/></button>
              <button onClick={()=>this.props.clear()}><img src={require('./../../assets/file-rounded-empty-sheet.svg')} alt='clear'/></button>
              <button onClick={()=>this.props.undo()}><img src={require('./../../assets/ic_undo_black_18px.svg')} alt='undo'/></button>
              <button onClick={()=>this.props.redo()}><img src={require('./../../assets/ic_redo_black_18px.svg')} alt='todo'/></button>
          </div>
          <div className='tools'>
            <div style={{marginBottom:20}}>
              <button
                style={tool === TOOL_PENCIL ? {fontWeight:'bold'} : undefined}
                className={tool === TOOL_PENCIL  ? 'item-active' : 'item'}
                onClick={() => this.setState({tool:TOOL_PENCIL, color:previousCol, size: 2})}
              ><img src={require('./../../assets/pen.svg')} alt='pen'/></button>
              <button
                style={tool === TOOL_LINE ? {fontWeight:'bold'} : undefined}
                className={tool === TOOL_LINE  ? 'item-active' : 'item'}
                onClick={() => this.setState({tool:TOOL_LINE, color:previousCol, size: 2})}
              ><img src={require('./../../assets/diagonal-line.svg')} alt='line'/></button>
              <button
                style={tool === TOOL_ELLIPSE ? {fontWeight:'bold'} : undefined}
                className={tool === TOOL_ELLIPSE  ? 'item-active' : 'item'}
                onClick={() => this.setState({tool:TOOL_ELLIPSE,color:previousCol, size: 2})}
              ><img src={require('./../../assets/oval.svg')} alt='oval'/></button>
              <button
                style={tool === TOOL_RECTANGLE ? {fontWeight:'bold'} : undefined}
                className={tool === TOOL_RECTANGLE  ? 'item-active' : 'item'}
                onClick={() => this.setState({tool:TOOL_RECTANGLE})}
              ><img src={require('./../../assets/square.svg')} alt='rectangle'/></button>
              <button onClick={() => this.erase()}><img src={require('./../../assets/eraser.svg')} alt='eraser'/></button>          
            </div>
            <div className="options" style={{marginBottom:20}}>
              <label htmlFor="">size: </label>
              <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value)})} />
            </div>
            <div className="options" style={{marginBottom:20}}>
              <label htmlFor="">color: </label>
              <input type="color" value={color} onChange={(e) => this.setState({color: e.target.value})} />
            </div>
              
              <div>
                <label htmlFor="">fill in:</label>
                <input type="checkbox" value={fill} style={{margin:'0 8'}}
                       onChange={(e) => this.setState({fill: e.target.checked})} />
                <span>
                    <label htmlFor="">with color:</label>
                    <input id='color2' type="color" value={fillColor} onChange={(e) => this.setState({fillColor: e.target.value})} />
                </span> 
              </div>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.imageData.currentImage
  }
}

export default connect(mapStateToProps,{setImageData, addImageData, undo, redo, clear})(Whiteboard);

//<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
//<img onClick={()=>this.showImg(this.state.URL)} id='thumb' style={{display: 'none', height: '150px', width:'150px'}}></img>
