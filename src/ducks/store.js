import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import reducer from './reducers/index';

export default createStore(reducer, undefined, applyMiddleware( promiseMiddleware() ));