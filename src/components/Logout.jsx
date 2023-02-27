import React from "react";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteCookie } from "../helpers";
import { Form } from "react-router-dom";
import axios from "axios";


export async function logoutAction(){
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000';
    // const response = await axios.get('sanctum/csrf-cookie');
    let newData = await axios.post('logout').catch(error => {console.log(error)});
    deleteCookie('user');
    console.log(';action did');
    return newData;
}

export function Logout() {
    return (
        <Form className="logout-wrapper" method="post" action="/">
            <button type="submit">
                <span id="logout-span">
                    <FontAwesomeIcon icon={faPowerOff} />
                </span>
            </button>
        </Form>
    )
}