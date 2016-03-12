import React from 'react';
import * as _ from 'lodash';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import Snackbar from 'material-ui/lib/snackbar';

import styles from '../styles';
import WorkItem from './work-item';

export default class DailyReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dateToReport: new Date(),
            report: {},
            chargeCodes: [],
            successSnackbarOpen: false
        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSuccessRequestClose = this.handleSuccessRequestClose.bind(this);
    }

    componentWillMount() {
        $.getJSON('/api/v1/reports/day?for=' + this.state.dateToReport.getTime()).then(result => {
            this.setState({
                report: result
            });
        }, error =>{
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
            $.getJSON('/api/v1/reports/day?for=' + this.state.dateToReport.getTime()).then(result => {
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
        var workItems = [];
        _.forEach(this.state.report.entries, i => {
            var codeForWork = _.find(this.state.chargeCodes, chargeCode => {
                return chargeCode.code === i.doc.chargeCode;
            });
            workItems.push(
                <WorkItem
                    key={i.key}
                    taskName={i.doc.task}
                    taskType={codeForWork.name}
                    taskCode={codeForWork.code}
                    timeSpent={i.doc.timeSpent}
                    taskDescription={i.doc.description}
                    handleItemDelete={this.handleItemDelete.bind(this, i.id)} />
            );
        });
        return (
            <div>
                <h2 style={styles.robotoFont}>Daily Report</h2>
                <DatePicker
                    hintText="Report date"
                    value={this.state.dateToReport}
                    onChange={this.handleDateChange} />
                {workItems}
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
