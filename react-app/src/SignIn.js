import React from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Header from './Header';

const firebaseUiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

const SignIn = () => (
  <main className="text-center">
    <Header />
    <h2 className="font-weight-light mb-4">Sign in to continue.</h2>
    <StyledFirebaseAuth
      uiConfig={firebaseUiConfig}
      firebaseAuth={firebase.auth()}
    />
  </main>
);

export default SignIn;
