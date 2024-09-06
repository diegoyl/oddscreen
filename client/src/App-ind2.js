import React from 'react';
import logo from './logo.svg';
import './App.css';
// import { ReadableByteStreamController } from 'stream/web';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:""}
  }

  callAPI(){
    fetch("http://localhost:4000/oddsAPI").then(
      res => res.text()
    ).then(
      res => this.setState({apiResponse: res})
    )
  }
  // callAPI(){
  //   fetch("http://localhost:4000/oddsAPI").then(
  //     res => res.text()
  //   ).then(
  //     res => this.setState({apiResponse: res})
  //   )
  // }

  componentWillMount(){
    this.callAPI();
    
  }

  render(){
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header> */}


        <p>MY ODDS SCREEN #2</p>
        <p>{
          this.state.apiResponse
          
        }</p>
        {/* <p>{
          this.state.apiResponse.games.map((game, i) => (
            <p key={i}>{game}</p>
          ))
        }</p> */}



      </div>
    );
  }
}

export default App;
