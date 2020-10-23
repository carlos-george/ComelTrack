import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

import './styles.css';

import logo from '../../assets/logoWeb.png';
import logoIcon from '../../assets/iconMobile.png';

const Header = () => {

    const history = useHistory();
    const [isUserLogged, setIsuserLogged] = useState(false);

    useEffect(() => {

        validateUserLogged();
    }, []);

    function validateUserLogged() {
        const token = localStorage.getItem('token');

        if (token) {
            setIsuserLogged(true);
        } else {
            setIsuserLogged(false);
        }
    };

    function handleLoginOrLogout() {
        if (!isUserLogged) {
            history.push('login');
        } else {
            localStorage.clear();
            history.push('/');
        }
    };

    return (
        <div id="main-header">
            <header>
                <div className="header-top">
                    <div className="logo-web">
                        <img src={logo} alt="ComelTrack" />
                    </div>
                    <div className="logo-mobile">
                        <img src={logoIcon} alt="ComelTrack" />
                    </div>
                    <button onClick={handleLoginOrLogout}>
                        <strong className="login-mobile">
                            {isUserLogged ? 'Sair' : 'Login'}
                        </strong>
                        {isUserLogged ? <FiLogOut size={25} /> : <FiLogIn size={25} />}
                    </button>
                </div>
                <div className="header-menus">
                    <Link to={"/checkin"}>Entrada</Link>
                    <Link to={"/checkout"}>Saída</Link>
                </div>
            </header>
        </div>
    );
}

export default Header;

