import React from 'react';
import { Route } from 'react-router-dom';

import Layout from './../container/layout/layout';

const Layouts = ({location}) => {
    return <Layout location={location}/>
}

const routes = (
    <Route>
        <Route path="/" component={Layouts}>
            <Route path="home" component={Homes}></Route>
            <Route path="allContent" component={AllContents}></Route>
            <Route path="my" component={Mys}></Route>
        </Route>
    </Route>
)

export default routes;
