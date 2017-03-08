import {
  REQUEST_EVENTS_SEARCH_RESULTS,
  RECEIVE_EVENTS_SEARCH_RESULTS,
  REQUEST_EVENTS_SEARCH_RESULTS_FAILED,
  LOAD_MORE_EVENTS_SEARCH_RESULTS,
  TRIGGER_EVENTS_SEARCH,
  REQUEST_FAILURES_SEARCH_RESULTS,
  RECEIVE_FAILURES_SEARCH_RESULTS,
  REQUEST_FAILURES_SEARCH_RESULTS_FAILED,
  LOAD_MORE_FAILURES_SEARCH_RESULTS,
  TRIGGER_FAILURES_SEARCH,
  REQUEST_FAILURE_RETRY,
  RECEIVE_FAILURE_RETRY,
  REQUEST_FAILURE_RETRY_FAILED,
  REQUEST_FAILURE_DELETE,
  RECEIVE_FAILURE_DELETE,
  REQUEST_FAILURE_DELETE_FAILED,
  REQUEST_EVENT_RETRY,
  RECEIVE_EVENT_RETRY,
  REQUEST_EVENT_RETRY_FAILED,
  REQUEST_EVENT_DETAILS,
  RECEIVE_EVENT_DETAILS
} from 'actions'

const initialState = {
  isFetchingEvents: false,
  isRetryingEvent: false,
  isFetchingEventDetails: false,
  currentEventsOffset: 0,
  lastEventsLoadSize: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TRIGGER_FAILURES_SEARCH:
    case TRIGGER_EVENTS_SEARCH:
      return {...state,
        currentEventsOffset: 0,
        lastEventsLoadSize: 0
      }

    case REQUEST_FAILURES_SEARCH_RESULTS:
    case REQUEST_EVENTS_SEARCH_RESULTS:
      return {...state,
        isFetchingEvents: true
      }

    case RECEIVE_FAILURES_SEARCH_RESULTS:
      return {...state,
        isFetchingEvents: false,
        lastEventsLoadSize: action.failures.length
      }

    case RECEIVE_EVENTS_SEARCH_RESULTS:
      return {...state,
        isFetchingEvents: false,
        lastEventsLoadSize: action.events.length
      }

    case REQUEST_FAILURES_SEARCH_RESULTS_FAILED:
    case REQUEST_EVENTS_SEARCH_RESULTS_FAILED:
      return {...state,
        isFetchingEvents: false
      }

    case LOAD_MORE_FAILURES_SEARCH_RESULTS:
    case LOAD_MORE_EVENTS_SEARCH_RESULTS:
      return {...state,
        currentEventsOffset: action.offset
      }

    case REQUEST_FAILURE_DELETE:
    case REQUEST_FAILURE_RETRY:
    case REQUEST_EVENT_RETRY:
      return {...state,
        isRetryingEvent: true
      }

    case RECEIVE_FAILURE_DELETE:
    case RECEIVE_EVENT_RETRY:
    case RECEIVE_FAILURE_RETRY:
    case REQUEST_FAILURE_DELETE_FAILED:
    case REQUEST_FAILURE_RETRY_FAILED:
    case REQUEST_EVENT_RETRY_FAILED:
      return {...state,
        isRetryingEvent: false
      }

    case REQUEST_EVENT_DETAILS:
      return {...state,
        isFetchingEventDetails: true
      }

    case RECEIVE_EVENT_DETAILS:
      return {...state,
        isFetchingEventDetails: false
      }

    default:
      return state
  }
}
