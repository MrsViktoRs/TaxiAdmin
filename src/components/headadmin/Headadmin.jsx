import React from "react";
import './headadmin.css';

export default function Headadmin({ logOut, username }) {

    return (
        <div className="header_main">
            <span className="welcome">Добро пожаловать</span>
            <span className="usernameAdmin">{username}</span>
            <button className="logInBtn" onClick={logOut}>выход</button>
        </div>
    )
}