const initialState = {
  something: 3
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "something":
      return 'something'
    default:
      return state
  }
}