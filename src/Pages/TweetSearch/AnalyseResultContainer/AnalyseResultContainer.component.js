import React from 'react'
import './AnalyseResultContainer.style.css'
import { BasicFunctions }  from '../../../utils/BasicFunctions/index'

/*
Made By: André Feitosa
*/

export default class AnalyseResultContainer extends React.Component {


    percentageCheck = (emotion) => {
        return (emotion.accuracy * 100).toFixed(2) + '%'
    }

    capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  

    render() {
        const { predominant, dataEmotions, limiteHeight } = this.props

        let emotions = BasicFunctions.sortBy(dataEmotions, {
          prop: 'accuracy',
          desc: true
        })

        return (
            <div className='result_container' style={ limiteHeight ? {height: '230px'} : null}>

            <div className='result_container-predominant'>
              <span style={{ color: `var(--${predominant})` }}>
                {this.capitalizeFirstLetter(predominant)}
              </span>
              <span style={{ fontSize: '14px' }}>
                O sentimento predominante
              </span>
            </div>
  
            <div className='result_container-accuracy'>
              {
                emotions.map((emotion, i) => {
                  return (
                    <div key={`emotion_${i}`} className='result_container-row'>
                      <div className='result_container-subtitle_container'>
                        <span>
                          {this.capitalizeFirstLetter(emotion.emotion)}
                        </span>
                      </div>
                      <div className='result_container-bar_container'>
                        <div className='result_container-bar-stick' />
                        <div className='result_container-bar-status' style={{
                          width: `${this.percentageCheck(emotion)}`,
                          backgroundColor: `var(--${emotion.emotion})`
                        }} />
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: `var(--${emotion.emotion})`
                      }} >
                        {this.percentageCheck(emotion)}
                      </span>
                    </div>
                  )
                })
              }
            </div>
  
          </div>
        )
    }
}

AnalyseResultContainer.defaultProps = {
  limiteHeight: false
}