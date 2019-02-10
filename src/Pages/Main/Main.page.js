import React from 'react'
import './Main.style.css'

export default class Main extends React.Component {
  render () {
    return (
      <div className={`Main__container`}>
        {this.props.children}
      </div>
    )
  }
}

Main.propTypes = {

}