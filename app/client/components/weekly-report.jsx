import React from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import styles from '../styles';

export default class WeeklyReport extends React.Component {

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
                console.log(result);
            }, error =>{
                console.log(error);
            });
        });
    }

    render() {
        return (
            <div>
                <h2 style={styles.robotoFont}>Weekly Report</h2>
                <DatePicker
                    hintText="Report date"
                    value={this.state.dateToReport}
                    onChange={this.handleDateChange} />
            </div>
        );
    }
}
