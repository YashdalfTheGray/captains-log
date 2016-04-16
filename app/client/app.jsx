import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppRawTheme from './theme';
import styles from './styles';
import AddEntry from './components/add-entry';
import DailyReport from './components/daily-report';
import WeeklyReport from './components/weekly-report';

const appMuiTheme = getMuiTheme(AppRawTheme);

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            currentView: 'add-entry'
        };

        this.childViews = {
            ADD_ENTRY: 'add-entry',
            DAILY_REPORT: 'daily-report',
            WEEKLY_REPORT: 'weekly-report'
        }

        this.navMenuClick = this.navMenuClick.bind(this);
        this.showAddEntry = this.showAddEntry.bind(this);
        this.showDailyReport = this.showDailyReport.bind(this);
        this.showWeeklyReport = this.showWeeklyReport.bind(this);
        this.onRequestChange = this.onRequestChange.bind(this);
    }

    navMenuClick() {
        this.setState({ open: !this.state.open });
    }

    showAddEntry() {
        this.setState({
            currentView: this.childViews.ADD_ENTRY,
            open: false
        });
    }

    showDailyReport() {
        this.setState({
            currentView: this.childViews.DAILY_REPORT,
            open: false
        });
    }

    showWeeklyReport() {
        this.setState({
            currentView: this.childViews.WEEKLY_REPORT,
            open: false
        });
    }

    onRequestChange(open) {
        this.setState({ open });
    }

    render() {
        var viewNameToShow = this.state.currentView;
        var viewToShow;

        if (viewNameToShow === this.childViews.ADD_ENTRY) {
            viewToShow = <AddEntry />;
        }
        else if (viewNameToShow === this.childViews.DAILY_REPORT) {
            viewToShow = <DailyReport />;
        }
        else if (viewNameToShow === this.childViews.WEEKLY_REPORT) {
            viewToShow = <WeeklyReport />;
        }

        return (
            <MuiThemeProvider muiTheme={appMuiTheme}>
                <div>
                    <AppBar
                        title="Captain's Log"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={this.navMenuClick} />
                    <div style={styles.container}>
                        {viewToShow}
                    </div>
                    <Drawer
                        docked={false}
                        open={this.state.open}
                        onRequestChange={this.onRequestChange}>
                        <MenuItem onTouchTap={this.showAddEntry}>Add Entry</MenuItem>
                        <MenuItem onTouchTap={this.showDailyReport}>Daily Report</MenuItem>
                        <MenuItem onTouchTap={this.showWeeklyReport}>Weekly Report</MenuItem>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
}
