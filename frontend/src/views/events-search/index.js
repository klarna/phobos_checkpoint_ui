import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import LoadMore from 'components/load-more'
import EmptyEvent from 'components/empty-event'
import EventsList from 'components/events-list'
import SearchInput from 'components/search-input'
import CircularProgress from 'material-ui/CircularProgress'

import { fetchSearchResults, loadMoreSearchResults, triggerSearch } from 'actions/events-search'
import { changeSearchInputFilterType, changeSearchInputFilterValue } from 'actions/search-input-filter'
import { showEventOverview } from 'actions/event-overview'

export class EventsSearch extends Component {
  static get propTypes () {
    return {
      fetchSearchResults: PropTypes.func.isRequired,
      loadMoreSearchResults: PropTypes.func.isRequired,
      triggerSearch: PropTypes.func.isRequired,
      changeSearchInputFilterType: PropTypes.func.isRequired,
      changeSearchInputFilterValue: PropTypes.func.isRequired,
      showEventOverview: PropTypes.func.isRequired,

      xhrStatus: PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.string,
        isFetchingEvents: PropTypes.bool
      }),
      eventsFilters: PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.string
      }),
      events: PropTypes.arrayOf(
        PropTypes.shape({
          onShowOverview: PropTypes.func,
          event: PropTypes.shape({
            id: PropTypes.number,
            group_id: PropTypes.string,
            topic: PropTypes.string,
            entity_id: PropTypes.string,
            event_type: PropTypes.string,
            event_time: PropTypes.string,
            event_version: PropTypes.string,
            checksum: PropTypes.string,
            payload: PropTypes.object
          })
        })
      ),
      location: PropTypes.shape({
        query: PropTypes.object
      })
    }
  }

  componentDidMount () {
    const { type, value } = this.props.location.query
    if (type && value) {
      this.props.changeSearchInputFilterType(type)
      this.props.changeSearchInputFilterValue(value)
    }

    this.props.events.length === 0 &&
      this.props.fetchSearchResults({ offset: 0 })
  }

  render () {
    const { events } = this.props
    const { type, value } = this.props.eventsFilters

    return (
      <div className='events-search'>
        <SearchInput triggerSearch={this.props.triggerSearch} filterType={type} filterValue={value}/>
        <div>
          <EventsList events={events} />
          <LoadMore {...this.props} />
          <EmptyEvent
            events={events}
            isFetchingEvents={this.props.xhrStatus.isFetchingEvents}/>
        </div>
        {
          this.isFetchingFirstPage() &&
            <div className='page-loader'>
              <CircularProgress />
            </div>
        }
      </div>
    )
  }

  isFetchingFirstPage () {
    return this.props.xhrStatus.isFetchingEvents &&
      this.props.events.length === 0
  }
}

export default connect(
  (state) => state, {
    fetchSearchResults,
    loadMoreSearchResults,
    triggerSearch,
    changeSearchInputFilterType,
    changeSearchInputFilterValue,
    showEventOverview
  }
)(EventsSearch)
