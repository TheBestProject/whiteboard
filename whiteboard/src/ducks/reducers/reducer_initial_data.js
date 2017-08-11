import  {FETCH_INITIAL_DATA}  from '../actions/index'


export default function(state = [], action) {
    
    switch(action.type){
        case FETCH_INITIAL_DATA + "_FULFILLED":
        
        return [action.payload.data, ...state]    
    }
    // console.log('action received', action)
        return state
}