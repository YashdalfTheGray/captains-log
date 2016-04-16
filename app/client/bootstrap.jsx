import ReactDOM from 'react-dom';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './app';

injectTapEventPlugin();

ReactDOM.render(
    <App />,
    document.getElementById('react-container')
);
