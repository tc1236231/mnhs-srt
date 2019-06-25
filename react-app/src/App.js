// TODO: Handle sign in failure

// START WITH THE REPORTING FREQ FORM INPUTS

import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from 'firebase';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import SignIn from './SignIn';
import MyReports from './MyReports';
import Report from './Report';

const dummy_user = {
  email: 'samuel.courtier@mnhs.org',
  name: 'Samuel Courtier',
  sites: [
    {id: 'mhc',
     name: 'Minnesota History Center',
     reportFreq: 'daily',
     categories: [
       {id: 'adult', name: 'Adult'},
       {id: 'paid', name: 'Paid'},
       {id: 'child', name: 'Child'},
       {id: 'program', name: 'Progam'},
       {id: 'free', name: 'Free'}
     ]},
    {id: 'hfs',
     name: 'Historic Fort Snelling',
     reportFreq: 'monthly',
     categories: [
       {id: 'adult', name: 'Adult'},
       {id: 'child', name: 'Child'},
       {id: 'paid', name: 'Paid'}
     ]}
  ],
  reports: [
    {siteId: 'mhc',
     siteName: 'Minnesota History Center',
     date: '2019-06-24',
     closed: true,
     counts: {adult: 100, child: 200, program: 300},
     notes: 'Here are some notes'},
    {siteId: 'hfs',
     siteName: 'Historic Fort Snelling',
     year: 2019,
     month: 4,
     counts: {adult: 4000, child: 5000},
     notes: 'Here are some other notes'}]};

const fakeDB = {
  fetchUserData(cb) {
    setTimeout(
      () => cb(dummy_user),
      1);
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: undefined};
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      this.handleAuthStateChanged
    );
  }
  
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  handleAuthStateChanged = user => {
    if (user) {
      fakeDB.fetchUserData(
        this.handleFetchUserDataSuccess);
    } else {
      this.setState({user: false});
    }
  }

  handleFetchUserDataSuccess = userData => {
    this.setState({user: userData});
  }

  handleFetchUserDataError = e => {
    /// IMPLEMENT
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
              path="/form"
              render={props => <Report user={this.state.user} />}
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
