import React, { useState, useEffect } from "react";
import axios from 'axios';
import './ordersMessage.css';

export default function OrdersMessage() {
    const [selectView, setSelectView] = useState('order');
    const [history, setHistory] = useState(false);
    const [data, setData] = useState([]);

    const arData = {
        order: [
            {
                message: 'Тестовый текст без информации',
                user: 'Иванов Иван Иванович',
                dt: {
                    date: '12.12.2022',
                    time: '12:12'
                },
                status: true,
            },
            {
                message: 'Тестовый',
                user: 'WOWOWOW',
                dt: {
                    date: '12.12.2022',
                    time: '12:12'
                },
                status: false,
            },
            {
                message: 'Что-то понятное',
                user: 'Такой-то',
                dt: {
                    date: '12.12.2022',
                    time: '12:12'
                },
                status: true,
            },
            {
                message: 'Очень большой текст на свякие штуки для информативности и помощи в стилизации. И текст информации',
                user: 'Ив Ин Ич',
                dt: {
                    date: '12.12.2022',
                    time: '12:12'
                },
                status: true,
            },
            {
                message: 'Писать не буду',
                user: 'Иванов Иван Иванович',
                dt: {
                    date: '12.12.2022',
                    time: '12:12'
                },
                status: true,
            }
        ],
        appeal: [
            {
                message: 'Очень большой текст на свякие штуки для информативности и помощи в стилизации. И текст информации',
                user: 'Ив Ин Ич',
                dt: {
                    date: '12.12.2022',
                    time: '12:12'
                },
                status: true,
            },
            {
                message: 'Писать не буду',
                user: 'Иванов Иван Иванович',
                dt: {
                    date: '12.12.2022',
                    time: '12:12'
                },
                status: true,
            }
        ],
        // help: [
        //     {
        //         message: 'Потерялся в лесу, не хотел... так получилось... ПОМОГИТЕ!!!',
        //         user: 'Ив Ин Ич',
        //         dt: {
        //             date: '12.12.2022',
        //             time: '12:12'
        //         },
        //         status: true,
        //     },
        //     {
        //         message: 'Писать не буду больше, слишком это тяжело',
        //         user: 'Ива Ива Ива',
        //         dt: {
        //             date: '12.12.2022',
        //             time: '12:12'
        //         },
        //         status: true,
        //     }
        // ]
    }

    const handleViewClick = (view) => {
        setSelectView(view);
    }

    const handleHistoryClick = () => {
        setHistory(!history);
    }

    function renderData(mode) {
        const items = arData[mode]; // Получаем данные для текущего режима
    
        if (!items) {
            return (
                <div className="noData">Данные отсутствуют...</div>
            )
        }
    
        return items.map((item, index) => (
            <div className="row" key={index}>
                <div className="message">{item.message}</div>
                <div className="user">{item.user}</div>
                <div className="dt">{item.dt.time} || {item.dt.date}</div>
                <button className="closeNote">Закр. заявку</button>
            </div>
        ));
    }

    function renderHistory(mode) {
        const items = arData[mode]; // Получаем данные для текущего режима
    
        if (!items) {
            return (
                <div className="noData">Данные отсутствуют...</div>
            )
        }
    
        return items.map((item, index) => (
            <div className="rowHistory" key={index} style={{color: '#909090'}}>
                <div className="message">{item.message}</div>
                <div className="user">{item.user}</div>
                <div className="dt">{item.dt.time} || {item.dt.date}</div>
            </div>
        ));
    }

    return (
        <div className="ordersMessage">
            <div className="actionOrdersMessage">
                <div className="views">
                    <span id="orderMess" className="viewBtn" onClick={() => {handleViewClick('order')}} style={{backgroundColor: selectView === 'order' ? '#506365' : '#7A9E9F'}}>Заявки</span>
                    <span id="appealMess" className="viewBtn" onClick={() => {handleViewClick('appeal')}} style={{backgroundColor: selectView === 'appeal' ? '#506365' : '#7A9E9F'}}>Обращения</span>
                    <span id="helpMess" className="viewBtn" onClick={() => {handleViewClick('help')}} style={{backgroundColor: selectView === 'help' ? '#506365' : '#7A9E9F'}}>Помощь на дороге</span>
                </div>
                <input type="text" className="searchOrdersMessage" placeholder="Поиск по имени"/>
            </div>
            <div className="tableContainer">
                {renderData(selectView)}
            </div>
            <button className="historyTableBtn" onClick={() => {handleHistoryClick()}} style={{backgroundColor: history ? '#506365' : '#7A9E9F',  borderRadius: history ? '20px 20px 0 0' : '20px'}}>История заявок</button>
            <div className="historyTable" style={{display: history ? 'flex' : 'none'}}>
                {renderHistory(selectView)}
            </div>
        </div>
    )
}