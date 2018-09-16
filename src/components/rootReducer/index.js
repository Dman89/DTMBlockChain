import { combineReducers } from 'redux';
import { walletReducer, transactionsReducer } from '../index';

const rootReducer = combineReducers({
  wallet: walletReducer,
  transactions: transactionsReducer
});

export default rootReducer;
