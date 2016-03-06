import React from 'react';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import styles from '../styles';
import * as _ from 'lodash';

export default class AddEntry extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chargeCode: null
        };

        this.setChargeCode = this.setChargeCode.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    componentWillMount() {
        this.chargeCodesRequest = $.getJSON('/api/v1/charge-codes').then(result => {
            this.chargeCodes = result;
            this.setState({
                chargeCode: this.chargeCodes[0].code
            });
        }, error => {
            console.log(error);
        });
    }

    componentWillUnmount() {
        this.chargeCodesRequest.abort();
    }

    setChargeCode(event, index, value) {
        this.setState({
            chargeCode: value
        });
    }

    render() {
        var chargeCodeMenuItems = [];
        _.forEach(this.chargeCodes, chargeCode => {
            chargeCodeMenuItems.push(
                <MenuItem key={chargeCode.code} value={chargeCode.code} primaryText={chargeCode.name} />
            );
        });

        return (
            <div>
                <h2 style={styles.viewHeading}>Add New Entry</h2>
                <SelectField value={this.state.chargeCode} onChange={this.setChargeCode}>
                    {chargeCodeMenuItems}
                </SelectField>

            </div>
        );
    }
}
