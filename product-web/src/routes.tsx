import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Product from './pages/Product';
import Checkin from './pages/Checkin';
import Checkout from './pages/Checkout';
import Login from './pages/Login';

const Routes = () => {
    return (
        <BrowserRouter>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
            />
            <Switch>
                <Route component={Home} path="/" exact />
                <Route component={Login} path="/login" />
                <Route component={Checkin} path="/checkin" />
                <Route component={Checkout} path="/checkout" />
                <Route component={Product} path="/products/:id" />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;