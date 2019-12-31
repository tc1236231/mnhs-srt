import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { CircularProgress, Grid } from '@material-ui/core';

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
    if (!isLoaded(auth))
        return (
            <Grid container alignItems="center"
                justify="center"
                style={{ minHeight: '80vh' }}
                >
                    <CircularProgress size={68}/>
            </Grid>
        );

    const authenticated = !isEmpty(auth);
    return (
        <Route {...rest} render={props => (
            authenticated
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />        
    )
};

const mapStateToProps = (state) => ({
    auth: state.firebase.auth
});

export default connect(
    mapStateToProps
) (PrivateRoute)