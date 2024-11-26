import React, { useState, useEffect } from "react";
import axios from 'axios';
import './orders.css';

export default function Orders () {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedView, setSelectedView] = useState(1);

    const token = '4cf38a3d-abd3-4007-8e02-6cdc93c329a1';


    const fetchOrders = async () => {
        try {
            const params = {
                direction: ['taxi'], // Направления регистрации
                search: 'Иванов Иван Иванович',     // Поиск по ФИО и телефону
                status: ['draft', 'not_filled'],    // Статусы заявок
                page: 1,                            // Текущая страница
                per_page: '20',                     // Количество элементов на странице
                order: '-date'                      // Сортировка по дате создания (по убыванию)
              };
            
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1' // заголовок с клиентским ключом
              };

            const response = await axios.get(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications`, {params, headers});
            console.log(response.data);
        } catch (err) {
            setError(err);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClickView = (view) => {
        setSelectedView(view)
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="orders">
            <div className="modalOrder">
                
            </div>
            <div className="viewOrders">
                <button className="viewBtnOrders" onClick={() => handleClickView(1)} style={{backgroundColor: selectedView === 1 ? '#506365' : '#7A9E9F'}}>Регистрация водителей</button>
                <button className="viewBtnOrders" onClick={() => handleClickView(2)} style={{backgroundColor: selectedView === 2 ? '#506365' : '#7A9E9F'}}>Регистрация партнёров</button>
            </div>
            <div className="tableContainer">
                <table className="tableOrder">
                    <thead>
                        <tr className="rowTitle">
                            <th className="titleFullName">ФИО</th>
                            <th>Telegram</th>
                            <th>Номер</th>
                            <th>Дата</th>
                            <th className="titleUrlJump">Jump</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="rowData">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>16.11.2024</td>
                            <td className="urlJump">htts://jump.taxi.orders/id=3212343522</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="historyOrders">

            </div>
        </div>
    )
}