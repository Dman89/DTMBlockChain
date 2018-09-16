import axios from 'axios';
import {
  FETCH_BALANCE,
  CONNECTION_ERROR,
  SEND_TRANSACTION,
  SUCCESSFUL_TRANSACTION,
  CLEAR_TRANSACTION,
  FETCH_TRANSACTIONS
} from './types';

export function fetchBalanceAndPublicKey() {
  return function(dispatch) {
    axios.get('/balance').then(function(res) {
      const payload = res.data;
      const type = FETCH_BALANCE;
      dispatch({
        type,
        payload
      });
    }, function(err) {
      const type = CONNECTION_ERROR;
      dispatch({
        type
      });
    });
  };
}

export function sendTransaction(data) {
  return function(dispatch) {
    dispatch({type: SEND_TRANSACTION});
    axios.post('/transact', data).then(function(res) {
      dispatch({
        type: SUCCESSFUL_TRANSACTION
      });
    }, function(err) {
      console.log(err);
      dispatch({
        type: CONNECTION_ERROR
      });
    });
  };
}
