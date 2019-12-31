import axios from 'axios';

/*
 * action types
 */
export const FETCH_API = 'FETCH_API'
export const RECEIVE_API = 'RECEIVE_API'
export const FAIL_API = 'FAIL_API'

export const FILE_REPORT = 'FILE_REPORT'
export const EDIT_REPORT = 'EDIT_REPORT'
export const DELETE_REPORT = 'DELETE_REPORT'

export const REQUEST_API_ACTION = 'REQUEST_API_ACTION'
export const RECEIVE_API_ACTION = 'RECEIVE_API_ACTION'
export const FAIL_API_ACTION = 'FAIL_API_ACTION'

export const FETCH_API_TOKEN = 'FETCH_API_TOKEN'
export const RECEIVE_API_TOKEN = 'RECEIVE_API_TOKEN'

axios.defaults.withCredentials = true

/*
 * other constants
 */

/*
 * action creators
 */
export function fetchAPIToken(email) {
    return { type: FETCH_API_TOKEN, email }
}

export function receiveAPIToken(email, token) {
    return { type: RECEIVE_API_TOKEN, email, token }
}

export function fileReport(report) {
    const fileReportRequest = {type: REQUEST_API_ACTION, action: FILE_REPORT, report};

    return dispatch => {
        dispatch(fileReportRequest)
        return axios.post(`http://localhost:8000/api/report`, {
            ...report
        }, { 
            withCredentials: true 
          })
          .then(response => response)
          .then(status => dispatch(receiveAPIAction(FILE_REPORT, status)))
          .catch(error => dispatch(failAPIAction(FILE_REPORT, error)))
    }
}

export function editReport(reportUUID, values) {
    const editReportRequest = {type: REQUEST_API_ACTION, action: EDIT_REPORT, values};

    return dispatch => {
        dispatch(editReportRequest)
        return axios.put(`http://localhost:8000/api/report/${reportUUID}`, {
            ...values
        }, { 
            withCredentials: true 
          })
          .then(response => response)
          .then(status => dispatch(receiveAPIAction(EDIT_REPORT, status)))
          .catch(error => dispatch(failAPIAction(EDIT_REPORT, error)))
    }
}

export function deleteReport(reportUUID) {
    const deleteReportRequest = {type: REQUEST_API_ACTION, action: DELETE_REPORT, reportUUID};

    return dispatch => {
        dispatch(deleteReportRequest)
        return axios.delete(`http://localhost:8000/api/report/${reportUUID}`, { 
            withCredentials: true 
          })
          .then(response => response)
          .then(status => dispatch(receiveAPIAction(DELETE_REPORT, status)))
          .catch(error => dispatch(failAPIAction(DELETE_REPORT, error)))
    }
}

export function failAPIAction(action, error) {
    return { type: FAIL_API_ACTION, action: action, status: error.status, error, receivedAt: Date.now()}
}

export function receiveAPIAction(action, status) {
    return { type: RECEIVE_API_ACTION, action: action, status, receivedAt: Date.now()}
}

export function fetchAPI(email) {
    return { type: FETCH_API, email }
}

export function receiveAPI(json) {
    let user = {uuid: json.uuid, email: json.email, displayName: json.displayName, assignments: json.assignments};
    let reports = json.reports;
    return { type: RECEIVE_API, user, reports, receivedAt: Date.now()}
}

export function errorAPI(error)
{
    return { type: FAIL_API, error, receivedAt: Date.now()}
}

export function requestAPI(email) {
    return dispatch => {
      dispatch(fetchAPI(email))
      return axios.get(`http://localhost:8000/api/user/${email}`, { 
          withCredentials: true 
        })
        .then(response => response.data)
        .then(json => dispatch(receiveAPI(json)))
        .catch(error => dispatch(errorAPI(error)))
    }
}