import { combineReducers } from "redux";
import { firebaseReducer } from 'react-redux-firebase'

export default combineReducers({
    firebase: firebaseReducer
});