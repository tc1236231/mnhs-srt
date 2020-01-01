import React from 'react'
import ReportsTable from './ReportsTable';
import { requestAPI } from '../redux/actions'
import { connect } from 'react-redux'
import ApiActionStatusDialogContainer from './ApiActionStatusDialogContainer'

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

const ReportsTableMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportsTable)

const ReportsTableContainer = () => {
    return (
        <div>
            <ApiActionStatusDialogContainer></ApiActionStatusDialogContainer>
            <ReportsTableMapped></ReportsTableMapped>
        </div>
    )
}

export default ReportsTableContainer