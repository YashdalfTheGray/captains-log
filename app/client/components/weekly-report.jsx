import React from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import Table from 'material-ui/lib/table/table';

import styles from '../styles';
import WorkItem from './work-item';

export default class WeeklyReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dateToReport: new Date(),
            report: {},
            chargeCodes: []
        };

        this.tableStyle = {
            margin: '16px 0px'
        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
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

    render() {
        var workItems = [], workTableRows = [];

        _.forEach(this.state.report.entries, i => {
            var codeForWork = _.find(this.state.chargeCodes, chargeCode => {
                return chargeCode.code === i.doc.chargeCode;
            });

            var unixDate = parseInt(i.id.split('_')[1]);

            workItems.push(
                <WorkItem
                    key={i.key}
                    taskName={i.doc.task}
                    taskType={codeForWork.name}
                    taskCode={codeForWork.code}
                    timeSpent={i.doc.timeSpent}
                    dateLogged={unixDate}
                    taskDescription={i.doc.description} />
            );
        });

        return (
            <div>
                <h2 style={styles.robotoFont}>Weekly Report</h2>
                <DatePicker
                    hintText="Report date"
                    value={this.state.dateToReport}
                    onChange={this.handleDateChange} />

                <Table style={this.tableStyle}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Charge Code</TableHeaderColumn>
                            <TableHeaderColumn>Monday</TableHeaderColumn>
                            <TableHeaderColumn>Tuesday</TableHeaderColumn>
                            <TableHeaderColumn>Wednesday</TableHeaderColumn>
                            <TableHeaderColumn>Thursday</TableHeaderColumn>
                            <TableHeaderColumn>Friday</TableHeaderColumn>
                            <TableHeaderColumn>Saturday</TableHeaderColumn>
                            <TableHeaderColumn>Sunday</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workTableRows}
                    </TableBody>
                </Table>
                {workItems}
            </div>
        );
    }
}
