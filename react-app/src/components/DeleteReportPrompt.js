import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

const DeleteReportPrompt = ({reportUUID, siteName, reportDate, handleClose, deleteReportFunc, apiStatus}) => {
    return (
        <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Delete Report?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure that you want to delete the report of <b>{siteName}</b> on <b>{reportDate}</b>?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            {
                apiStatus.action === "DELETE_REPORT" && apiStatus.status.status && (
                    <Typography variant="h6">
                        {apiStatus.status.status === 204 ? "Deleted Successfully" : "ERROR, Please contact BIPI"}
                    </Typography>
                )
            }
            {
                apiStatus.action === "DELETE_REPORT" && apiStatus.isFetching && (
                    <Typography variant="h6">
                        {"Pending"}
                    </Typography>
                )
            }
            <Button onClick={handleClose} color="primary" autoFocus>
                No
            </Button>
            <Button onClick={() => deleteReportFunc(reportUUID)} color="primary" disabled={apiStatus.isFetching}>
                Yes
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteReportPrompt