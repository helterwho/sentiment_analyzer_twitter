import React from 'react'
import './GenericTweetContainer.style.css'

/*
Made By: André Feitosa
*/

export default class GenericTweetContainer extends React.Component {
  render () {
    const { text, screenName, name, dateCreation, profilePic,
         darkMode, viewMode} = this.props

    const newDate =  new Date(dateCreation)
    const dataInicio = newDate.toLocaleString('pt-br').substr(0, 16)

    return (
        <div className={`GenericTweetContainer-${viewMode}`} style={!darkMode ?
         {backgroundColor: 'white'} 
        : null}>
            <div className='GenericTweetContainer_center'>
                <div className='GenericTweetContainer_basic-user-information'>
                    <div className='user-container'>
                        <img alt='' className='user-profile-pic'
                         src={profilePic} />
                    </div>
                    <div className='names-display-container'>
                        <span className='display-name' style={!darkMode ?
                        {color: 'black'} : null}> 
                            {name} 
                        </span>
                        <span className='display-screen-name'> {
                            '@'+ screenName} 
                        </span>
                    </div>
                </div>
                <div className= 'GenericTweetContainer_text-area-container'>
                    <span style={!darkMode ?{color: 'black'} : null}>
                     {text} </span>
                </div>
                <div className= 'GenericTweetContainer_date-area-container'>
                    <span> {dataInicio} </span>
                </div>
            </div>
        </div>
    )
  }
}

GenericTweetContainer.defaultProps = {
  text: 'Lorem ipsum is placeholder text commonly used in the graphic',
  screenName: 'example', 
  name: 'name example',
  dateCreation: "Wed Apr 12 04:53:25 +0000 2017",
  profilePic: `https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png`,  
  retweetCount: 0,
  favoriteCount: 0,
  darkMode: true,
  viewMode: 'list'
}