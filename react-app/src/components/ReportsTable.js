import React, { forwardRef } from 'react';
import MaterialTable from 'material-table'
import DeleteReportPromptContainer from './DeleteReportPromptContainer'
import EditReportDialogContainer from './EditReportDialogContainer';
import FileReportDialogContainer from './FileReportDialogContainer';
import AppBar from './AppBar';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const ReportsTable = ({ reports, authToken, fetchFromAPI, auth, isLoading, newData }) => {
    const [openDeletePrompt, setOpenDeletePrompt] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [selectedReportUUID, setSelectedReportUUID] = React.useState('');

    React.useEffect(() => {
        if(authToken && authToken.trim() !== '' && newData)
            fetchFromAPI(auth.email);
    }, [authToken, auth.email, fetchFromAPI, newData]);

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'];

    const findReportByUUID = (uuid) => reports.find((r) => r.uuid === uuid);

    const composeDeleteReportParams = (report) => { 
        return {reportUUID: report.uuid, siteName: report.site.name, reportDate: reportPeriodFunc(report)} 
    };

    const composeEditReportParams = (report) => { 
        return {
            reportUUID: report.uuid, 
            siteName: report.site.name, 
            reportDate: reportPeriodFunc(report), 
            items: report.items, 
            notes: report.notes,
            reportType: report.resourcetype
        } 
    };

    const allItemsFunc = (rowData) => {
        if(!rowData.items)
            return "";
        return rowData.items.map((c, i) => {
            return (
                <div key={c.uuid}> 
                    {c.category.name}: <b>{c.count}</b><br />
                </div>
            )
        });
    };

    const reportPeriodFunc = (rowData) => {
        if(rowData.resourcetype === "MonthlyReport")
            return MONTHS[parseInt(rowData.year_month.split('-')[1]) - 1] + ", " + rowData.year_month.split('-')[0]; 
        else
            return rowData.date;
    };

    const reportPeriodSortFunc = (a, b) => {
        let aDate = new Date(a.date);
        if(a.month && a.year)
            aDate = new Date(a.year, a.month);
        let bDate = new Date(b.date);
        if(b.month && b.year)
            bDate = new Date(b.year, b.month);
        return aDate - bDate;
    };

    const dateSubmittedFunc = (rowData) => {
        if(rowData.modified)
            return new Date(rowData.modified).toLocaleString();
        else
            return "";
    };

    return (
        <Box m={4} >
            <TableContainer component={Paper} elevation={3}>
                <MaterialTable
                    icons={tableIcons}
                    isLoading={isLoading}
                    columns={[
                        { title: "Site Name", field: "site.name" },
                        { 
                            title: "Report Period", 
                            render: reportPeriodFunc,
                            customSort: reportPeriodSortFunc,
                            customFilterAndSearch: (f, r, _) => reportPeriodFunc(r).includes(f)
                        },
                        { title: "Closed", field: "closed", type: "boolean" },
                        { title: "Items", render: allItemsFunc, sorting: false },
                        { 
                            title: "Last Modified", 
                            render: dateSubmittedFunc,
                            customSort: (a, b) => new Date(a.modified) - new Date(b.modified),
                            customFilterAndSearch: (f, r, _) => dateSubmittedFunc(r).includes(f)
                        }
                    ]}
                    data={reports}
                    title={<AppBar openFileReportDialog={() => setOpenCreateDialog(true)} />}
                    options={{
                        sorting: true,
                        search: true,
                        rowStyle: (r, i) => {
                            if (i % 2) {
                                return {backgroundColor: "#f2f2f2"}
                            }
                        },
                        pageSize: 10
                    }}
                    detailPanel={rowData => {
                        return (<Box m={3}><Typography variant="body1">{`Notes: ${rowData.notes}`}</Typography></Box>)
                    }}
                    actions={[
                        {
                            icon: tableIcons.Edit,
                            tooltip: 'Edit Report',
                            onClick: (event, rowData) => {
                                setOpenEditDialog(true);
                                setSelectedReportUUID(rowData.uuid);                          
                            }
                        },
                        {
                            icon: tableIcons.Delete,
                            tooltip: 'Delete Report',
                            onClick: (event, rowData) => {
                                setOpenDeletePrompt(true);
                                setSelectedReportUUID(rowData.uuid);
                            }
                        }
                    ]}
                />
                {
                    openDeletePrompt && findReportByUUID(selectedReportUUID) &&
                    <DeleteReportPromptContainer 
                        {...composeDeleteReportParams(findReportByUUID(selectedReportUUID))} 
                        handleClose={() => setOpenDeletePrompt(false)} />
                }
                {
                    openEditDialog && 
                    <EditReportDialogContainer
                        {...composeEditReportParams(findReportByUUID(selectedReportUUID))} 
                        handleClose={() => setOpenEditDialog(false)} />
                }
                {
                    openCreateDialog && 
                    <FileReportDialogContainer 
                        handleClose={() => setOpenCreateDialog(false)} />
                }
            </TableContainer>
        </Box>
    );
}

export default ReportsTable