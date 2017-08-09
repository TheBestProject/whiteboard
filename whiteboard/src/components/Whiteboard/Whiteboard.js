import React, { Component } from 'react';
import { SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from './sketch'; 
// import IO from 'socket.io-client';

// const wsClient = IO(`ws://127.0.0.1:12346`);

class Whiteboard extends Component {

  // socket = null;
  constructor(props){
    super(props);

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

      this.save = this.save.bind(this);
      this.clear = this.clear.bind(this);
      this.displayThumb = this.displayThumb.bind(this);
      this.showImg = this.showImg.bind(this);
      this.erase = this.erase.bind(this);
      this.autoSave = this.autoSave.bind(this);
      this.undo = this.undo.bind(this);

  }

  // componentDidMount() {
  //   wsClient.on('addItem', item => this.setState({items: this.state.items.concat([item])}));
  // }

showImg(URL){
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext("2d"); 
      var img = new Image();
      img.src = URL;
      ctx.drawImage(img,0,0,500,500,0,0,500,500)
  }

  displayThumb(){
        document.getElementById("thumb").style.border = "1px solid";  
        document.getElementById("thumb").src = this.state.URL;
        document.getElementById("thumb").style.display = "inline";
  }

  save() {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext("2d"); 
        this.setState({URL:canvas.toDataURL()});
        this.clear();
    }

  clear() {
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext("2d");
      var m = window.confirm("Want to clear");
      var w = canvas.width;
      var h = canvas.height;
      if (m) {
          ctx.clearRect(0, 0, w, h);
      }
  }

  erase(){
    this.setState({previousCol: this.state.color, color: 'white', tool:TOOL_PENCIL, size:20});          
  }
  
  componentDidUpdate(){
    this.displayThumb();
    this.showImg(this.state.URL);
  }

  autoSave(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext("2d");
    let URL = canvas.toDataURL();
    this.setState({URL:URL, undo:[...this.state.undo, this.state.URL]});
  }

  undo(){
    if (this.state.undo[1]){
      //push current URL into redo
      //pop last undo URL and make it new current URL
      let undoList = Object.assign(this.state.undo);
      let lastEl = undoList.pop();
      this.setState({redo:[...this.state.redo, this.state.URL], URL:lastEl, undo:undoList});
      //show new currentURL
      //this.showImg(lastEl);
    }
  }

  redo(){
    if (this.state.redo[0]){ 
      let redoList = Object.assign(this.state.redo);
      let lastEl = redoList.pop();
      console.log('last',lastEl)
      this.setState({undo:[...this.state.undo,this.state.URL], URL: lastEl, redo:redoList});
    }
  }

render() {
  console.log(this.state.undo);
  const { tool, size, color, fill, fillColor, items, previousCol } = this.state;
    return (
      <div>
        <h1>React SketchPad</h1>
        <div style={{float:'left', marginRight:20}}>
          <SketchPad 
            width={500}
            height={500}
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
        <div style={{float:'left'}}>
          <div className="tools" style={{marginBottom:20}}>
            <button
              style={tool == TOOL_PENCIL ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_PENCIL  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_PENCIL, color:previousCol, size: 2})}
            >Pencil</button>
            <button
              style={tool == TOOL_LINE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_LINE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_LINE})}
            >Line</button>
            <button
              style={tool == TOOL_ELLIPSE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_ELLIPSE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_ELLIPSE})}
            >Ellipse</button>
            <button
              style={tool == TOOL_RECTANGLE ? {fontWeight:'bold'} : undefined}
              className={tool == TOOL_RECTANGLE  ? 'item-active' : 'item'}
              onClick={() => this.setState({tool:TOOL_RECTANGLE})}
            >Rectangle</button>
          </div>
          <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">size: </label>
            <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value)})} />
          </div>
          <div className="options" style={{marginBottom:20}}>
            <label htmlFor="">color: </label>
            <input type="color" value={color} onChange={(e) => this.setState({color: e.target.value})} />
          </div>
            
          {(this.state.tool == TOOL_ELLIPSE || this.state.tool == TOOL_RECTANGLE) ?
            <div>
              <label htmlFor="">fill in:</label>
              <input type="checkbox" value={fill} style={{margin:'0 8'}}
                     onChange={(e) => this.setState({fill: e.target.checked})} />
              {fill ? <span>
                  <label htmlFor="">with color:</label>
                  <input id='color2' type="color" value={fillColor} onChange={(e) => this.setState({fillColor: e.target.value})} />
                </span> : ''}
            </div> : ''}
            <button onClick={() => this.erase()} className="eraser">Eraser</button>
            <button onClick={()=>this.save()}>Save</button>
            <button onClick={()=>this.clear()}>Clear</button>
            <button onClick={()=>this.undo()}>Undo</button>
            <button onClick={()=>this.redo()}>Redo</button>
            
        </div>
        <img onClick={()=>this.showImg(this.state.URL)} id='thumb' style={{display: 'none', height: '150px', width:'150px'}}></img>
      </div>
    );
  }
}

export default Whiteboard;