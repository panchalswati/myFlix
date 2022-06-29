import React from 'react';
import { createRoot } from 'react-dom/client';
import { MainView } from './components/main-view/main-view';
import './index.scss';

class MyFlixApplication extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <MainView />
        );
    }
}

const container = document.getElementsByClassName('app-container')[0];
const root = createRoot(container);
root.render(React.createElement(MyFlixApplication));