import { combineReducers } from "redux";
import { firebaseReducer } from 'react-redux-firebase'
import {
     FETCH_API, RECEIVE_API, FAIL_API, FETCH_API_TOKEN, RECEIVE_API_TOKEN,
     REQUEST_API_ACTION, RECEIVE_API_ACTION, FAIL_API_ACTION
 } from '../actions'

function apiActionReducer(
    state = {
      isFetching: false,
      newData: true,
      action: '',
      statusText: '',
      meta: {}
    },
    action
  ) {
    switch (action.type) {
        case RECEIVE_API:
            return Object.assign({}, state, {
                newData: false,
            }) 
        case REQUEST_API_ACTION:
            return Object.assign({}, state, {
                isFetching: true,
                newData: false,
                action: action.action,
                statusText: 'Pending',
                meta: {}
            })
        case RECEIVE_API_ACTION:
            return Object.assign({}, state, {
                isFetching: false,
                newData: true,
                action: action.action,
                statusText: action.statusText,
                meta: action.meta
            })
        case FAIL_API_ACTION:
            return Object.assign({}, state, {
                isFetching: false,
                newData: false,
                action: action.action,
                statusText: action.statusText,
                meta: action.error
            })
      default:
        return state
    }
}

function authTokenReducer(
    state = {
      isFetching: false,
      token: ''
    },
    action
  ) {
    switch (action.type) {
        case FETCH_API_TOKEN:
            return Object.assign({}, state, {
                isFetching: true,
                token: ''
            })
        case RECEIVE_API_TOKEN:
            return Object.assign({}, state, {
                isFetching: false,
                token: action.token
            })
      default:
        return state
    }
}

function reportsReducer(
    state = {
      isFetching: false,
      items: []
    },
    action
  ) {
    switch (action.type) {
        case FETCH_API:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_API:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.reports,
                lastUpdated: action.receivedAt
            })
        case FAIL_API:
            return Object.assign({}, {
                isFetching: false,
                lastUpdated: action.receivedAt
            })
      default:
        return state
    }
}

function userReducer(
    state = {
      isFetching: false,
      user: {}
    },
    action
  ) {
    switch (action.type) {
        case FETCH_API:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_API:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.user,
                lastUpdated: action.receivedAt
            })
        case FAIL_API:
            return Object.assign({}, {
                isFetching: false,
                user: {},
                error: action.error,
                lastUpdated: action.receivedAt
            })
      default:
        return state
    }
}

export default combineReducers({
    user: userReducer,
    report: reportsReducer,
    firebase: firebaseReducer,
    authToken: authTokenReducer,
    apiAction: apiActionReducer
});