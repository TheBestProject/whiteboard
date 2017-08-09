import axios from 'axios'

const ROOT_URL = 'http://localhost:4000/api'

export const FETCH_USER = 'FETCH_USER'
export function fetchUser(userid){

const URL = `${ROOT_URL}/user/${userid}`
const request = axios.get(URL)

console.log('requestuser:', request)
return{
    type: FETCH_USER,
    payload: request
}}

export const FETCH_GROUP = 'FETCH_GROUP'
export function fetchGroup(groupid){

const URL = `${ROOT_URL}/group/${groupid}`
const request = axios.get(URL)

console.log('requestgroup:', request)
return{
    type: FETCH_GROUP,
    payload: request
}}

export const FETCH_PROJECT = 'FETCH_PROJECT'
export function fetchProject(projectid){

const URL = `${ROOT_URL}/project/${projectid}`
const request = axios.get(URL)

console.log('requestproject:', request)
return{
    type: FETCH_PROJECT,
    payload: request
}}