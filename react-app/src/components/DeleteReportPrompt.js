import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DeleteReportPrompt = ({reportUUID, siteName, reportDate, handleClose, deleteReportFunc}) => {
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
            <Button onClick={handleClose} color="primary" autoFocus>
                No
            </Button>
            <Button onClick={() => {deleteReportFunc(reportUUID); handleClose()}} color="primary">
                Yes
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteReportPrompt