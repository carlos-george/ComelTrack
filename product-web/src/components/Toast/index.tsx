import React from 'react';
import { FiInfo } from 'react-icons/fi';

import './styles.css';

interface Props {
    msg: string;
    icon: string;
}

const Toast : React.FC<Props> = ({ msg, icon }) => {

    const handleIcon = () => {
        if(icon === 'info') {
            return <FiInfo/>;
        }
        if(icon === 'erro') {
            return <FiInfo/>;
        }
    }

    return (
        <div id="container-toast">
            {() => handleIcon()}
            <div className="toast-msg">
                <h4>{msg}</h4>
            </div>
        </div>
    );
}

export default Toast;