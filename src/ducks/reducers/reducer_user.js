import { FETCH_USER, CHECK_USER } from '../actions/index'

const intitialState = {
    loggedIn: false,
    loggedLoading: true,
    id: null,
    username: '',
    email: '',
    profilepic: ''
}
const dummyState = {
    // id: 2,
    username: 'Billy Bob Joe',
    email: 'something@something.com',
    profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg'
  }


export default function(state = intitialState, action) {
    switch(action.type){
      case `${CHECK_USER}_PENDING`:
        return Object.assign({}, state, {loggedIn: false, loggedLoading: true})
      case `${CHECK_USER}_FULFILLED`:
        return Object.assign({}, state, {loggedIn: action.payload, loggedLoading: false})
      case `${FETCH_USER}_FULFILLED`:
        return Object.assign({}, state, action.payload.data); 
      default:
        return state
    }

  return state
}