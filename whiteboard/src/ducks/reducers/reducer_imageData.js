import dummy from './../../components/Whiteboard/sketch/dummy';
import io from 'socket.io-client';
const socket = io();

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


export function addImageData(boardId, item){
    socket.emit('new canvas data', {boardId, item});
    return {
        type: ADD_IMAGE_DATA,
        payload: item
    }
}

export function setImageData(payload) {
    return {
        type: SET_IMAGE_DATA,
        payload: payload
    }
}

export function undo(){
    return{type:UNDO}
}

export function redo(){
    return{type:REDO}
}

export function clear(){
    return{type:CLEAR}
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
                // return Object.assign({}, state, {currentImage: JSON.parse(action.payload)});
                return Object.assign({}, state, {currentImage: action.payload});
            }
        case UNDO:
            if(newImageData[0]){
                var pop = newImageData.pop();
                return Object.assign({},state,{currentImage:newImageData, redoList:[...state.redoList, pop]});
            }
            else if (state.previousImage[0]){
                return Object.assign({},state,{currentImage:state.previousImage, redoList:[], previousImage:[]})                            
            } else {return state;} 
        case REDO:
            if(newRedoList[0]){                
                var pop = newRedoList.pop();
                return Object.assign({},state,{currentImage:[...state.currentImage, pop], redoList:newRedoList})
            } else{return state;}
        case CLEAR:
            return Object.assign({},state,{currentImage:[], redoList:[], previousImage:state.currentImage})            
        default:
         return state;
    }
}