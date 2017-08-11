import React, { Component } from 'react';
import { SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from './sketch'; 
import './Whiteboard.css';
import './range.css';
import io from 'socket.io-client';
import testImg from './test-img';
import {Link} from 'react-router-dom';

const socket = io();
const height = window.innerHeight-60;
const width = window.innerWidth;

class Whiteboard extends Component {

  constructor(props){
    super(props);

    socket.on('receiveCanvas', (data) =>{
      //console.log('data',data);
      //var URL = data.URL.canvas ? data.URL.canvas : data.URL;
      var URL;
      if(data.URL.canvas){URL=data.URL.canvas}else{URL=data.URL}
      this.setImage(URL);
    })
    
    this.state = {
      tool:TOOL_PENCIL,
      size: 2,
      previousCol: '#444444',
      color: '#444444',
      fill: false,
      fillColor: '#444444',
      items: [],
      URL: '',
      undo : [],
      redo : []
    }

      this.setImage = this.setImage.bind(this);  
      this.save = this.save.bind(this);
      this.clear = this.clear.bind(this);
      this.showImg = this.showImg.bind(this);
      this.erase = this.erase.bind(this);
      this.autoSave = this.autoSave.bind(this);
      //this.undo = this.undo.bind(this);
      this.redo = this.redo.bind(this);
  }

  componentDidMount() {
    // wsClient.on('addItem', item => this.setState({items: this.state.items.concat([item])}));
    socket.emit(`join`, {boardId: this.props.match.params.boardid});
  }
  componentWillUnmount() {
    socket.emit('leave', {boardId: this.props.match.params.boardid})
  }

  // componentDidUpdate(){
  //   this.showImg(this.state.URL);
  // }

  setImage(URL){
    //console.log('dataReceived',URL)
    this.setState({URL:URL})
    this.showImg(URL);
  }

  showImg(URL){
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext("2d"); 
      var img = new Image();
      //console.log('URL',URL);
      img.src = URL;
      ctx.drawImage(img,0,0,width,height,0,0,width,height)
  }

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
      var m = window.confirm("Clear the Board?");
      var w = canvas.width;
      var h = canvas.height;
      if (m) {
          ctx.clearRect(0, 0, w, h);
      }
  }

  erase(){
    this.setState({previousCol: this.state.color, color: 'white', tool:TOOL_PENCIL, size:20});          
  }
  
  autoSave(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext("2d");
    let URL = canvas.toDataURL();
    socket.emit('new canvas data', {boardId: this.props.match.params.boardid, URL:URL});
    if(this.state.URL!=URL){
      this.setState({URL:URL, undo:[...this.state.undo, this.state.URL]});
    }
  }

  undo(){
    if (this.state.undo[0]){
      //push current URL into redo
      //pop last undo URL and make it new current URL
      let undoList = Object.assign(this.state.undo);
      console.log('length undo list', undoList.length);
      let lastEl = undoList.pop();
      //console.log(lastEl);
      this.setState({redo:[...this.state.redo, this.state.URL], URL:lastEl, undo:undoList});
      //show new currentURL
      socket.emit('new canvas data', {boardId: this.props.match.params.boardid, URL:lastEl});
    }
  }

  redo(){
    if (this.state.redo[0]){ 
      let redoList = Object.assign(this.state.redo);
      let lastEl = redoList.pop();
      //console.log('last',lastEl)
      this.setState({undo:[...this.state.undo,this.state.URL], URL: lastEl, redo:redoList});
    }
  }

render() {
  console.log('URL length', this.state.URL.length);
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
              <button onClick={()=>this.clear()}><img src={require('./../../assets/file-rounded-empty-sheet.svg')} alt='clear'/></button>
              <button onClick={()=>this.undo()}><img src={require('./../../assets/ic_undo_black_18px.svg')} alt='undo'/></button>
              <button onClick={()=>this.redo()}><img src={require('./../../assets/ic_redo_black_18px.svg')} alt='todo'/></button>
          </div>
          <div className='tools'>
            <div style={{marginBottom:20}}>
              <button
                style={tool == TOOL_PENCIL ? {fontWeight:'bold'} : undefined}
                className={tool == TOOL_PENCIL  ? 'item-active' : 'item'}
                onClick={() => this.setState({tool:TOOL_PENCIL, color:previousCol, size: 2})}
              ><img src={require('./../../assets/pen.svg')} alt='pen'/></button>
              <button
                style={tool == TOOL_LINE ? {fontWeight:'bold'} : undefined}
                className={tool == TOOL_LINE  ? 'item-active' : 'item'}
                onClick={() => this.setState({tool:TOOL_LINE, color:previousCol, size: 2})}
              ><img src={require('./../../assets/diagonal-line.svg')} alt='line'/></button>
              <button
                style={tool == TOOL_ELLIPSE ? {fontWeight:'bold'} : undefined}
                className={tool == TOOL_ELLIPSE  ? 'item-active' : 'item'}
                onClick={() => this.setState({tool:TOOL_ELLIPSE,color:previousCol, size: 2})}
              ><img src={require('./../../assets/oval.svg')} alt='oval'/></button>
              <button
                style={tool == TOOL_RECTANGLE ? {fontWeight:'bold'} : undefined}
                className={tool == TOOL_RECTANGLE  ? 'item-active' : 'item'}
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
        <div className="Sketchpad">
          <SketchPad 
            width={width}
            height={height}
            animate={true}
            size={size}
            color={color}
            fillColor={fill ? fillColor : ''}
            items={items}
            tool={tool}
            autoSave={this.autoSave}
            //onCompleteItem={(i) => wsClient.emit('addItem', i)}
          />
        </div>
        
      </div>
    );
  }
}

export default Whiteboard;

//<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
//<img onClick={()=>this.showImg(this.state.URL)} id='thumb' style={{display: 'none', height: '150px', width:'150px'}}></img>
