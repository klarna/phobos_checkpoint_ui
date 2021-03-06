import {
  FAILURE_SHOW_OVERVIEW,
  FAILURE_HIDE_OVERVIEW,
  RECEIVE_FAILURES_SEARCH_RESULTS,
  FAILURE_SHOW_RETRY,
  FAILURE_HIDE_RETRY,
  RECEIVE_FAILURE_RETRY,
  FAILURE_SHOW_DELETE,
  FAILURE_HIDE_DELETE,
  RECEIVE_FAILURE_DELETE,
  DELETE_FAILURE
} from 'actions'

function patchFailure (state, action, params) {
  return state.map((failure) => {
    if (failure.id === action.failure.id) {
      return { ...failure, ...params }
    }
    return failure
  })
}

export default (state = [], action) => {
  switch (action.type) {
    case FAILURE_SHOW_OVERVIEW:
      return patchFailure(state, action, { overviewVisible: true })

    case FAILURE_HIDE_OVERVIEW:
      return patchFailure(state, action, { overviewVisible: false, error: null })

    case RECEIVE_FAILURES_SEARCH_RESULTS:
      return action.offset <= 0
        ? action.failures
        : state.concat(action.failures)

    case FAILURE_SHOW_RETRY:
      return patchFailure(state, action, { retryVisible: true })

    case FAILURE_HIDE_RETRY:
      return patchFailure(state, action, { retryVisible: false, error: null })

    case RECEIVE_FAILURE_RETRY:
      return patchFailure(state, action, { acknowledged: action.acknowledged, error: null })

    case FAILURE_SHOW_DELETE:
      return patchFailure(state, action, { deleteVisible: true })

    case FAILURE_HIDE_DELETE:
      return patchFailure(state, action, { deleteVisible: false, error: null })

    case RECEIVE_FAILURE_DELETE:
      return patchFailure(state, action, { acknowledged: action.acknowledged, error: null })

    case DELETE_FAILURE:
      return state.filter((failure) => {
        return failure.id !== action.failure.id
      })

    default:
      return state
  }
}
