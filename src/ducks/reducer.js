import dummyState from './dummyState';

// const initialState = {
//   loggedStatus: false,
//   userInfo: {},
//   groups: [],
//   projects: [],
//   boards: []
// }

export default function reducer(state = dummyState, action) {
  switch (action.type) {
    case "something":
      return 'something'
    default:
      return state
  }
}