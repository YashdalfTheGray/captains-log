import React from 'react';
import * as _ from 'lodash';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import DatePicker from 'material-ui/DatePicker';

import styles from '../styles';

export default class AddEntry extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chargeCode: null,
            task: '',
            timeSpent: '',
            description: '',
            successSnackbarOpen: false,
            validateSnackbarOpen: false,
            taskDate: this.randomizeDate(new Date())
        };

        this.mdButtonRowStyle = _.assign({
            justifyContent: 'flex-end',
            paddingTop: '16px',
        }, styles.flexContainerRow, styles.flexItem);

        this.componentStyle = _.assign({
            maxWidth: '360px'
        }, styles.flexContainerColumn);

        this.randomizeDate = this.randomizeDate.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.setChargeCode = this.setChargeCode.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.saveNewEntry = this.saveNewEntry.bind(this);
        this.handleTaskNameChange = this.handleTaskNameChange.bind(this);
        this.handleTimeSpentChange = this.handleTimeSpentChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleSuccessRequestClose = this.handleSuccessRequestClose.bind(this);
        this.handleValidateRequestClose = this.handleValidateRequestClose.bind(this);
    }

    randomizeDate(date) {
        var randomSeconds = Math.floor(Math.random() * 59);
        var randomMs = Math.floor(Math.random() * 999);
        date.setSeconds(randomSeconds, randomMs);
        return date;
    }

    componentWillMount() {
        $.getJSON('/api/v1/charge-codes').then(result => {
            this.chargeCodes = result;
            this.setState({
                chargeCode: this.chargeCodes[0].code
            });
        }, error => {
            console.log(error);
        });
    }

    handleDateChange(event, date) {
        console.log(this.randomizeDate(date).getTime());
        this.setState({
            taskDate: this.randomizeDate(date)
        });
    }

    setChargeCode(event, index, value) {
        this.setState({
            chargeCode: value
        });
    }

    handleTaskNameChange(event) {
        this.setState({
            task: event.target.value
        });
    }

    handleTimeSpentChange(event) {
        this.setState({
            timeSpent: event.target.value
        });
    }

    handleDescriptionChange(event) {
        this.setState({
            description: event.target.value
        });
    }

    clearForm() {
        this.setState({
            chargeCode: this.chargeCodes[0].code,
            task: '',
            timeSpent: '',
            description: '',
            taskDate: this.randomizeDate(new Date())
        });
    }

    saveNewEntry() {
        var dataToSend = {
            chargeCode: this.state.chargeCode,
            task: this.state.task,
            timeSpent: this.state.timeSpent,
            description: this.state.description,
            date: this.state.taskDate.getTime()
        };

        if (dataToSend.chargeCode && dataToSend.task && dataToSend.timeSpent) {
            $.ajax({
                type: 'POST',
                url: '/api/v1/logs',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(dataToSend),
                success: result => {
                    if (result.ok) {
                        this.setState({
                            successSnackbarOpen: true
                        });
                        this.clearForm();
                    }
                }
            });
        }
        else {
            this.setState({
                validateSnackbarOpen: true
            });
        }
    }

    handleSuccessRequestClose() {
        this.setState({
            successSnackbarOpen: false
        })
    }

    handleValidateRequestClose() {
        this.setState({
            validateSnackbarOpen: false
        })
    }

    render() {
        var chargeCodeMenuItems = [];
        _.forEach(this.chargeCodes, chargeCode => {
            chargeCodeMenuItems.push(
                <MenuItem key={chargeCode.code} value={chargeCode.code} primaryText={chargeCode.name} />
            );
        });

        return (
            <div style={this.componentStyle}>
                <h2>Add New Entry</h2>
                <form>
                    <DatePicker
                        hintText="Custom Date (defaults to today)"
                        value={this.state.taskDate}
                        onChange={this.handleDateChange} />
                    <SelectField
                        value={this.state.chargeCode}
                        onChange={this.setChargeCode}>
                        {chargeCodeMenuItems}
                    </SelectField>
                    <TextField
                        hintText="(required)"
                        value={this.state.task}
                        onChange={this.handleTaskNameChange}
                        floatingLabelText="Task Name" />
                    <TextField
                        value={this.state.timeSpent}
                        onChange={this.handleTimeSpentChange}
                        hintText="(required)"
                        floatingLabelText="Time Spent (in hours)" />
                    <TextField
                        value={this.state.description}
                        onChange={this.handleDescriptionChange}
                        hintText="(optional)"
                        floatingLabelText="Task Description"
                        multiLine={true}
                        rows={2}
                        rowsMax={4} />
                    <div style={this.mdButtonRowStyle}>
                        <FlatButton
                            style={{ marginRight: '16px' }}
                            onTouchTap={this.clearForm}
                            label="Clear" />
                        <RaisedButton
                            label="Save"
                            onTouchTap={this.saveNewEntry}
                            primary={true} />
                    </div>
                </form>
                <Snackbar
                    open={this.state.successSnackbarOpen}
                    message="New log entry saved!"
                    autoHideDuration={3000}
                    onRequestClose={this.handleSuccessRequestClose} />
                <Snackbar
                    open={this.state.validateSnackbarOpen}
                    message="Log Entry is missing fields."
                    autoHideDuration={3000}
                    onRequestClose={this.handleValidateRequestClose} />
            </div>
        );
    }
}
