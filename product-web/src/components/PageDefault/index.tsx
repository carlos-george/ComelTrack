import React, { FunctionComponent } from 'react';

import './styles.css';
import Header from '../Header';
import Footer from '../Footer';

const PageDefault: FunctionComponent = ({ children }) => {

    return (
        <>
            <Header/>
                <main>
                    {children}
                </main>
            <Footer/>
        </>
    );
}

export default PageDefault;