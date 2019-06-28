// TODO: Handle sign in failure

import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from 'firebase';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import SignIn from './SignIn';
import MyReports from './MyReports';
import Report from './Report';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: undefined};
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth()
      .onAuthStateChanged(this.handleAuthStateChanged);
  }
  
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
  
  updateUserData = () => axios
    .get('/api/user/' + this.state.user.email)
    .then(r => this.setState({user: r.data}));

  handleAuthStateChanged = user => {
    if (user) {
      user.getIdToken().then(token => {
        
        // Add the token to the browser's cookies. The server will then be
        // able to verify the token against the API.
        // SECURITY NOTE: As cookies can easily be modified, only put the
        // token (which is verified server-side) in a cookie; do not add other
        // user information.
        document.cookie = "token=" + token;
        axios
          .get('/api/user/' + user.email)
          .then(r => this.setState({user: r.data}));
        // .catch
        // .finally
      });
    } else {
      document.cookie = "token=";
      this.setState({user: false});
    }
  }

  render() {
    if (this.state.user === false) return <SignIn />;

    return (
      <div>
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
          "Loading..."
        )}
      </div>
    );
  }
}

const AppRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppRouter;
