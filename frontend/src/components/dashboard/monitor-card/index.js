import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'

import { Link } from 'react-router'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import SyncFailureIcon from 'material-ui/svg-icons/notification/sync-problem'
import LinkIcon from 'material-ui/svg-icons/navigation/arrow-forward'

const styles = {
  spinner: {
    margin: '50px',
    display: 'inline-block',
    position: 'relative'
  },
  icon: {
    margin: '50px',
    width: '50px',
    height: '50px',
    display: 'inline-block',
    position: 'relative'
  }
}

export default class MonitorCard extends Component {
  static get propTypes () {
    return {
      icon: PropTypes.element,
      monitorValue: PropTypes.string,
      cardLabel: PropTypes.string,
      linkPath: PropTypes.string,
      cardStyle: PropTypes.shape({
        primary: PropTypes.shape({
          backgroundColor: PropTypes.string,
          color: PropTypes.string
        }),
        secondary: PropTypes.shape({
          backgroundColor: PropTypes.string,
          color: PropTypes.string
        })
      }).isRequired,
      hasFailed: PropTypes.bool,
      isLoading: PropTypes.bool.isRequired
    }
  }

  render () {
    return (
      <Paper zDepth={4} className='monitor-card'>
        <div className='content' style={this.props.cardStyle.primary}>
          {this.renderContent()}
        </div>
        {this.renderBar()}
      </Paper>
    )
  }

  renderContent () {
    if (this.props.isLoading) {
      return (
        <div className='page-loader'>
          <RefreshIndicator
            size={50}
            left={0}
            top={0}
            status='loading'
            style={styles.spinner} />
        </div>
      )
    }

    if (this.props.hasFailed) {
      return [
        <div key='monitor--icon' className='monitor--icon'>
          <SyncFailureIcon className='sync-failed' style={this.props.cardStyle.primary} />
        </div>,
        <div key='monitor--value' className='monitor--value--failed'>
          OFFLINE
        </div>
      ]
    }

    return [
      <div key='monitor--icon' className='monitor--icon'>
        {this.props.icon}
      </div>,
      <div key='monitor' className='monitor'>
        <div className='monitor--value'>
          <div className='monitor-card--text'>
            {this.props.monitorValue}
          </div>
        </div>
        <div className='monitor--label'>
          {this.props.monitorLabel}
        </div>
      </div>
    ]
  }

  renderBar () {
    return (
      <Link
        className='bar'
        to={this.props.linkPath}
        style={{
          ...this.props.cardStyle.secondary,
          textDecoration: 'none'
        }}>
        <div className='bar--text'>
          {this.props.cardLabel}
        </div>
        <LinkIcon className='bar--link' style={this.props.cardStyle.secondary} />
      </Link>
    )
  }
}
