import { connect } from 'react-redux'
import ApiActionStatusDialog from './ApiActionStatusDialog';

const mapStateToProps = (state) => ({
    apiStatus: state.apiAction
});

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ApiActionStatusDialog)