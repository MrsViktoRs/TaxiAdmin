import React, { useState, useEffect } from "react";
import './authorization.css'
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

export default function Authorization({ logIn, regData, setRegData }) {
    const [error, setError] = useState(null);
    const [isRegister, setIsRegister] = useState(false);
    const apiUrl = process.env.REACT_APP_URL_API;

    const handleClickRegister = () => {
        if (isRegister) {
            setIsRegister(false);
        } else {
            setIsRegister(true);
        }
    }

    const handleChange = (e) => {
        setRegData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleClickValidate = async () => {
        const inviteReg = process.env.REACT_APP_INVITE_REG;
        if (regData.invite === inviteReg) {
            setIsRegister(false);
            try {
                const response = await axios.post(`${apiUrl}/create_user/`, regData);
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 400:
                            toast.error('Неверный логин или пароль');
                            break;
                        case 409:
                            toast.error('Пользователь с таким логином уже существует');
                            break;
                        default:
                            toast.error('Произошла ошибка');
                            break;
                    }
                } else {
                    toast.error('Произошла ошибка');
                }
            } finally {
                setError(null);
                setRegData({
                    ...regData,
                    invite: '',
                });
            }
        } else {
            toast.error('Неверный код приглашения');
        }
    }

    useEffect(() => {
        console.log(error);
        if (error) {
            switch (error.response.status) {
                case 400:
                    toast.error('Неверный логин или пароль');
                    setError(null);
                    break;
                case 409:
                    setError(null);
                    toast.error('Пользователь с таким логином уже существует');
                    break;
            }
        }
    }, [error]);

    const renderRegister = () => {
        if (isRegister) {
            return (
                <>
                    <div className="form_group_login">
                        <label className="form_label_login">Логин</label>
                        <input className="form_input_login" type="text" name="username" onChange={handleChange} value={regData.username || ''}></input>
                    </div>
                    <div className="form_group_pass">
                        <label className="form_label_pass">Пароль</label>
                        <input className="form_input_pass" type="password" name="password" onChange={handleChange} value={regData.password || ''}></input>
                    </div>
                    <div className="form_group_invite">
                        <label className="form_label_invite">Код приглашения</label>
                        <input type="text"  className="form_input_invite" name="invite" onChange={handleChange} value={regData.invite || ''}/>
                    </div>
                    <div>
                        <button className="form_button_reg" onClick={handleClickValidate}>Зарегистрироваться</button>
                    </div>
                    <div>
                        <button className="register_button_log" onClick={() => {handleClickRegister()}}>Войти</button>
                    </div>
                </>
        )
        } else {
            return (
                <>
                    <div className="form_group_login">
                        <label className="form_label_login">Логин</label>
                        <input className="form_input_login" type="text" name="username" onChange={handleChange} value={regData.username || ''}></input>
                    </div>
                    <div className="form_group_pass">
                        <label className="form_label_pass">Пароль</label>
                        <input className="form_input_pass" type="password" name="password" onChange={handleChange} value={regData.password || ''}></input >
                    </div>
                    <div>
                        <button className="form_button" onClick={() => {logIn()}}>Войти</button>
                    </div>
                    <div>
                        <button className="register_button" onClick={() => {handleClickRegister()}}>Регистрация</button>
                    </div>
                </>
        )
        }
    }

    return (
        <div className="form">
            <ToastContainer />
            {renderRegister()}
        </div>
    )
}
