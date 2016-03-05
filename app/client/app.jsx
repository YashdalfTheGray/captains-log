import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import AppRawTheme from './theme';

export default class App extends React.Component {

    static childContextTypes = {
        muiTheme: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = { open: false };

        this.getChildContext = this.getChildContext.bind(this);
        this.navMenuClick = this.navMenuClick.bind(this);
        this.menuItemClick = this.menuItemClick.bind(this);
        this.onRequestChange = this.onRequestChange.bind(this);
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(AppRawTheme)
        };
    }

    navMenuClick() {
        this.setState({ open: !this.state.open });
    }

    menuItemClick() {
        console.log('Someone clicked on a menu item!');
    }

    onRequestChange(open) {
        this.setState({ open });
    }

    render() {
        return (
            <div>
                <AppBar
                    title="Captain's Log"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onLeftIconButtonTouchTap={this.navMenuClick} />
                <LeftNav
                    docked={false}
                    width={250}
                    open={this.state.open}
                    onRequestChange={this.onRequestChange}>
                    <MenuItem onTouchTap={this.menuItemClick}>Daily Report</MenuItem>
                    <MenuItem onTouchTap={this.menuItemClick}>Weekly Report</MenuItem>
                </LeftNav>
            </div>
        );
    }
}
