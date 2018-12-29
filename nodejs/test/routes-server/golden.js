import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import './index.scss';
import Routes from './routes.js';
ReactDOM.render(<HashRouter><Routes/></HashRouter>,document.getElementById('foo'));