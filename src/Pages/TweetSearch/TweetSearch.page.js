import React from 'react'
import './TweetSearch.style.css'
import { TextAnalysis } from '../../controllers'
import { Texts } from '../../utils/index'
import ReactLoading from 'react-loading';
import GenericTweetContainer from '../../components/GenericTweetContainer/GenericTweetContainer.component';
import SlideShow from 'react-slidez'
import AnalyseResultContainer from './AnalyseResultContainer/AnalyseResultContainer.component'
import { BasicFunctions }  from '../../utils/BasicFunctions/index'

export default class TweetSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      darkMode: true,
      isGridView: false,
      analyseResult: null,
      textSearch: '',
      tweetList: [],
      isLoadingData: false,
      isOpenLeftSide: false,
      textSubimited: '',
      presentationMode: false,
      limitSize: 100,
    }
  }

  startTimer() {
    this.timerID = setInterval(() => {
      if(this.state.textSearch === this.state.textSubimited)
        this.searchForTweets()
    }, 300000);
  }

  stopTimer() {
    clearInterval(this.timerID);
  }

  searchTweetsDuringInterval = () => {
    this.startTimer()
  }

  clickPresentation = () => {
    this.setState({ presentationMode: !this.state.presentationMode })
  }

  clickExpand = () => {
    this.setState({ isOpenLeftSide: !this.state.isOpenLeftSide })
  }

  changeViewToDarkMode = () => {
    this.setState({ darkMode: true })
  }

  changeViewToLightMode = () => {
    this.setState({ darkMode: false })
  }

  handleChangeTextSearch = (e) => {
    this.setState({ textSearch: e.target.value })
  }

  handleKeyDown = (e) => {
    if (this.state.textSearch !== '') {
      if (e.keyCode === 13) {
        e.preventDefault()
        this.onSearchClick()
      }
    }
  }

  onSearchClick = async () => {
    this.stopTimer()
    this.searchForTweets()
    this.searchTweetsDuringInterval()
  }


  checkTweetIsAlreadyStored = (tweetId)=>{
    const storedTweets = this.state.tweetList
    
    if(!storedTweets)
      return
    
    let response = false
    storedTweets.forEach((tweet)=>{
      if(tweet.id === tweetId)
        response = true
    })

    return response
  }


  manageTweetsAmount = (tweets) =>{
    let limitedTweets = []
    tweets.forEach((tweet, index)=>{
      if(index <= this.state.limitSize -1){
        limitedTweets.push(tweet)
      }
    })

    return limitedTweets
  }


  addNewsToTheStore = (tweets)=>{
    let storedTweets = this.state.tweetList
    
    if(!storedTweets)
      return

    tweets.forEach((tweet, index)=>{
      if(this.checkTweetIsAlreadyStored(tweet.id))
        tweets.splice(index, 1)
      else 
        storedTweets.push(tweet)
    })

    return storedTweets
  }


  filterTweets = (tweets) => {
    tweets.forEach((tweet, index)=>{
      // remove alguns tweets com link
      if(tweet.text.includes('https://')){
        tweets.splice(index, 1)
      }
    })
    return tweets
  }


  processTweets = (tweets) => {

    if(!tweets)
      return

    let processedTweets = this.filterTweets(tweets)
    
    if(this.state.textSearch === this.state.textSubimited)
      processedTweets = this.addNewsToTheStore(processedTweets) 

    processedTweets = BasicFunctions.sortBy(processedTweets, {
      prop: 'created_at',
      desc: true
    })
    

    return this.manageTweetsAmount(processedTweets)

  }

  searchForTweets = async () => {
    const search = this.state.textSearch
    .replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '')
    this.setState({ isLoadingData: true })

    if (search !== '') {
      await TextAnalysis.getTweets(search).then(async (result) => {
        const tweets = this.processTweets(result.data.statuses)
        
        this.setState({ tweetList: tweets })
        if(tweets && tweets.length > 0){
          await TextAnalysis.AnalyseSentimentalFromPhrases({
            lista: tweets
          }).then((result) => {
            this.setState({
              analyseResult: result.data,
              textSubimited: this.state.textSearch
            })
          })
        }

      })
    }
    this.setState({ isLoadingData: false })
  }

  renderTweets = () => {
    const isGridView = this.state.isGridView
    const darkMode = this.state.darkMode

    const tweetList = this.state.tweetList 
    &&  this.state.tweetList.length > 0
    ? this.state.tweetList : []

    return tweetList.map((tweet, i) => {
      return (<GenericTweetContainer key={`tweet-${i}`} viewMode={isGridView
        ? 'grid' : 'list'}
        name={tweet.user.name}
        screenName={tweet.user.screen_name}
        darkMode={darkMode} text={tweet.text}
        profilePic={tweet.user.profile_image_url}
        dateCreation={tweet.created_at}

      />)

    })
  }


  renderResults = () => {
    const analyseResult = this.state.analyseResult
    const predominant = analyseResult.data.predominant
    const dataEmotions = analyseResult.data.dataEmotions

    return (
      <AnalyseResultContainer predominant={predominant} 
      dataEmotions={dataEmotions} />
    )

  }

  render() {
    const tweetList = this.state.tweetList 
      && this.state.tweetList.length > 0
      ? this.state.tweetList : []

    return (
      <div className={`TweetSearch__container`}>

        {
          !this.state.presentationMode

            ?

            <div className='container_sides'>
              <div className={this.state.isOpenLeftSide ? 'left_side_mobile'
                : 'left_side'}>
                <div className='top__left_side'>


                  {
                    this.state.isOpenLeftSide 
                    && this.state.tweetList.length > 0
                    ?
                  <div className='menu_icon_container'>
                    <div className='back_menu_icon' 
                      onClick={this.clickExpand} />
                  </div>
                    :
                    <div className='menu_icon_container'>
                      <div className='menu_icon' 
                        onClick={this.clickExpand} />
                    </div>

                  }


                  <div className='switch-container'>
                    <div className={this.state.darkMode ? 'switch-option'
                      : 'switch-option-selected'
                    }
                      onClick={this.changeViewToLightMode}
                    />
                    <div className={!this.state.darkMode ? 'switch-option'
                      : 'switch-option-selected'
                    }
                      style={{ backgroundColor: '#2E2E2E' }}
                      onClick={this.changeViewToDarkMode}
                    />
                  </div>

                </div>
                <div className='content_left-side'>
                  <div className={this.state.isOpenLeftSide
                    ? 'search_container_mobile'
                    : 'search_container'}>

                    <div className='search_container-top'>
                      <span style={{
                        color: 'var(--simpleLabel)',
                        fontWeight: '22px'
                      }}>
                        {Texts.explain}</span>

                      <form className='searchInput'>
                        <input type='text' style={{ border: 'none',
                          width: '100%' }}
                          placeholder='Ex.: @bolsonaro'
                          value={this.state.textSearch}
                          onChange={this.handleChangeTextSearch}
                          onKeyDown={this.handleKeyDown}
                        />
                        <button type='button' className='new_search-button'
                          onClick={this.onSearchClick} />
                      </form>

                    </div>

                    {
                      this.state.isLoadingData ?
                        <div className='explain_container'>
                          <ReactLoading type={'bubbles'} 
                            color={'var(--simpleLabel'}
                            height={100} width={100} />
                        </div>

                        :
                        !this.state.analyseResult
                          ?
                          <div className='explain_container'>
                            <div className='explain_container-tip'>
                              <span style={{
                                fontSize: '14px',
                                color: 'var(--simpleLabel'
                              }}>
                                {Texts.explainExample}
                              </span>
                            </div>
                          </div>

                          : this.renderResults()
                    }
                  </div>
                </div>
              </div>

              <div className='right_side' style={this.state.isOpenLeftSide
                ? { display: 'none' }
                : null}>

                <div className='top__right_side'>
                  
                {this.state.analyseResult ?
                  <div className='play_icon_container'>
                    <div className='play_icon' 
                      onClick={this.clickPresentation}/>
                  </div>
                : null
                }

                </div>

                <div className={this.state.isGridView ? 'render_tweets_grid'
                  : 'render_tweets'}>
                  {
                    this.state.analyseResult ?
                      this.renderTweets()
                      : (<div style={{
                        width: '100%', height: '100%', display: 'flex'
                        , justifyContent: 'center', alignItems: 'center'
                      }}>
                        <span style={{ color: 'var(--simpleLabel)' }}>
                          Não há tweets para serem exibidos.
                      </span>
                      </div>)
                  }
                </div>

              </div>

            </div>

            : 
 
            <div className='apresentation_container'>
              <div style={{zIndex:2}}>
                <div className='back_icon_container'>
                    <div className='back_icon' 
                      onClick={this.clickPresentation} />
                </div>
                <h1>{`Exibindo tweets recentes sobre 
                  "${this.state.textSubimited}"`}
                </h1>
              </div>
              <SlideShow
                showArrows={false}
                useDotIndex
                slideInterval={10000}
                defaultIndex={0}
                effect={'left'}
                height={'100%'}
                width={'100%'}
              
              >
                {tweetList.map((tweet, i) => {
                  return (
                  <div key={`tweet_${i}`} 
                  className='tweet_apresentation__container'>
                    <GenericTweetContainer viewMode={'list'}
                      name={tweet.user.name}
                      screenName={tweet.user.screen_name}
                      darkMode={this.state.darkMode} text={tweet.text}
                      profilePic={tweet.user.profile_image_url}
                      dateCreation={tweet.created_at}
                    />
                  
                  </div>
                  )
                  
                })}
              </SlideShow>
            {this.state.analyseResult ?
              <div className='apresentation_result__container'
              style={{border: `2px dotted 
              var(--${this.state.analyseResult.data.predominant})`}}>
                <AnalyseResultContainer 
                  predominant={this.state.analyseResult.data.predominant}
                  dataEmotions={this.state.analyseResult.data.dataEmotions} 
                  limiteHeight={true} />
              </div>
            : null
            }
            </div>
         }

      </div>
    )
  }
}

TweetSearch.propTypes = {

}