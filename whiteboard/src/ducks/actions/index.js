import axios from 'axios'

// const ROOT_URL = 'http://localhost:4000/api'

export const FETCH_USER = 'FETCH_USER'
export function fetchUser(userid){

    const URL = `/api/user`
    const request = axios.get(URL)

    console.log('requestuser:', request)
    return{
        type: FETCH_USER,
        payload: request
    }
}

export const FETCH_GROUPS = 'FETCH_GROUPS'
export function fetchGroups(userid){

    const URL = `/api/groups/${userid}`
    const promise = axios.get(URL).then(res => res.data)
    return{
        type: FETCH_GROUPS,
        payload: promise
    }
}

export const FETCH_PROJECTS = 'FETCH_PROJECTS'
export function fetchProjects(userid){

    const URL = `/api/projects/${userid}`
    const promise = axios.get(URL).then(res => res.data)
    return{
        type: FETCH_PROJECTS,
        payload: promise
    }
}

export const FETCH_BOARDS = 'FETCH_BOARDS'
export function fetchBoards(userid){

    const URL = `/api/boards/${userid}`
    const promise = axios.get(URL).then(res => res.data)
    return{
        type: FETCH_BOARDS,
        payload: promise
    }
}


export const FETCH_INITIAL_DATA = 'FETCH_INITIAL_DATA'
export function fetchInitialData(userid){

    const URL = `/api/initdata/${userid}`
    const request = axios.get(URL)

    console.log('requestuser:', request)
    return{
        type: FETCH_INITIAL_DATA,
        payload: request
    }}

export const FETCH_GROUP = 'FETCH_GROUP'
    export function fetchGroup(groupid){

    const URL = `/api/group/${groupid}`
    const request = axios.get(URL)

    console.log('requestgroup:', request)
    return{
        type: FETCH_GROUP,
        payload: request
    }}

export const FETCH_PROJECT = 'FETCH_PROJECT'
    export function fetchProject(projectid){

    const URL = `/api/project/${projectid}`
    const request = axios.get(URL)

    console.log('requestproject:', request)
    return{
        type: FETCH_PROJECT,
        payload: request
    }}