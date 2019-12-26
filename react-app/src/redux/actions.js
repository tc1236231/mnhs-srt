/*
 * action types
 */
export const FETCH_API = 'FETCH_API'
export const RECEIVE_USER = 'RECEIVE_USER'
export const RECEIVE_REPORT = 'RECEIVE_REPORT'

export const FILE_REPORT = 'FILE_REPORT'
export const EDIT_REPORT = 'EDIT_REPORT'
export const DELETE_REPORT = 'DELETE_REPORT'
/*
 * other constants
 */

/*
 * action creators
 */
export function fileReport(report) {
  return { type: FILE_REPORT, report }
}
export function editReport(values) {
  return { type: EDIT_REPORT, values }
}
export function deleteReport(reportUUID) {
  return { type: DELETE_REPORT, reportUUID }
}