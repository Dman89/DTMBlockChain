import {
  FETCH_BALANCE,
  CONNECTION_ERROR,
  SEND_TRANSACTION,
  SUCCESSFUL_TRANSACTION,
  CLEAR_TRANSACTION,
  FETCH_TRANSACTIONS
} from './types';

function walletReducer(state = {balance: 0, publicKey: ''}, action) {
  switch (action.type) {
    case FETCH_BALANCE:
      return {
        ...state,
        balance: action.payload.balance,
        publicKey: action.payload.publicKey
      };
    case CONNECTION_ERROR:
      return {
        ...state,
        error: 'Something went wrong! Check the balance API for more information.'
      }
  }
  return state;
};

function transactionsReducer(state = {
  status: {
    mesage: '',
    state: -1
  },
  transactions: [] },
  action) {
  switch (action.type) {
    case SEND_TRANSACTION:
      return {
        ...state,
        status: {
          message: 'Sending...',
          state: 1
        }
      };
    case SUCCESSFUL_TRANSACTION:
      return {
        ...state,
        status: {
          message: 'Successfully posted the transaction...',
          state: 1
        }
      };
    case CLEAR_TRANSACTION:
      return {
        ...state,
        status: {
          message: '',
          state: -1
        }
      };
    case FETCH_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload
      };
    case CONNECTION_ERROR:
      return {
        ...state,
        status: {
          message: 'Something went wrong! Check the transaction API for more information.',
          state: 0
        }
      }
  }
  return state;
};

export {
  walletReducer,
  transactionsReducer
};
