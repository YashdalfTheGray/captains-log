import React from 'react';
import moment from 'moment';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import styles from '../styles';

export default class WorkItem extends React.Component {

    static propTypes = {
        taskName: React.PropTypes.string.isRequired,
        taskType: React.PropTypes.string.isRequired,
        timeSpent: React.PropTypes.string.isRequired,
        dateLogged: React.PropTypes.number,
        taskDescription: React.PropTypes.string
    }

    constructor(props) {
        super(props);

        this.workItemCardStyle = {
            width: '360px',
            margin: '16px'
        };
    }

    render() {
        var textArea, timeDetails;
        if (this.props.taskDescription) {
            textArea = <p>{this.props.taskDescription}</p>;
        }
        else {
            textArea = <div style={styles.hiddenElement} />;
        }

        if (this.props.dateLogged) {
            var parsedDate = moment(this.props.dateLogged);
            var dateFormatString = 'dddd, MMMM D YYYY';
            timeDetails = <p>{this.props.timeSpent} hours logged on {parsedDate.format(dateFormatString)}.</p>;
        }
        else {
            timeDetails = <p>{this.props.timeSpent} hours logged.</p>;
        }
        return (
            <Card style={this.workItemCardStyle}>
                <CardHeader
                    title={this.props.taskName}
                    subtitle={this.props.taskType + ' (' + this.props.taskCode + ')'}
                    actAsExpander={true}
                    showExpandableButton={true} />
                <CardText
                    expandable={true}>
                    {timeDetails}
                    {textArea}
                </CardText>;
                <CardActions
                    expandable={true}>
                    <FlatButton
                        label="Delete"
                        onTouchTap={this.props.handleItemDelete} />
                </CardActions>
            </Card>
        );
    }
}
