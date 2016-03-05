import React from 'react';
import AppBar from 'material-ui/lib/app-bar';

class App extends React.Component {
    navMenuClick() {
        console.log('Nav menu button clicked!');
    }

    render() {
        return (
            <AppBar
                title="Captain's Log"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                onLeftIconButtonTouchTap={this.navMenuClick} />
        );
    }
}

export default App;
