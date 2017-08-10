import { combineReducers } from 'redux';
import  ReducerUser  from './reducer_user.js'
import ReducerData from './reducer_data.js'

const rootReducer = combineReducers({

    userInfo: ReducerUser,
    userData: ReducerData

})

export default rootReducer;