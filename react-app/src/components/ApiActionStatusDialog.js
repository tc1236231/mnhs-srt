import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Collapse from '@material-ui/core/Collapse';

const ApiActionStatusDialog = ({apiStatus}) => {
    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleClose = () => {
        setOpen(false);
    }
    const PrettyPrintJson = ({data}) => (<div><pre>{ 
        JSON.stringify(data, null, 2) }</pre></div>);

    React.useEffect(() => {
        if(!open && apiStatus.isFetching)
            setOpen(true);
    }, [apiStatus.isFetching, open])

    return (
        <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Server Response"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {apiStatus.statusText}
                </DialogContentText>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <PrettyPrintJson {...{data: apiStatus.meta}} />
                </Collapse>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleExpandClick} color="secondary">
                {expanded ? "Hide" : "Show"} Details
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus disabled={apiStatus.isFetching}>
                OK
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ApiActionStatusDialog