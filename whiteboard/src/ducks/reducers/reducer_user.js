import { FETCH_USER } from '../actions/index'

const dummyState = {
    // id: 2,
    username: 'Billy Bob Joe',
    email: 'something@something.com',
    profilepic: 'http://im.rediff.com/getahead/2017/feb/10indiaphotos3.jpg'
  }


export default function(state = dummyState, action) {
    switch(action.type){
        
        case `${FETCH_USER}_FULFILLED`:
        return action.payload.data; 
    }

  return state
}