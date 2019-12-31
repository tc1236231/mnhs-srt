import React from 'react';
import LoginContainer from './LoginContainer';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ReportsTableContainer from './ReportsTableContainer';
import PrivateRoute from './PrivateRoute';
import { useSelector, useDispatch } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'
import { fetchAPIToken, receiveAPIToken } from '../redux/actions'

const SRTApp = () => {
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (auth.email) {
            dispatch(fetchAPIToken(auth.email));
            firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(token => {
                dispatch(receiveAPIToken(auth.email, token));
                document.cookie = "token=" + token;
            });
        } else {
            document.cookie = "token=";
        }
    }, [auth.email, firebase, dispatch]);

    return (
        <Router>
            <Switch>
                <PrivateRoute exact path="/" component={ReportsTableContainer} />
                <Route path="/login" component={LoginContainer} />
                <Redirect from="*" to="/" />
            </Switch>
        </Router>
    )
}

export default SRTApp