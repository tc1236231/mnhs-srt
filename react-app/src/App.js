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

const users = [
  {email: 'aaron.novodvorsky@mnhs.org',
   name: 'aaron.novodvorsky@mnhs.org',
   sites: [{id: 'site1', name: 'Minnehaha Depot', reportFreq: 'monthly', categories: [
     {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
     {id: 'cat2', name: 'Daily Program/Admission Non Member'}
   ]}],
   reports: [
     {siteId: 'site1',
      siteName: 'Minnesota History Center',
      date: '2019-06-24',
      closed: true,
      counts: {adult: 100, child: 200, program: 300},
      notes: 'Here are some notes'},
     {siteId: 'site1',
      siteName: 'Historic Fort Snelling',
      year: 2019,
      month: 4,
      counts: {adult: 4000, child: 5000},
      notes: 'Here are some other notes'}]},
  {email: 'amber@nchsmn.org',
   name: 'amber@nchsmn.org',
   sites: [
     {name: 'Fort Ridgley', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Program'},
       {id: 'cat6', name: 'People Served On-Site'},
       {id: 'cat7', name: 'Special Program MNHS Member'},
       {id: 'cat8', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'Ben.Leonard@mns.org',
   name: 'Ben.Leonard@mns.org',
   sites: [
     {id: 'site1', name: 'Birch Coulee', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission Trail Counter'}
     ]},
     {id: 'site2', name: 'Lac Qui Parle', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission Trail Counter'}
     ]},
     {id: 'site3', name: 'Marine Mill', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission Trail Counter'}
     ]},
     {id: 'site4', name: 'Traverse des Sioux', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission Trail Counter'}
     ]}
   ],
   reports: [
     {siteId: 'site1',
      siteName: 'Birch Coulee',
      date: '2019-06-24',
      closed: true,
      counts: {adult: 100, child: 200, program: 300},
      notes: 'Here are some notes'},
     {siteId: 'site1',
      siteName: 'Lac Qui Parle',
      year: 2019,
      month: 4,
      counts: {adult: 4000, child: 5000},
      notes: 'Here are some other notes'}]},
  {email: 'chad.thurman@mnhsorg',
   name: 'chad.thurman@mnhsorg',
   sites: [
     {id: 'site1', name: 'Folsom House', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Program'},
       {id: 'cat6', name: 'People Served On-Site'},
       {id: 'cat7', name: 'Special Program MNHS Member'},
       {id: 'cat8', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'cheyanne.stjohn@lwersioux.com',
   name: 'cheyanne.stjohn@lwersioux.com',
   sites: [
     {id: 'site1', name: 'Lower Sioux', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Program'},
       {id: 'cat6', name: 'People Served On-Site'},
       {id: 'cat7', name: 'Special Program MNHS Member'},
       {id: 'cat8', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'elaine@nchsmn.org',
   name: 'elaine@nchsmn.org',
   sites: [
     {id: 'site1', name: 'Harkin Store', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Program'},
       {id: 'cat6', name: 'People Served On-Site'},
       {id: 'cat7', name: 'Special Program MNHS Member'},
       {id: 'cat8', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'Erin.Schult@mnhs.org',
   name: 'Erin.Schult@mnhs.org',
   sites: [
     {id: 'site1', name: 'MHC Library', reportFreq: 'daily', categories: [
       {id: 'cat1', name: 'People Served On-Site'}
     ]}]},
  {email: 'Jessica.Davis@o.dakota.mn.us',
   name: 'Jessica.Davis@o.dakota.mn.us',
   sites: [
     {id: 'site1', name: 'Sibley', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Program'},
       {id: 'cat6', name: 'People Served On-Site'},
       {id: 'cat7', name: 'Special Program MNHS Member'},
       {id: 'cat8', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'KCJ_1790@hotmail.com',
   name: 'KCJ_1790@hotmail.com',
   sites: [
     {id: 'site1', name: 'Comstock House', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Program'},
       {id: 'cat6', name: 'People Served On-Site'},
       {id: 'cat7', name: 'Special Program MNHS Member'},
       {id: 'cat8', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'matt.eidem@nhs.org',
   name: 'matt.eidem@nhs.org',
   sites: [
     {id: 'site1', name: 'Forestville', reportFreq: 'daily', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Outreach'},
       {id: 'cat6', name: 'People Served Off-Site Program'},
       {id: 'cat7', name: 'People Served On-Site'},
       {id: 'cat8', name: 'Special Program MNHS Member'},
       {id: 'cat9', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'pamela.jesen@mnhs.org',
   name: 'pamela.jesen@mnhs.org',
   sites: [
     {id: 'site1', name: 'Jeffers', reportFreq: 'daily', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Outreach'},
       {id: 'cat6', name: 'People Served Off-Site Program'},
       {id: 'cat7', name: 'People Served On-Site'},
       {id: 'cat8', name: 'Special Program MNHS Member'},
       {id: 'cat9', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'peggy.olsonmnhs.org',
   name: 'peggy.olsonmnhs.org',
   sites: [
     {id: 'site1', name: 'MHC Rentals', reportFreq: 'daily', categories: [
       {id: 'cat1', name: 'People Served On-Site'}
     ]}]},
  {email: 'rebecca@eycenter.org',
   name: 'rebecca@eycenter.org',
   sites: [
     {id: 'site1', name: 'WW Mayo House', reportFreq: 'monthly', categories: [
       {id: 'cat1', name: 'Daily Program/Admission MNHS Member'},
       {id: 'cat2', name: 'Daily Program/Admission Non Member'},
       {id: 'cat3', name: 'Educational Program Adult'},
       {id: 'cat4', name: 'Educational Program Student'},
       {id: 'cat5', name: 'People Served Off-Site Program'},
       {id: 'cat6', name: 'People Served On-Site'},
       {id: 'cat7', name: 'Special Program MNHS Member'},
       {id: 'cat8', name: 'Special Program Non-Member'}
     ]}]},
  {email: 'travis.zmmerman@mnhs.org',
   name: 'travis.zmmerman@mnhs.org',
   sites: [
     {id: 'site1', name: 'MLM Trading Post', reportFreq: 'daily', categories: [
       {id: 'cat1', name: 'People Served On-Site'}
     ]}]}
];

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
      () => cb(users[2]),
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
