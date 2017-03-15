import React from 'react'
import jasmineEnzyme from 'jasmine-enzyme'
import { mount } from 'enzyme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import MonitorCard from 'components/dashboard/monitor-card'

const mountComponent = (props) => mount(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <MonitorCard {...props} />
  </MuiThemeProvider>
)

describe('<MonitorCard />', () => {
  let props, component

  beforeEach(() => {
    jasmineEnzyme()
    props = {
      classCondition: false,
      text: 7,
      failed: false,
      loading: false
    }
  })

  it('renders <MonitorCard />', () => {
    component = mountComponent(props)
    expect(component.find('.badge').length).toEqual(1)
  })

  it('renders text without spinner', () => {
    component = mountComponent(props)
    expect(component.find('.badge').text()).toEqual('7')
    expect(component.find('.page-loader').length).toEqual(0)
    expect(component.find('.sync-failed').length).toEqual(0)
  })

  describe('when loading', () => {
    beforeEach(() => {
      props = { ...props, loading: true }
    })

    it('renders spinner without text', () => {
      component = mountComponent(props)
      expect(component.find('.badge').text()).toEqual('')
      expect(component.find('.page-loader').length).toEqual(1)
      expect(component.find('.sync-failed').length).toEqual(0)
    })
  })

  describe('when failed', () => {
    beforeEach(() => {
      props = { ...props, failed: true }
    })

    it('renders sync failure icon without text', () => {
      component = mountComponent(props)
      expect(component.find('.badge').text()).toEqual('')
      expect(component.find('.sync-failed').length).toEqual(1)
    })
  })
})