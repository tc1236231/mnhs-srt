import React from 'react';
import logo from '../mnhs_logo.png'
import { Typography, Button } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty, useFirebase } from 'react-redux-firebase'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles({
    logo: {
      maxWidth: 160
    },
    userName: {
        marginLeft: 50
    }
});

const AppBar = ({openFileReportDialog}) => {
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth);
    const user = useSelector(state => state.user);
    const authenticated = isLoaded(auth) && !isEmpty(auth);
    const classes = useStyles();

    return (
    <Box m={1}>
        <Toolbar>
            <img src={logo} alt="logo" className={classes.logo} draggable="false" />
            {
                authenticated && user && user.data && (
                    <Box ml={5}>
                        <Button onClick={openFileReportDialog}>File a Report</Button>
                        <Typography color="textSecondary" className={classes.userName} variant="caption">Logged In as {user.data.displayName}</Typography>
                        <Button onClick={() => firebase.logout()}>Log Out</Button> 
                    </Box>
                )
            }
        </Toolbar>
    </Box>
    )
}

export default AppBar;