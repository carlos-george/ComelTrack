import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';


import './styles.css';
import delivery from '../../assets/delivery.png';
import logo from '../../assets/logoWeb.png';


const Home = () => {

    return (
        <div id="container-home">
            <div className="detail-home">
                <img src={logo} alt="Comel Tracker" className="home-logo" />
                <h1>
                    Aqui tratamos sua mercadaria da melhor forma.
                </h1>
                <div className="home-buttons">
                    <Link to="login">
                        Entrar
                        <FiLogIn size={40} />
                    </Link>
                </div>
            </div>
            <img src={delivery} alt="Comel Tracker" />
        </div>
    );
}

export default Home;