import 'babel-polyfill'
import Mappersmith from 'mappersmith'
import 'mappersmith/fixtures'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { EVENTS_SEARCH_LIMIT } from 'api'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

import {
  TRIGGER_EVENTS_SEARCH,
  REQUEST_EVENTS_SEARCH_RESULTS,
  RECEIVE_EVENTS_SEARCH_RESULTS,
  REQUEST_EVENTS_SEARCH_RESULTS_FAILED,
  ADD_FLASH_MESSAGE,
  LOAD_MORE_EVENTS_SEARCH_RESULTS
} from 'actions'

import {
  triggerSearch,
  fetchSearchResults,
  loadMoreSearchResults
} from 'actions/events-search'

beforeEach(() => {
  Mappersmith.Env.Fixture.clear()
})

describe('actions/event-search', () => {
  describe('#fetchSearchResults', () => {
    describe('without filters', () => {
      let event, initialState, store
      beforeEach(() => {
        initialState = { eventsFilters: {}, xhrStatus: { currentEventsOffset: 0 } }
        store = mockStore(initialState)
        event = { id: 1 }
        Mappersmith.Env.Fixture
          .define('get')
          .matching({ url: `/api/v1/events?limit=${EVENTS_SEARCH_LIMIT}&offset=0` })
          .response([event])
      })

      it('creates REQUEST and RECEIVE actions', (done) => {
        store.dispatch(fetchSearchResults(event)).then(() => {
          const actions = store.getActions()
          expect(actions[0]).toEqual({ type: REQUEST_EVENTS_SEARCH_RESULTS })
          expect(actions[1]).toEqual({ type: RECEIVE_EVENTS_SEARCH_RESULTS, events: [event], offset: 0 })
          done()
        })
        .catch((e) => done.fail(`test failed with promise error: ${e.message}`))
      })
    })

    describe('with specific filters', () => {
      let event, initialState, store
      beforeEach(() => {
        initialState = {
          eventsFilters: { type: 'event_type', value: 'new' },
          xhrStatus: { currentEventsOffset: 0 }
        }
        store = mockStore(initialState)
        event = { id: 1 }
        Mappersmith.Env.Fixture
          .define('get')
          .matching({ url: `/api/v1/events?limit=${EVENTS_SEARCH_LIMIT}&event_type=new&offset=0` })
          .response([event])
      })

      it('creates REQUEST and RECEIVE actions using the filters', (done) => {
        store.dispatch(fetchSearchResults(event)).then(() => {
          const actions = store.getActions()
          expect(actions[0]).toEqual({ type: REQUEST_EVENTS_SEARCH_RESULTS })
          expect(actions[1]).toEqual({ type: RECEIVE_EVENTS_SEARCH_RESULTS, events: [event], offset: 0 })
          done()
        })
        .catch((e) => done.fail(`test failed with promise error: ${e.message}`))
      })
    })

    describe('with a different offset', () => {
      let event, initialState, store
      beforeEach(() => {
        initialState = {
          eventsFilters: { },
          xhrStatus: { currentEventsOffset: 4 }
        }
        store = mockStore(initialState)
        event = { id: 1 }
        Mappersmith.Env.Fixture
          .define('get')
          .matching({ url: `/api/v1/events?limit=${EVENTS_SEARCH_LIMIT}&offset=4` })
          .response([event])
      })

      it('creates REQUEST and RECEIVE actions pointing to the correct offset', (done) => {
        store.dispatch(fetchSearchResults(event)).then(() => {
          const actions = store.getActions()
          expect(actions[0]).toEqual({ type: REQUEST_EVENTS_SEARCH_RESULTS })
          expect(actions[1]).toEqual({ type: RECEIVE_EVENTS_SEARCH_RESULTS, events: [event], offset: 4 })
          done()
        })
        .catch((e) => done.fail(`test failed with promise error: ${e.message}`))
      })
    })

    describe('when it fails', () => {
      let event, initialState, store
      beforeEach(() => {
        initialState = { eventsFilters: {}, xhrStatus: { currentEventsOffset: 0 } }
        store = mockStore(initialState)
        event = { id: 1 }
        Mappersmith.Env.Fixture
          .define('get')
          .matching({ url: `/api/v1/events?limit=${EVENTS_SEARCH_LIMIT}&offset=0` })
          .failure()
          .response({
            responseText: JSON.stringify({
              error: true,
              message: 'some error'
            })
          })
      })

      it('creates REQUEST and RECEIVE actions pointing to the correct offset', (done) => {
        store.dispatch(fetchSearchResults(event)).then(() => {
          const actions = store.getActions()
          expect(actions[0]).toEqual({ type: REQUEST_EVENTS_SEARCH_RESULTS })
          expect(actions[1]).toEqual({
            type: REQUEST_EVENTS_SEARCH_RESULTS_FAILED,
            query: { offset: 0 }, error: 'some error'
          })
          expect(actions[2]).toEqual({
            type: ADD_FLASH_MESSAGE,
            message: { id: jasmine.any(String), type: 'error', text: 'Events search failed. "some error"' }
          })
          done()
        })
        .catch((e) => done.fail(`test failed with promise error: ${e.message}`))
      })
    })
  })

  describe('#triggerSearch', () => {
    let event, initialState, store
    beforeEach(() => {
      initialState = {
        eventsFilters: {},
        xhrStatus: { currentEventsOffset: 0 }
      }
      store = mockStore(initialState)
      event = { id: 1 }
      Mappersmith.Env.Fixture
        .define('get')
        .matching({ url: `/api/v1/events?limit=${EVENTS_SEARCH_LIMIT}&offset=0` })
        .response([event])
    })

    it('creates TRIGGER_EVENTS_SEARCH and REQUEST actions', (done) => {
      store.dispatch(triggerSearch()).then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual({ type: TRIGGER_EVENTS_SEARCH })
        expect(actions[1]).toEqual({ type: REQUEST_EVENTS_SEARCH_RESULTS })
        expect(actions[2]).toEqual({ type: RECEIVE_EVENTS_SEARCH_RESULTS, events: [event], offset: 0 })
        done()
      })
      .catch((e) => done.fail(`test failed with promise error: ${e.message}`))
    })
  })

  describe('#loadMoreSearchResults', () => {
    let event, initialState, store
    beforeEach(() => {
      initialState = {
        eventsFilters: {},
        xhrStatus: { currentEventsOffset: 4 }
      }
      store = mockStore(initialState)
      event = { id: 1 }
      Mappersmith.Env.Fixture
        .define('get')
        .matching({ url: `/api/v1/events?limit=${EVENTS_SEARCH_LIMIT}&offset=4` })
        .response([event])
    })

    it('creates LOAD_MORE_EVENTS_SEARCH_RESULTS and REQUEST actions', (done) => {
      store.dispatch(loadMoreSearchResults()).then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual({ type: LOAD_MORE_EVENTS_SEARCH_RESULTS, offset: 4 + EVENTS_SEARCH_LIMIT })
        expect(actions[1]).toEqual({ type: REQUEST_EVENTS_SEARCH_RESULTS })
        expect(actions[2]).toEqual({ type: RECEIVE_EVENTS_SEARCH_RESULTS, events: [event], offset: 4 })
        done()
      })
      .catch((e) => done.fail(`test failed with promise error: ${e.message}`))
    })
  })
})
