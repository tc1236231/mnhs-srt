import React from 'react';
import { Link } from "react-router-dom";
import firebase from 'firebase';

const Header = ({user}) => (
  <header className="navbar navbar-expand navbar-dark bg-dark fixed-top">
    <span className="navbar-brand">MNHS Site Reporting Tool</span>
    {user && (
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">My Reports</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/report">New Report</Link>
          </li>
        </ul>
        <div>
          <span className="text-light">{user.displayName}</span>
          <button
            className="btn btn-secondary ml-4"
            onClick={() => firebase.auth().signOut()}>Sign-out
          </button>
        </div>
      </div>
    )}
  </header>
);

export default Header;
