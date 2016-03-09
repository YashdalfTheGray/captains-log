import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import styles from '../styles';

export default class WorkItem extends React.Component {

    static propTypes = {
        taskName: React.PropTypes.string.isRequired,
        taskType: React.PropTypes.string.isRequired,
        time: React.PropTypes.string.isRequired,
        taskDescription: React.PropTypes.string
    }

    constructor(props) {
        super(props);

        this.workItemCardStyle = {
            maxWidth: '400px',
            margin: '16px'
        };
    }

    render() {
        var textArea;
        if (this.props.taskDescription) {
            textArea = <CardText>{this.props.taskDescription}</CardText>;
        }
        else {
            textArea = <CardText style={styles.hiddenElement} />
        }
        return (
            <Card style={this.workItemCardStyle}>
                <CardHeader
                    title={this.props.taskName}
                    subtitle={this.props.taskType + ' (' + this.props.time + ')'}/>
                {textArea}
            </Card>
        );
    }
}
