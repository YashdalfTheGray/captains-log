import React from 'react';
import * as _ from 'lodash';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import styles from '../styles';

import WorkItem from './work-item';

export default class DailyReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dateToReport: new Date(),
            report: {},
            chargeCodes: []
        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
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
        }, error =>{
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
            }, error =>{
                console.log(error);
            });
        });
    }

    render() {
        var workItems = [];
        _.forEach(this.state.report.entries, i => {
            var code = _.find(this.state.chargeCodes, chargeCode => {
                return chargeCode.code === i.doc.chargeCode;
            });
            workItems.push(
                <WorkItem
                    key={i.id}
                    taskName={i.doc.task}
                    taskType={code.name}
                    time={i.doc.timeSpent}
                    taskDescription={i.doc.description} />
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
            </div>
        );
    }
}
