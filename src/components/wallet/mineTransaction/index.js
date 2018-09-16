import React, {
  Component
} from "react";
import {
  connect
} from 'react-redux';
import * as actions from '../utils/functions';

const defaultState = {
  status: {
    message: '',
    state: -1
  }
};

class MineTransaction extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.setState(defaultState);
  }
  componentWillReceiveProps(newProps) {
    const {
      status
    } = newProps.state;
    this.setState({
      ...this.state,
      status
    });
  }
  mineTransaction() {
    this.props.mineTransaction();
  }
  renderStatusMessage() {
    const {
      status
    } = this.state;
    let answer = '';
    if (status.state > -1) {
      answer = (
        <div>
          <h4>Status:</h4>
          { status.message }
        </div>
      );
    }
    return answer;
  }
  render() {
    return (
      <div>
        {this.renderStatusMessage()}
        <button onClick={
          function() {
            this.mineTransaction();
          }
        }>
          Mine
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const newState = state.miner ? state.miner : state;
  return {
    state: newState
  };
}

export default connect(mapStateToProps, actions)(MineTransaction);
