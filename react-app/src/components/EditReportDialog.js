import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

const EditReportDialog = ({
        reportUUID, siteName, reportDate, items, notes, 
        reportType, handleClose, editReportFunc
    }) => {
    const validatelInteger = (num) => {
        return num !== Infinity && num >= 0 ? "" : "Incorrect Format"
    };

    const initialVals = () => {
        let vals = {
            notes, 
            counts: Object.assign({}, ...items.map((c,i) => ({[c.category.uuid]: c.count})))
        };
        return vals;
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
            initialValues= {initialVals()}
            validate={values => {
                const errors = {};
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                const submitValues = {notes: values.notes, resourcetype: reportType};
                submitValues.items = Object.keys(values.counts).map(cuuid => ({
                    category: cuuid,
                    count: values.counts[cuuid]
                }));
                editReportFunc(reportUUID, submitValues);
                setSubmitting(false);
                handleClose();
            }}
            >
            {({submitForm, ...restProps}) => {
                return (
                    <div>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are editing the report of <b>{siteName}</b> on <b>{reportDate}</b>
                    </DialogContentText>
                    <Form>
                        {
                            items.map((c, i) => {
                                return (
                                    <Field
                                        key={"counts." + c.category.uuid}
                                        name={"counts." + c.category.uuid}
                                        id={"counts." + c.category.uuid}
                                        label={c.category.name}
                                        type="number"
                                        component={TextField}
                                        validate={validatelInteger}
                                        fullWidth
                                    />
                                )
                            })
                        }
                        <Field
                            key='notes'
                            name='notes'
                            id='notes'
                            label='Notes'
                            type="text"
                            component={TextField}
                            fullWidth
                        />
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