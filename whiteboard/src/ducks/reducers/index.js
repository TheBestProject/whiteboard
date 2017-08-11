import { combineReducers } from 'redux';
import ReducerUser from './reducer_user.js'
import ReducerData from './reducer_data.js'
import ReducerInitialData from './reducer_initial_data.js'

const rootReducer = combineReducers({

    userInfo: ReducerUser,
    userData: ReducerData,
    initData: ReducerInitialData

})

export default rootReducer;