import React, { useState, useRef, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './reports.css';

export default function Reports() {
    const [users, setUsers] = useState([]);
    const [searchParams, setSearchParams] = useState({
        isNotTinkoff: false,
        isWin: false,
        isNotActive: false,
        phone: '',
        name: '',
        surname: '',
        patronymic: '',
    });
    const apiUrl = process.env.REACT_APP_URL_API;


    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${apiUrl}/get_users/`);
            setUsers(await response.data);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleSearch = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="reports">
            <div className="actionReports">
                <button className="usersBtn">Пользователи</button>
                <span className="labelCheckBox" id="activeUsers">Неактивные пользователи</span>
                <input type="checkbox" className="reportsCheckBox"/>
                <span className="labelCheckBox">Не тинькофф</span>
                <input type="checkbox" className="reportsCheckBox"/>
                <span className="labelCheckBox">Победители акции</span>
                <input type="checkbox" className="reportsCheckBox"/>
                <input type="text" className="searchInput" placeholder="Поиск"/>
           </div>
           <div className="tableContainer">
                <table className="tableReports">
                    <thead>
                        <tr className="rowTitleReports">
                            <th className="titleFullName">ФИО</th>
                            <th>Telegram</th>
                            <th>Номер</th>
                            <th>Название акции</th>
                            <th>Дата победы в акции</th>
                            <th>Сумма выигрыша</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr className="rowDataReports">
                                <td className="fullName">{user.surname} {user.name} {user.patronymic}</td>
                                <td onClick={() => window.open(`https://t.me/${user.chat_id}`, '_blank')} className="linkUser">https://t.me/@{user.chat_id}</td>
                                <td>{user.phone}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
           <button className="btnDownloadDocs">Скачать документ</button>
        </div>
    )
}