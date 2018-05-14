import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import App from './container/layout/layout.jsx';
import 'antd/dist/antd.css';

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
, document.getElementById('root'));

// registerServiceWorker();
