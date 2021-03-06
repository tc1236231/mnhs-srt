import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, number, string, boolean, date } from 'yup';

const currentDate = new Date();

let startYear = 2010;
const years = [startYear];
const currentYear = currentDate.getFullYear();
while (years[years.length - 1] < currentYear) {
  years.push(years[years.length - 1] + 1);
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
const currentMonth = currentDate.getMonth();

const getSite = (sites, siteId) => sites.find(s => s.uuid === siteId);

const initSiteValues = (values, site) => {
  if (site.reportMode === 'MONTHLY') {
    delete values.date;
    delete values.closed;
    values.year = currentMonth === 0 ? currentYear - 1 : currentYear;
    values.month = currentMonth === 0 ? 11 : currentMonth - 1;
  } else {
    delete values.year;
    delete values.month;
    let localISOString = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString();
    values.date = localISOString.split('T')[0];
  }

  values.counts = {};
  site.categories.forEach(c => {
    values.counts[c.uuid] = '';
  });
};

const initialValues = sites => {
  let values = {
    'site-id': '',
    counts: {},
    notes: ''
  };
  
  if (sites.length === 1) {
    values['site-id'] = sites[0].uuid;
    initSiteValues(values, sites[0]);
  }
  
  return values;
};

function SiteDependentFields({sites, values, errors, isSubmitting}) {
  let getSelectedSite = () => getSite(sites, values['site-id']);
  
  return (
    <div>
      {getSelectedSite().reportMode === 'MONTHLY' ? (
        <div>
          <label>
            This report concerns which month?
          </label>
          <div className="row">
            <div className="form-group col-6">
              <Field
                className="form-control"
                component="select"
                name="month"
                id="month"
              >
                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </Field>
            </div>
            <div className="form-group col-6">
              <Field
                className="form-control"
                component="select"
                name="year"
                id="year"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Field>
              <div className="form-text text-danger">
                <ErrorMessage name="year" />
              </div>
            </div>
            <div className="form-text text-danger mx-auto">
              {errors.month &&
               <div className="form-text text-danger">
                 {errors.month}
               </div>}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="date">
              This report concerns which date?
            </label>
            <Field
              className="form-control"
              type="date"
              name="date"
              id="date"
            />
            {errors.date &&
             <div className="form-text text-danger">
               {errors.date}
             </div>}
          </div>
          <div className="form-check my-2">
            <Field
              className="form-check-input"
              type="checkbox"
              name="closed"
              id="closed"
            />
            <label className="form-check-lable" htmlFor="closed">
              <strong>
                Check here if this site was closed on the selected date.
              </strong>
            </label>
            <div className="form-text text-danger">
              <ErrorMessage name="closed" />
            </div>
          </div>
        </div>
      )}
      {!values.closed && (
        <fieldset className="my-2">
          <legend>Visit Counts</legend>
          <div className="form-text my-3">
            Please enter the number of visitors that attended in each category. For guidance in categorizing visitors, click <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/document/d/1z1zADs98XaGECbF1QWoJpUyMhbu-q_fWmQAYuzLqZDk/edit?usp=sharing">here</a>.
          </div>
          {getSelectedSite().categories.map(c => (
            <div key={"counts." + c.uuid}>
              <div className="form-group row">
                <label
                  className="col-6 col-form-label"
                  htmlFor={"counts." + c.uuid}
                >
                  {c.name}
                </label>
                <div className="col-6">
                  <Field
                    className="form-control"
                    type="number"
                    name={"counts." + c.uuid}
                    id={"counts." + c.uuid}
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div className="form-text text-danger">
                <ErrorMessage
                  name={"counts." + c.uuid}
                  component="div"
                />
              </div>
            </div>
          ))}
        </fieldset>
      )}
      <div className="form-group">
        <label htmlFor="notes">
          Please note anything that may have significantly effected attendance
          {getSelectedSite().reportMode === "MONTHLY" ?
           " during the month." :
           " on the reporting day."}
        </label>
        <Field
          className="form-control"
          component="textarea"
          name="notes"
          id="notes" />
        <div className="form-text text-danger">
          <ErrorMessage name="notes" component="div" />
        </div>
      </div>
      {Object.keys(errors).length > 0 && (
        <div className="form-text text-danger mt-1 mb-3">
          <strong>
            You must correct the issues above before submitting.
          </strong>
        </div>)
      }
      <button
        className="btn btn-primary"
        type="submit"
        disabled={Object.keys(errors).length > 0 || isSubmitting}
      >
        Submit
      </button>
    </div>
  );
}

const FileReportForm = ({ user, reports, fileReportFunc, handleClose}) => {
    if (typeof user === 'undefined' || user.assignments === undefined)
        return <h2 style={{color: 'red'}}>Error: Not Enough User Info</h2>
    else {
        const sites = user.assignments.map(a => ({ ...a.site, categories: a.categories.map(c => c.category) }));
        return (
            <div>
                <h2>New Site Report</h2>
                <Formik
                initialValues={initialValues(sites)}
                validationSchema={object().shape({
                    'site-id': string().required('Please choose a site.'),
                    date: date()
                    .when('site-id', {
                        is: siteId => getSite(sites, siteId).reportMode !== 'MONTHLY',
                        then: date()
                        .required('Please enter a date.')
                        .typeError('Please enter a valid date.')
                        .max(new Date(), 'Please enter a current or past date.')
                        .test(
                            'already submitted',
                            "You've already submitted a report for this date.",
                            value => (
                            reports
                                .map(r => r.date)
                                .indexOf(value.toISOString().split('T')[0])
                                === -1)
                        )
                    }),
                    closed: boolean(),
                    year: number()
                    .when('site-id', {
                        is: siteId => getSite(sites, siteId).reportMode === 'MONTHLY',
                        then: number().required('Please choose a year.'),
                    }),
                    month: number()
                    .when('site-id', {
                        is: siteId => getSite(sites, siteId).reportMode === 'MONTHLY',
                        then: number()
                        .required('Please choose a month.')
                        .when('year', {
                            is: year => year === currentYear,
                            then: number().max(
                            currentMonth - 1, 'Please choose a past month.'),
                            otherwise: number()
                        })
                        .when(['site-id', 'year', 'month'], {
                            is: (siteId, year, month) => reports && reports.some(
                                r => r.site.uuid === siteId
                                    && year === r.year
                                    && month === (r.month - 1)
                            ),
                            then: number().test(
                                'month-already-submitted',
                                "You've already submitted a report for this month.",
                                () => false
                            )
                        })
                    }),
                    notes: string()
                })}
                onSubmit={(values, { setSubmitting, resetForm}) => {
                    let report = {
                        submitter: user.uuid,
                        site: values['site-id'],
                        date: values['date'],
                        closed: values['closed'],
                        year: values['year'],
                        notes: values['notes'],
                        resourcetype: 'DailyReport'
                    };
                    if(values['month']) {
                      report.month = parseInt(values['month']) + 1;
                      report.resourcetype = 'MonthlyReport';
                    }
                    
                    report.items = Object.keys(values.counts).map(cuuid => ({
                        category: cuuid,
                        count: values.counts[cuuid]
                    }));
                    
                    fileReportFunc(report);
                    setSubmitting(false);
                    resetForm();
                    handleClose();
                }}
                >
                {({ values, touched, errors, handleChange, isSubmitting }) => {
                    return (
                    <Form>
                        <div className="form-group">
                        <label htmlFor="site-id">
                            For which site are you reporting?
                        </label>
                        <Field
                            className="form-control"
                            component="select"
                            name="site-id"
                            id="site-id"
                            disabled={sites.length === 1}
                            onChange={e => {
                            if (!values['site-id']
                                || window.confirm(
                                    "This will clear fields you've entered. Continue?")
                                )
                            {
                                initSiteValues(values, getSite(sites, e.target.value));
                                handleChange(e);
                            }
                            }}
                        >
                            {!values['site-id'] &&
                            <option value="">Select a site...</option>}
                            {sites.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
                        </Field>
                        <div className="form-text text-danger">
                            <ErrorMessage name="site-id" />
                        </div>
                        </div>
                        {values['site-id'] && values['site-id'] !== '' &&
                        <SiteDependentFields
                        sites={sites}
                        values={values}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        />}
                    </Form>
                    );
                }}
                </Formik>
            </div>
          )
        };
};

export default FileReportForm;
