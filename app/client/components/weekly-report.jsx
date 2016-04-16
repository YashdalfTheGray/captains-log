import React from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import Snackbar from 'material-ui/Snackbar';
import MediaQuery from 'react-responsive';

import styles from '../styles';
import WorkItem from './work-item';

export default class WeeklyReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dateToReport: new Date(),
            report: {},
            chargeCodes: [],
            successSnackbarOpen: false
        };

        this.workItemStyle = _.assign({ marginTop: '32px' }, styles.flexContainerRow, styles.flexWrap);
        this.lighterText = { color: '#E0E0E0' };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSuccessRequestClose = this.handleSuccessRequestClose.bind(this);
    }

    componentWillMount() {
        $.getJSON('/api/v1/reports/week?for=' + this.state.dateToReport.getTime()).then(result => {
            this.setState({
                report: result
            });
        }, error => {
            console.log(error);
        });
        $.getJSON('/api/v1/charge-codes').then(result => {
            this.setState({
                chargeCodes: result
            });
        }, error => {
            console.log(error);
        });
    }

    handleDateChange(event, date) {
        this.setState({
            dateToReport: date
        }, () => {
            $.getJSON('/api/v1/reports/week?for=' + this.state.dateToReport.getTime()).then(result => {
                this.setState({
                    report: result
                });
            }, error => {
                console.log(error);
            });
        });
    }

    handleItemDelete(id) {
        var updatedReport = this.state.report;
        _.remove(updatedReport.entries, function(value) {
            return value.id === id;
        });
        this.setState({
            report: updatedReport
        })
        $.ajax({
            type: 'DELETE',
            url: '/api/v1/logs/' + id,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({}),
            success: result => {
                if (result.ok) {
                    this.setState({
                        successSnackbarOpen: true
                    });
                }
            }
        });
    }

    handleSuccessRequestClose() {
        this.setState({
            successSnackbarOpen: false
        });
    }

    render() {
        var workItems = [], rowDataset = [], workTableRows = [];

        _.forEach(this.state.chargeCodes, c => {
            rowDataset.push([c.code, 0, 0, 0, 0, 0, 0, 0]);
        });

        _.forEach(this.state.report.entries, i => {
            var codeForWork = _.find(this.state.chargeCodes, chargeCode => {
                return chargeCode.code === i.doc.chargeCode;
            });

            var unixDate = parseInt(i.id.split('_')[1]);
            var weekDayNumber = moment(unixDate).day();
            weekDayNumber = weekDayNumber === 0 ? 7 : weekDayNumber;

            var rowIndex = _.findIndex(rowDataset, row => {
                return row[0] === codeForWork.code;
            });

            rowDataset[rowIndex][weekDayNumber] += Number(i.doc.timeSpent);

            workItems.push(
                <WorkItem
                    key={i.key}
                    taskName={i.doc.task}
                    taskType={codeForWork.name}
                    taskCode={codeForWork.code}
                    timeSpent={i.doc.timeSpent}
                    dateLogged={unixDate}
                    taskDescription={i.doc.description}
                    handleItemDelete={this.handleItemDelete.bind(this, i.id)} />
            );
        });

        _.forEach(rowDataset, dataRow => {
            var columns = [], columnNumber = 0;
            _.forEach(dataRow, e => {
                var columnToPush;
                if (e === 0) {
                    columnToPush = <TableRowColumn key={columnNumber} style={this.lighterText}>{e}</TableRowColumn>
                }
                else {
                    columnToPush = <TableRowColumn key={columnNumber}>{e}</TableRowColumn>;
                }
                columns.push(columnToPush);
                columnNumber++;
            });
            workTableRows.push(
                <TableRow key={dataRow[0]}>{columns}</TableRow>
            );
        })

        return (
            <div>
                <h2 style={styles.robotoFont}>Weekly Report</h2>
                <DatePicker
                    hintText="Report date"
                    value={this.state.dateToReport}
                    onChange={this.handleDateChange} />

                <Table>
                    <TableHeader
                        adjustForCheckbox={false}
                        displaySelectAll={false}
                        enableSelectAll={false}>
                        <MediaQuery maxDeviceWidth={1280} minDeviceWidth={841} component={TableRow} displayBorder={false}>
                            <TableHeaderColumn>Code</TableHeaderColumn>
                            <TableHeaderColumn>Monday</TableHeaderColumn>
                            <TableHeaderColumn>Tuesday</TableHeaderColumn>
                            <TableHeaderColumn>Wednesday</TableHeaderColumn>
                            <TableHeaderColumn>Thursday</TableHeaderColumn>
                            <TableHeaderColumn>Friday</TableHeaderColumn>
                            <TableHeaderColumn>Saturday</TableHeaderColumn>
                            <TableHeaderColumn>Sunday</TableHeaderColumn>
                        </MediaQuery>
                        <MediaQuery maxDeviceWidth={840} minDeviceWidth={481} component={TableRow} displayBorder={false}>
                            <TableHeaderColumn>Code</TableHeaderColumn>
                            <TableHeaderColumn>Mon</TableHeaderColumn>
                            <TableHeaderColumn>Tues</TableHeaderColumn>
                            <TableHeaderColumn>Wed</TableHeaderColumn>
                            <TableHeaderColumn>Thurs</TableHeaderColumn>
                            <TableHeaderColumn>Fri</TableHeaderColumn>
                            <TableHeaderColumn>Sat</TableHeaderColumn>
                            <TableHeaderColumn>Sun</TableHeaderColumn>
                        </MediaQuery>
                        <MediaQuery maxDeviceWidth={480} component={TableRow} displayBorder={false}>
                            <TableHeaderColumn>Code</TableHeaderColumn>
                            <TableHeaderColumn>M</TableHeaderColumn>
                            <TableHeaderColumn>T</TableHeaderColumn>
                            <TableHeaderColumn>W</TableHeaderColumn>
                            <TableHeaderColumn>Th</TableHeaderColumn>
                            <TableHeaderColumn>F</TableHeaderColumn>
                            <TableHeaderColumn>S</TableHeaderColumn>
                            <TableHeaderColumn>S</TableHeaderColumn>
                        </MediaQuery>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {workTableRows}
                    </TableBody>
                </Table>
                <div style={this.workItemStyle}>
                    {workItems}
                </div>
                <Snackbar
                    style={styles.robotoFont}
                    open={this.state.successSnackbarOpen}
                    message="Entry deleted!"
                    autoHideDuration={3000}
                    onRequestClose={this.handleSuccessRequestClose} />
            </div>
        );
    }
}
