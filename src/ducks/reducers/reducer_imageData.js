import io from 'socket.io-client';
const socket = io();

let pixel = [[{
    color: "#444444 ",
    id: "26d1131a-67e5-47bb-8842-0b97316ff269",
    points: [{x:0,y:0}],
    size: 2,
    tool: 'pencil'
  }]]

const initialState = {
    currentImage : [],
    redoList: [],
    previousImage:[]
};

const SET_IMAGE_DATA = 'SET_IMAGE_DATA';
const ADD_IMAGE_DATA = 'ADD_IMAGE_DATA';
const UNDO = 'UNDO';
const REDO = 'REDO';
const CLEAR = 'CLEAR';


export function addImageData(payload){
    // socket.emit('new canvas data', {boardId, item});
    //console.log(payload);
    return {
        type: ADD_IMAGE_DATA,
        payload: payload
    }
}

export function setImageData(payload) {
    return {
        type: SET_IMAGE_DATA,
        payload: payload
    }
}

export function undo(payload){
    return{
        type:UNDO,
        payload: payload
    }
}

export function redo(payload){
    return{
        type:REDO,
        payload: payload
    }
}

export function clear(payload){
    return{
        type:CLEAR,
        payload: payload
    }
}

export default function changeImageData(state=initialState,action){
    var newImageData = JSON.parse(JSON.stringify(state.currentImage));
    var newRedoList = JSON.parse(JSON.stringify(state.redoList))
    switch (action.type){
        case ADD_IMAGE_DATA:
            if(action.payload){
                return Object.assign({},state,{currentImage:[...state.currentImage,action.payload]})
            }
        case SET_IMAGE_DATA:
            if(action.payload) {
                return Object.assign({}, state, {currentImage: action.payload});
            }
        case UNDO:
            if(newImageData[1]){
                var pop = newImageData.pop();
                socket.emit('new canvas array', {boardId: action.payload, items:newImageData})
                return Object.assign({},state,{currentImage:newImageData, redoList:[...state.redoList, pop]});
            }
            else if (state.previousImage[0]){   // if board was cleared, this will return the image before it was cleared
                socket.emit('new canvas array', {boardId: action.payload, items:state.previousImage})
                return Object.assign({},state,{currentImage:state.previousImage, redoList:[], previousImage:[]})                            
            } else {return state;} 
        case REDO:
            if(newRedoList[0]){                
                var pop = newRedoList.pop();
                //socket.emit('new canvas array', {boardId: action.payload, items:newImageData})   
                socket.emit('new canvas item', {boardId: action.payload, item:pop[0]})                
                return Object.assign({},state,{currentImage:[...state.currentImage, pop], redoList:newRedoList})
            } else{return state;}
        case CLEAR:
            socket.emit('new canvas array', {boardId: action.payload, items:pixel})        
            return Object.assign({},state,{currentImage:pixel, redoList:[], previousImage:state.currentImage})            
        default:
         return state;
    }
}