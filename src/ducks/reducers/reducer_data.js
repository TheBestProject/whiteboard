import dummyState from '../dummyState';
import { FETCH_GROUPS, FETCH_PROJECTS, FETCH_BOARDS } from './../actions/index';

const initialState = {
    groups: [],
    groupsLoad: true,
    projects: [],
    projectsLoad: true,
    boards: [],
    boardsLoad: true
}

export default function(state = initialState, action) {
    switch(action.type){
        case `${FETCH_GROUPS}_PENDING`:
            return Object.assign({}, state, {groupsLoad: true})
        case `${FETCH_GROUPS}_FULFILLED`:
            // console.log('groups', action.payload);
            return Object.assign({}, state, {groups: action.payload, groupsLoad: false})
        case `${FETCH_PROJECTS}_PENDING`:
            return Object.assign({}, state, {projectsLoad: true})
        case `${FETCH_PROJECTS}_FULFILLED`:
            // console.log('projects', action.payload);
            return Object.assign({}, state, {projects: action.payload, projectsLoad: false})
        case `${FETCH_BOARDS}_PENDING`:
            return Object.assign({}, state, {boardsLoad: true})
        case `${FETCH_BOARDS}_FULFILLED`:
            // console.log('boards', action.payload);
            return Object.assign({}, state, {boards: action.payload, boardsLoad: false})
        default:
            return state; 
    }
}