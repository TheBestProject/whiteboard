import dummyState from '../dummyState';
import { FETCH_GROUPS, FETCH_PROJECTS, FETCH_BOARDS } from './../actions/index';



export default function(state = dummyState, action) {
    switch(action.type){
        case `${FETCH_GROUPS}_FULFILLED`:
            // console.log('groups', action.payload);
            return Object.assign({}, state, {groups: action.payload})
        case `${FETCH_PROJECTS}_FULFILLED`:
            // console.log('projects', action.payload);
            return Object.assign({}, state, {projects: action.payload})
        case `${FETCH_BOARDS}_FULFILLED`:
            // console.log('boards', action.payload);
            return Object.assign({}, state, {boards: action.payload})
        default:
            return state; 
    }
}