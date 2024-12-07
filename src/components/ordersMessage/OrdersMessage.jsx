import React, { useState, useEffect } from "react";
import axios from 'axios';
import './ordersMessage.css';

export default function OrdersMessage({ messages }) {
    const [selectView, setSelectView] = useState('order');
    const [message, setMessage] = useState(messages);
    const [history, setHistory] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [selectMess, setSelectMess] = useState(messages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);

    const arData = {
        order: [
            message.filter((item) => item.role === 'orders'),
        ],
        appeal: [
            message.filter((item) => item.role === 'appeal'),
        ],
        help: [
            message.filter((item) => item.role === 'help'),
        ]
    }

    const fetchMessages = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/v1/messages/poll/');
        setMessage(await response.json());
    }

    const fetchHistory = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/v1/all_history/');
        const data = await response.json();
        setHistoryData(data);
    }

    const handleViewClick = (view) => {
        setSelectView(view);
    }

    const handleHistoryClick = () => {
        fetchHistory();
        setHistory(!history);
    }

    const handleCloseMessage = async (id) => {
        const response = await axios.patch(`http://127.0.0.1:8000/api/v1/all_history/${id}/`);
        const data = response;
        fetchHistory();
        fetchMessages();
        setIsModalOpen(false);
        console.log(data);
    }

    const handleOpenMessage = (id) => {
        const item = message.filter((item) => item.id === id);
        setSelectMess(item[0]);
        setIsModalOpen(true);
        console.log(selectMess);
    }

    const handleOpenMessageHistory = (id) => {
        const item = historyData.filter((item) => item.id === id);
        setSelectMess(item[0]);
        setIsModalOpenHistory(true);
        console.log(selectMess);
    }

    const handleCloseModalHistory = () => {
        setIsModalOpenHistory(false);
    }


    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    function renderData(mode) {
        const items = arData[mode];
        if (!items) {
            return (
                <div className="noData">Данные отсутствуют...</div>
            )
        }
    
        return items[0].map((item, index) => (
            <div className="row" key={index} onClick={() => {handleOpenMessage(item.id)}}>
                <div className="message">{item.message}</div>
                <div className="user">{item.user.surname}  {item.user.name}</div>
                <div className="dt">{item.formatted_dt}</div>
                <button className="closeNote" onClick={() => {handleCloseMessage(item.id)}}>Закр. заявку</button>
            </div>
        ));
    }

    function renderHistory(mode) {
        const items = arData[mode];
    
        if (!items) {
            return (
                <div className="noData">Данные отсутствуют...</div>
            )
        }
    
        return historyData.map((item, index) => (
            <div className="rowHistory" key={index} style={{color: '#909090'}} onClick={() => {handleOpenMessageHistory(item.id)}}>
                <div className="message">{item.message}</div>
                <div className="user"></div>
                <div className="dt">{item.formatted_dt}</div>
            </div>
        ));
    }

    function renderModal(isModalOpen) {
        if (isModalOpen) {
            return (
                <div className="modalUser">
                    <span className="modalHead">
                        <span className="modalRelated">{selectMess.user.address}</span>
                        <span className="modalDate">{selectMess.formatted_dt}</span>
                        <span className="modalAction">
                            <button className="modalCloseBtn" onClick={() => {handleCloseModal()}}>Вернуться</button>
                            <button className="modalCloseMessBtn" onClick={() => {handleCloseMessage(selectMess.id)}}>Закр. заявку</button>
                        </span>
                    </span>
                    <div className="modalContentM">{selectMess.message}</div>
                </div>
            )
        }
    }

    function renderHistoryModal(isModalOpenHistory) {
        if (isModalOpenHistory) {
            return (
                <div className="modalUser">
                    <span className="modalHead">
                        <span className="modalRelated">{selectMess.user.address}</span>
                        <span className="modalDate">{selectMess.formatted_dt}</span>
                        <span className="modalAction">
                            <button className="modalCloseBtn" onClick={() => {handleCloseModalHistory()}}>Вернуться</button>
                        </span>
                    </span>
                    <div className="modalContent">{selectMess.message}</div>
                </div>
            )
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [selectMess, messages]);

    return (
        <div className="ordersMessage">
            {renderModal(isModalOpen)}
            {renderHistoryModal(isModalOpenHistory)}
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