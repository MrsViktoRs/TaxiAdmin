import React from "react";
import './authorization.css'

export default function Authorization({ logIn }) {


    return (
            <form className="form">
                <div className="form_group_login">
                    <label className="form_label_login">Логин</label>
                    <input className="form_input_login" type="text"></input>
                </div>
                <div className="form_group_pass">
                    <label className="form_label_pass">Пароль</label>
                    <input className="form_input_pass" type="password"></input >
                </div>
                <div>
                    <button className="form_button" onClick={() => {logIn()}}>Войти</button>
                </div>
            </form>
    )
}
