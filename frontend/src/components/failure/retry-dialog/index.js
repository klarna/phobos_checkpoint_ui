import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loading from 'components/event/loading'

import { hideFailureRetry, performFailureRetry } from 'actions/failures/retry'

import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'

class FailureRetryDialog extends Component {
  static get propTypes () {
    return {
      onHideRetry: PropTypes.func.isRequired,
      onPerformRetry: PropTypes.func.isRequired,
      isRetryingFailure: PropTypes.bool.isRequired,

      failure: PropTypes.shape({
        id: PropTypes.number,
        retryVisible: PropTypes.bool
      }).isRequired
    }
  }

  static get defaultProps () {
    return {
      isRetryingFailure: false,
      failure: {}
    }
  }

  render () {
    return (
      <Dialog
        modal={!!this.props.isRetryingFailure}
        title={this.renderTitle()}
        open={!!this.props.failure.retryVisible}
        bodyStyle={{maxWidth: '300px'}}
        contentStyle={{maxWidth: '300px'}}
        onRequestClose={() => this.hide()}
        actions={[
          <RaisedButton
            primary
            label='Retry'
            disabled={this.props.isRetryingFailure}
            onClick={() => this.performRetry()}/>
        ]}>
        <div style={{textAlign: 'center'}}>
          <Loading visible={this.props.isRetryingFailure}/>
        </div>
      </Dialog>
    )
  }

  renderTitle () {
    if (this.props.isRetryingFailure) {
      return 'Retrying failure...'
    }
    return 'Are you sure?'
  }

  hide () {
    this.props.onHideRetry(this.props.failure)
  }

  performRetry () {
    this.props.onPerformRetry(this.props.failure)
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  isRetryingFailure: state.xhrStatus.isRetryingFailure
})

export default connect(mapStateToProps, {
  onHideRetry: hideFailureRetry,
  onPerformRetry: performFailureRetry
})(FailureRetryDialog)
