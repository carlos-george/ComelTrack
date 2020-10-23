import React, { FormEvent, useState, ChangeEvent } from 'react';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi'
import { useHistory } from 'react-router-dom';

import './styles.css';

function Login() {

    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const history = useHistory();

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target;

        setFormData({
            ...formData, [name]: value,
        });

    }

    function handleMakeLogin(event: FormEvent) {
        event.preventDefault();
        localStorage.setItem('token', 'teste');
        history.push('checkin');
    }

    function handleGoBack() {
        history.push('/');
    }

    return (
        <div id="login-container">
            <div className="login-header">
                <button onClick={handleGoBack}>
                    <FiArrowLeft size={20} />
                    <strong>Home</strong>
                </button>
            </div>
            <div className="login-main-container">
                <fieldset>
                    <legend>Fazer login</legend>
                    <form onSubmit={(event) => handleMakeLogin(event)}>
                        <div className="field">
                            <label htmlFor="login">Login</label>
                            <input type="text"
                                name="login"
                                id="login"
                                autoComplete="off"
                                value={formData.login}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="password">Senha</label>
                            <input type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                autoComplete="off"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            {showPassword
                                ? <FiEyeOff size={18} onClick={() => { setShowPassword(!showPassword) }} />
                                : <FiEye size={18} onClick={() => { setShowPassword(!showPassword) }} />
                            }
                        </div>
                        <button type="submit">
                            Entrar
                        </button>
                    </form>
                </fieldset>
            </div>
        </div>
    );
}

export default Login;