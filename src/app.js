import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Wallet } from './components';

class Application extends Component {
  componentWillMount() {

  }
  render() {
    return (<div>
      Hello World!
      <Wallet/>
    </div>);
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render( <Application  /> , mountNode);
