// TODO: Handle sign in failure

import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import logo from './logo.svg';
import './App.css';

// TODO: Keep out of version control!!!
// Configure Firebase.
const config = {

};
firebase.initializeApp(config);

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
    {submit_dt: 'a submit dt',
     site_id: 'mhc',
     site_name: 'Minnesota History Center',
     report_date: 'a report date',
     closed: true,
     counts: {
       adult: 100,
       child: 200,
       program: 300},
     notes: 'Here are some notes'},
    {submit_dt: 'another submit dt',
     site_id: 'hfs',
     site_name: 'Historic Fort Snelling',
     report_month_start: 'a month start',
     counts: {
       adult: 4000,
       child: 5000},
     notes: 'Here are some other notes'}]};

const Header = ({isSignedIn}) => (
  <header>
    <h1>My App</h1>
    {isSignedIn &&
     <div>
       <nav>
         <ul>
           <li><Link to="/">My Reports</Link></li>
           <li><Link to="/form">New Report</Link></li>
         </ul>
       </nav>
       <div>
         <div>{firebase.auth().currentUser.displayName}</div>
         <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
       </div>
     </div>}
  </header>
);

function SignIn() {
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
  
  return (
    <div>
      <Header />
      <p>Please sign-in:</p>
      <StyledFirebaseAuth
        uiConfig={firebaseUiConfig}
        firebaseAuth={firebase.auth()}
      />
    </div>
  );
}

const Index = () => (
  <div>
    <h2>Index</h2>
    <table>
      <thead>
        <tr>
          <th>Submit Datetime</th>
          <th>Site Name</th>
          <th>Report Period</th>
          <th>Closed?</th>
          <th>Counts</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {dummy_user.reports.map(r => (
          <tr>
            <td>{r.submit_dt}</td>
            <td>{r.site_name}</td>
            <td>{r.report_date || r.report_month_start}</td>
            <td>{r.closed && "Yes"}</td>
            <td>
              {Object.keys(r.counts).map((c, i) => (
                <span>{i > 0 && ","} {c}: {r.counts[c]}</span>
              ))}
            </td>
            <td>{r.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

class Form extends React.Component {
  state = {
    submit_dt: 'a submit dt',
    site_id: 'mhc',
    report_date: 'a report date',
    closed: true,
    counts: {
      adult: 100,
      child: 200,
      program: 300},
    notes: 'Here are some notes'};
  
  handleChange = (e) => {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? (
      e.target.checked
    ) : (
      e.target.value);

    if (name.startsWith('count-')) {
      const categoryId = name.split("-")[1];
      this.setState({counts: {...this.state.counts, [categoryId]: value}});
    } else {
      this.setState({[name]: value});
    }
  };
  
  handleSubmit = (e) => {
    alert('A form was submitted: ' + JSON.stringify(this.state));
    e.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="submit_dt">Submit Date:</label>
          <input
            type="text"
            id="submit_dt"
            name="submit_dt"
            value={this.state.submit_dt}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="site_id">Site:</label>
          <select
            id="site_id"
            name="site_id"
            value={this.state.site_id}
            onChange={this.handleChange}
          >
            {dummy_user.sites.map(s => (
              <option value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="report_date">Report Date:</label>
          <input
            type="text"
            id="report_date"
            name="report_date"
            value={this.state.report_date}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <input
            type="checkbox"
            id="closed"
            name="closed"
            value={this.state.closed}
            onChange={this.handleChange}
          />
          <label htmlFor="closed">Closed?:</label>
        </div>
        <fieldset>
          <legend>Visit Counts</legend>
          {dummy_user.sites
           .find(s => s.id === this.state.site_id)
           .categories.map(c => (
             <div>
               <label htmlFor={"count-" + c.id}>{c.name}:</label>
               <input
                 type="number"
                 id={"count-" + c.id}
                 name={"count-" + c.id}
                 value={this.state.counts[c.id]}
                 min="0"
                 setp="1"
                 onChange={this.handleChange}
               />
             </div>
           ))}
        </fieldset>
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={this.state.notes}
            onChange={this.handleChange}
          />
        </div>
        <button>Submit</button>
      </form>
    );
  }
}

class App extends React.Component {
  state = {
    isSignedIn: false,
  };
  
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({isSignedIn: !!user})
    );
  }
  
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
      <Router>
        <div>
          {!this.state.isSignedIn ? (
            <SignIn />
          ) : (
            <div>
              <Header isSignedIn={this.state.isSignedIn} />
              <Route path="/" exact component={Index} />
              <Route path="/form" component={Form} />
            </div>
          )}
        </div>
      </Router>
    );
  }
}

export default App;
