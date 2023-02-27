import axios from "axios";
import React, {useEffect} from "react";
import {isLoggedIn, getCookie} from '../helpers';
import { useNavigate} from 'react-router-dom';

export function HomePage() {
    let navigate = useNavigate();
    let user = getCookie('user');
    // if user is not logged in redirect to login Page
    useEffect(() => {
        if (user === null) {
            navigate('/login');
        }
    });
    return (
        <div>
            This is home page  {user}
        </div>
    )
    
}