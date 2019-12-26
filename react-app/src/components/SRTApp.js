import React from 'react';
import AppBar from './AppBar';
import LoginPrompt from './LoginPrompt';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FileReport from './FileReport';
import ViewReports from './ReportsTable';

const SRTApp = () => {
    return (
        <Router>
            <AppBar></AppBar>
            <LoginPrompt></LoginPrompt>
            <Switch>
                <Route path='/report/view' render={() => <ViewReports />} />
                <Route path='/report/file' render={() => <FileReport />} />
            </Switch>
        </Router>
    )
}

export default SRTApp