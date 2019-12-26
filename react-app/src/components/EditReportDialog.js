import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

const EditReportDialog = ({reportUUID, siteName, reportDate, counts, handleClose, editReportFunc}) => {
    const validatelInteger = (num) => {
        return num !== Infinity && num >= 0 ? "" : "Incorrect Format"
    };

    return (
        <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Edit Report"}</DialogTitle>
            <Formik
            initialValues= { Object.assign({}, ...counts.map((c,i) => ({[c.category.uuid]: c.count}))) }
            validate={values => {
                const errors = {};
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                editReportFunc({reportUUID, counts: values});
                setSubmitting(false);
            }}
            >
            {({submitForm, ...restProps}) => {
                return (
                    <div>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are editing the report of {siteName} on {reportDate}
                    </DialogContentText>
                    <Form>
                        {
                            counts.map((c, i) => {
                                return (
                                    <Field
                                        key={c.category.uuid}
                                        name={c.category.uuid}
                                        id={c.category.uuid}
                                        label={c.category.name}
                                        type="number"
                                        component={TextField}
                                        validate={validatelInteger}
                                        fullWidth
                                    />
                                )
                            })
                        }
                    </Form>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={submitForm} color="primary">
                        Save
                    </Button>
                    </DialogActions>
                    </div>
                )
            }}
            </Formik>
        </Dialog>
    )
}

export default EditReportDialog