import React from 'react';
import LoginPrompt from './LoginPrompt';
import { isLoaded, isEmpty, useFirebase } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

const LoginContainer = ({authInfo}) => {
    const firebase = useFirebase();
    const authLoaded = isLoaded(authInfo);
    const authenticated = isLoaded(authInfo) && !isEmpty(authInfo);
    const subProps = {
        firebase,
        authLoaded,
        authenticated
    }
    return (
        <div>
            {
                authenticated ?
                <Redirect to={{ pathname: '/' }} />
                :
                <LoginPrompt {...subProps}></LoginPrompt>
            }
        </div>
    )
};

const mapStateToProps = (state) => ({
    authInfo: state.firebase.auth
});

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (LoginContainer)