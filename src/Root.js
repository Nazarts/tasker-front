import React, {useEffect, useState} from "react";
import { Link, Outlet } from "react-router-dom";
import './styles/Root.css';
import { isLoggedIn } from "./helpers";
import { getCookie } from "./helpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Logout } from "./components/Logout";
import { faHouseUser, faCartShopping, faMoneyBillTrendUp, faMagnifyingGlass, faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons'


function UserIcon(props) {
    return (
        <div className="user-box">
            <div className="ico-wrapper">
                <span className="fa-user-wrapper"><FontAwesomeIcon icon={faUser}/></span>
            </div>
            <h2 className="user-name">
                {props.ser !== null? props.user: 'Anonym'}
            </h2>
        </div>
    );
}

export function Root () {
    let [user, setUser] = useState(null);

    const refreshUser = () => {
        let user = getCookie('user');
        setUser(user);
    }

    // useEffect(() => {
    //     // incr(count + 1);
    //     console.log('count');
    // });
    return (
        <>
            <div className="header">
                <Logout />
            </div>
            <div className="main-wrapper">
                <div className="nav-wrapper">
                    <UserIcon />
                    <ul className="link-wrapper">
                        <li className="nav-link">
                            <Link to={'login'}>
                                <span className="nav-link-ico">
                                    <FontAwesomeIcon icon={faRightToBracket}/> <span className="navText">Login</span>
                                </span>
                                </Link>
                        </li>
                        <li className="nav-link">
                            <Link to={'/'}>
                                <FontAwesomeIcon icon={faHouseUser}/> <span className="navText">Home</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to={'tasks/1'}>
                                <FontAwesomeIcon icon={faCartShopping}/> <span className="navText">Spend Tab</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to={'tasks/2'}>
                                <FontAwesomeIcon icon={faMoneyBillTrendUp}/> <span className="navText">Income Tab</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to={'stats'}>
                                <FontAwesomeIcon icon={faMagnifyingGlass}/> <span className="navText">Stats</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="content">
                    {/* <Logo/> */}
                    <Outlet />
                </div>
            </div>
        </>
    )
}