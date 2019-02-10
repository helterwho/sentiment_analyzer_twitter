import React, { Component } from 'react';
import './App.css';
import Main from './Pages/Main/Main.page'
import TweetSearch from './Pages/TweetSearch/TweetSearch.page'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Main>
          <TweetSearch/>
        </Main>
      </div>
    );
  }
}

export default App;
