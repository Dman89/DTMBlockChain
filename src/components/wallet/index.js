import React, { Component } from "react";
import { connect } from 'react-redux';
import * as actions from './utils/functions';
import SendTransaction from './sendTransaction';

class Wallet extends Component {
	componentWillMount() {
	  const {
	    balance,
	    publicKey
	  } = this.props.state;
	  this.setState({
	    balance,
	    publicKey
	  });
		this.props.initBalance();
	  this.props.fetchBalanceAndPublicKey();
	}
	componentWillReceiveProps(newProps) {
	  const {
	    balance,
	    publicKey
	  } = newProps.state;
	  this.setState({
	    balance,
	    publicKey
	  });
	}
	refreshBalance() {
		this.props.fetchBalanceAndPublicKey();
	}
	render() {
		const { balance, publicKey } = this.state;
		return (<div>
			Hello World! - Wallet
			<br/>
			{balance}
			<br/>
			{publicKey}
			<br/>
			<button onClick={function() {
				this.refreshBalance.apply(this);
			}.bind(this)}>refreshBalance</button>
			<SendTransaction/>
		</div>);
	}
}


function mapStateToProps(state) {
	const newState = state.wallet ? state.wallet : state;
  return {
    state: newState
  };
}

export default connect(mapStateToProps, actions)(Wallet);
