import ReportsTable from './ReportsTable';
import { requestAPI } from '../redux/actions'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
    reports: state.report.items,
    auth: state.firebase.auth,
    isLoading: state.user.isFetching || state.authToken.isFetching,
    authToken: state.authToken.token,
    newData: state.apiAction.newData
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchFromAPI: (email) => dispatch(requestAPI(email))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportsTable)