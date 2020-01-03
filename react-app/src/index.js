import React from 'react';
import ReactDOM from 'react-dom';

import firebase from 'firebase';

import { Provider } from "react-redux";
import store from "./redux/store";
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import SRTApp from './components/SRTApp';
import { firebaseConfig } from './firebaseConfig'

firebase.initializeApp(firebaseConfig);

const rrfProps = {
    firebase,
    config: {},
    dispatch: store.dispatch,
}

const rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <SRTApp />
        </ReactReduxFirebaseProvider>
    </Provider>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();