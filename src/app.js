import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import 'babel-polyfill';

import reducers from './components/rootReducer';
import { Wallet } from './components';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

class Application extends Component {
  componentWillMount() {

  }
  render() {
    return (<div>
      <div>
        Welcome to DTM Blockchain!
      </div>
      <Wallet/>
    </div>);
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById("app")
);
