import React, {
  Component
} from "react";
import { connect } from 'react-redux';
import * as actions from '../utils/functions';

const defaultState = {
  recipient: '',
  amount: 0,
  fee: 1,
  status: {
    message: '',
    state: -1
  }
};

class SendTransaction extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.setState(defaultState);
  }
  componentWillReceiveProps() {
    const { status } = this.props.state;
    this.setState({
      ...this.state,
      status
    });
  }
  clearForm() {
    this.setState(defaultState);
  }
  sendForm() {
    const {recipient, amount, fee} = this.state;
    this.props.sendTransaction({
      recipient,
      amount,
      fee
    });
  }
  onChange(val, key) {
    this.setState({
      [key]: val
    });
  }
  renderStatusMessage() {
    const { status } = this.state;
    let answer = '';
    if (status.state > -1) {
      answer = (<div>
        <h4>Status:</h4>
        {status.message}
      </div>);
    }
    return answer;
  }
  render() {
    const {recipient, amount, fee, status} = this.state;
    return ( <div>
        {this.renderStatusMessage()}
        <div>
          <h4>Recipient:</h4>
          <input type="text" value={recipient} onChange={function(event) {
            this.onChange(event.target.value, 'recipient');
          }.bind(this)}/>
        </div>
        <div>
          <h4>Amount:</h4>
          <input type="number" value={amount} onChange={function(event) {
            this.onChange(event.target.value, 'amount');
          }.bind(this)}/>
        </div>
        <div>
          <h4>Fee:</h4>
          <input type="number" value={fee} onChange={function(event) {
            this.onChange(event.target.value, 'fee');
          }.bind(this)}/>
        </div>
        <div>
          <button onClick={this.clearForm.bind(this)}>Clear</button>
        </div>
        <div>
          <button onClick={this.sendForm.bind(this)}>Send</button>
        </div>
      </div>);
    }
  }

  function mapStateToProps(state) {
  	const newState = state.transactions ? state.transactions : state;
    return {
      state: newState
    };
  }

  export default connect(mapStateToProps, actions)(SendTransaction);
