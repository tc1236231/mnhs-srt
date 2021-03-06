import DeleteReportPrompt from './DeleteReportPrompt';
import { deleteReport } from '../redux/actions'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    deleteReportFunc: (reportUUID) => dispatch(deleteReport(reportUUID))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteReportPrompt)