import React from 'react'
import FileReportForm from './FileReportForm'
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { fileReport } from '../redux/actions';

const useStyles = makeStyles(theme => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FileReportDialogContainer = ({user, reports, fileReportFunc, handleClose}) => {
    const classes = useStyles();

    return (
        <Dialog fullScreen open={true} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    File a New Report
                </Typography>
                </Toolbar>
            </AppBar>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Box m={3}>
                    <FileReportForm {...{user, reports, fileReportFunc, handleClose}}/>
                </Box>
            </Grid>
        </Dialog>
    )
};

const mapStateToProps = (state) => ({
    user: state.user.data,
    reports: state.report.items
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    fileReportFunc: (report) => dispatch(fileReport(report))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FileReportDialogContainer)