import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { CircularProgress, Grid } from '@material-ui/core';
import PropTypes from 'prop-types'

const LoginPrompt = ({firebase, authLoaded, authenticated}) => {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '80vh' }}
            >
            <Grid item xs={3}>
                {
                    !authLoaded
                    ? <CircularProgress size={68}/>
                    : !authenticated &&
                    <StyledFirebaseAuth
                        uiConfig={{
                            signInFlow: 'popup',
                            signInOptions: [
                                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                                firebase.auth.EmailAuthProvider.PROVIDER_ID
                            ],
                            callbacks: {
                                signInSuccessWithAuthResult: () => false
                            },
                        }}
                        firebaseAuth={firebase.auth()}
                    />
                }
            </Grid>
        </Grid> 
    )
}

LoginPrompt.propTypes = {
    firebase: PropTypes.object.isRequired,
    authLoaded: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired
}

export default LoginPrompt