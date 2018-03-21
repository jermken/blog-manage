import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import './layout.scss';
import { Home, Login } from './../index.js';

class App extends Component {

    componentDidMount() {
        
    }

    render() {
        return <div>
            <div className="main">
                <Route exact path="/" render={() => <Redirect to="/home" />} />
                <Route path="/home" component={Home}></Route>
                <Route path="/login" component={Login}></Route>
            </div>
        </div>
    }
}

export default App;