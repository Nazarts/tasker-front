import axios from "axios";
import React from "react";
import '../styles/LoginPage.css';
import { useNavigate } from "react-router-dom";
import "axios";


class LoginController extends React.Component {

    render(){
        return (            
            <div className="form-wrapper">
                <h1 className="form-header">Sign In</h1>
                <div className="field-wrapper">
                    <input type="text" name="name" id="name-inp" />
                </div>
                <div className="field-wrapper">
                    <input type="email" name="email" id="email-inp" />
                </div>
                <div className="field-wrapper">
                    <input type="password" name="password" id="password-inp" />
                </div>
                <div className="field-wrapper">
                    <button onClick={this.props.login}>Login</button>
                </div>
            </div>
        );
    }
}

async function getUser(){
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000';
    let newData = await axios.get('api/user').then(response => {
        return response.data
    }).catch(error => {console.log(error)});
    return newData;
}

export function LoginPage() {
    const navigate = useNavigate();

    const handleSubmit = event => {
        let data = {
            password: document.getElementById('password-inp').value,
            email: document.getElementById('email-inp').value
        };
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = 'http://localhost:8000';
        const response = axios.get('sanctum/csrf-cookie')
        .then(
            async response => {
                try {
                    const response_1 = await axios.post('login', data);
                    sessionStorage.setItem('isLoggedIn', true);
                    // Get user and set user name to cookies
                    const user = await getUser();
                    document.cookie = 'user=' + user.name + ';max-age=7200; Path=/;';
                    // Navigate to home page
                    navigate('/home');
                } catch (error) {
                    alert(error.response.data['message']);
                }

            }
        )
    };

    return (
        <LoginController login={handleSubmit}/>
    )


}