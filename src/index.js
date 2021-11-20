import ReactDOM from "react-dom";
import React from 'react';
import Tabs from "./pages/Tabs";
import Landing from "./pages/Landing";
import './App.css'
import { render } from "@testing-library/react";

export default class App extends React.Component {
  
  constructor(props){
    super(props)

    this.goToTab = this.goToTab.bind(this)

    this.state = {
      page: 0
    }
  }

  goToTab(i){
    this.setState({page:i})
  }

  render(){
    
    if(this.state.page == 0)
      return <Landing onTab = {this.goToTab}></Landing>
    else
      return <Tabs tab={this.state.page} onTab={this.goToTab}></Tabs>
  
}
}

ReactDOM.render(<App />, document.getElementById("root"));