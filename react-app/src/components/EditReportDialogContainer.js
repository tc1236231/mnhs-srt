import EditReportDialog from './EditReportDialog';
import { editReport } from '../redux/actions'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
    apiStatus: state.apiAction
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    editReportFunc: (reportUUID, values) => dispatch(editReport(reportUUID, values))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditReportDialog)