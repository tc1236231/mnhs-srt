// TODO: Handle sign in failure

import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from 'firebase';
import axios from 'axios';
import './App.css';
import Header from './Header';
import SignIn from './SignIn';
import MyReports from './MyReports';
import Report from './Report';
import DivWithErrorHandling from './DivWithErrorHandling';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: undefined, loading: false};
    this.updateUserData = this.updateUserData.bind(this);
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth()
      .onAuthStateChanged(this.handleAuthStateChanged);
  }
  
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
  
  updateUserData(email) {
    axios
    .get('/api/user/' + email)
    .then(r => 
      {
        if(Object.keys(r.data).length === 0)
          this.setState({error: {message: "Failed to fetch user info, does this account exist?"}});
        this.setState({user: r.data, loading: false});
      }
    )
    .catch( err => this.setState({error: err}));
  }
  
  handleAuthStateChanged = user => {
    if (user) {
      this.setState({loading: true});
      user.getIdToken().then(token => {
        
        // Add the token to the browser's cookies. The server will then be
        // able to verify the token against the API.
        // SECURITY NOTE: As cookies can easily be modified, only put the
        // token (which is verified server-side) in a cookie; do not add other
        // user information.
        document.cookie = "token=" + token;
        this.updateUserData(user.email);
      });
    } else {
      document.cookie = "token=";
      this.setState({user: false});
    }
  }

  render() {
    if (this.state.user === false && this.state.loading === false) 
      return <SignIn />;

    if(this.state.error)
    {
      return (
        <DivWithErrorHandling showError={this.state.error}>
          <Header user={this.state.user} />
        </DivWithErrorHandling>
      );
    }

    return (
      <DivWithErrorHandling showError={this.state.error}>
        <Header user={this.state.user} />
        {this.state.user ? (
          <main>
            <Route
              path="/"
              exact
              render={props => (
                <MyReports reports={this.state.user.reports} />)}
            />
            <Route
              path="/report"
              render={props => <Report user={this.state.user} updateUserData={this.updateUserData} />}
            />
          </main>
        ) : (
          <h1 className="p-3">Loading...</h1>
        )}
      </DivWithErrorHandling>
    );
  }
}

const AppRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppRouter;
