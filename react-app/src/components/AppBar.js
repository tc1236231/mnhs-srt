import React from 'react';
import { AppBar as MaterialAppBar, Tabs, Tab, Typography, Button } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty, useFirebase } from 'react-redux-firebase'
import { Link } from "react-router-dom";

const AppBar = () => {
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth);
    const authenticated = isLoaded(auth) && !isEmpty(auth);

    return (
    <MaterialAppBar position="static">
        <Typography variant="h3">
            MNHS SRT
        </Typography>
        {
            authenticated && (
                <Tabs>
                    <Tab label="My Reports" component={Link} to='/report/view'></Tab>
                    <Tab label="File a Report" component={Link} to='/report/file'></Tab>
                    <Button onClick={() => firebase.logout()}>Log Out</Button> 
                </Tabs>
            )
        }
    </MaterialAppBar>
    )
}

export default AppBar;