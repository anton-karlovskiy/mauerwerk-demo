import 'antd/dist/antd.css'
import './styles.css'
import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import lodash from 'lodash'
import { Icon } from 'antd'
import data from './data'
import Header from './Header'
import { Grid, Slug, Fade } from 'mauerwerk'

const Cell = ({ toggle, name, height, description, css, maximized }) => (
  <div
    className="cell"
    style={{ backgroundImage: css, cursor: !maximized ? 'pointer' : 'auto' }}
    onClick={!maximized ? toggle : undefined}>
    <Fade show={maximized} delay={maximized ? 400 : 0}>
      <div className="details">
        <Slug delay={600}>
          <div className="circle" style={{ background: css }} />
          <div className="close">
            <Icon type="close" style={{ cursor: 'pointer' }} onClick={toggle} />
          </div>
          <h1>{name}</h1>
          <p>{description}</p>
        </Slug>
      </div>
    </Fade>
    <Fade
      show={!maximized}
      from={{ opacity: 0, transform: 'translate3d(0,140px,0)' }}
      enter={{ opacity: 1, transform: 'translate3d(0,0px,0)' }}
      leave={{ opacity: 0, transform: 'translate3d(0,-50px,0)' }}
      delay={maximized ? 0 : 400}>
      <div className="default">{name}</div>
    </Fade>
  </div>
)

class App extends Component {
  state = { data, columns: 2, margin: 70, filter: '', height: true }
  search = e => this.setState({ filter: e.target.value })
  shuffle = () => this.setState(state => ({ data: lodash.shuffle(state.data) }))
  setColumns = e => this.setState({ columns: parseInt(e.key) })
  setMargin = e => this.setState({ margin: parseInt(e.key) })
  setHeight = e => this.setState({ height: e })
  render() {
    const data = this.state.data.filter(
      d => d.name.toLowerCase().indexOf(this.state.filter) != -1
    )
    return (
      <div className="main">
        <Header
          {...this.state}
          search={this.search}
          shuffle={this.shuffle}
          setColumns={this.setColumns}
          setMargin={this.setMargin}
          setHeight={this.setHeight}
        />
        <Grid
          className="grid"
          // Arbitrary data, should contain keys, possibly heights, etc.
          data={data}
          // Key accessor, instructs grid on how to fet individual keys from the data set
          keys={d => d.name}
          // Can be a fixed value or an individual data accessor
          heights={this.state.height ? d => d.height : 200}
          // Number of columns
          columns={this.state.columns}
          // Space between elements
          margin={this.state.margin}
          // Removes the possibility to scroll away from a maximized element
          lockScroll={false}
          // Delay when active elements (blown up) are minimized again
          closeDelay={400}>
          {(data, maximized, toggle) => (
            <Cell {...data} maximized={maximized} toggle={toggle} />
          )}
        </Grid>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
