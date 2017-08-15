const initialState = {
    currentImage : [],
    redoList: []
};

const SET_IMAGE_DATA = 'SET_IMAGE_DATA';
const UNDO = 'UNDO';
const REDO = 'REDO';
const CLEAR = 'CLEAR';


export function setImageData(payload){
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
    switch (action.type){
        case SET_IMAGE_DATA:
            //console.log('type',action.type);        
            if(action.payload){
                return Object.assign({},state,{currentImage:[...state.currentImage,action.payload]})
            }
        case UNDO:
            var newImageData = Object.assign(state.currentImage);
            if(newImageData[0]){
                console.log('new before', newImageData);
                var pop = newImageData.pop();
                console.log('new after', newImageData);
                //console.log('pop',pop);
                //console.log('type Undo',action.type)
                return Object.assign({},state,{currentImage:newImageData, redoList:[...state.redoList, pop]})
            }
        default:
         return state;
    }
}