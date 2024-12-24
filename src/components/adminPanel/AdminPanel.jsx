import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import Headadmin from '../headadmin/Headadmin.jsx';
import Mainbuttons from '../mainbuttons/Mainbuttons.jsx';
import ManageStock from '../manageStock/ManageStock.jsx';
import Referalkeys from '../referalkeys/Referalkeys.jsx';
import Orders from '../orders/Orders.jsx';
import Comunications from '../comunications/Comunications.jsx';
import OrdersMessage from '../ordersMessage/OrdersMessage.jsx';
import Reports from "../reports/Reports.jsx";
import './adminPanel.css'

export default function AdminPanel( {logOut, username} ) {
    const [selectView, setSelectView] = useState('orderView');
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newOrders, setNewOrders] = useState([]);
    const [notificationSent, setNotificationSent] = useState({orders: false, messages: false});
    const [allUsers, setAllUsers] = useState([]);
    const [lastChecked, setLastChecked] = useState(null);
    const apiUrl = process.env.REACT_APP_URL_API;

    useEffect(() => {
        const audio = new Audio(process.env.PUBLIC_URL + '/audio/new_message.WAV');

        // Функция для получения новых заявок
        const fetchOrders = async () => {
            console.log('OP')
            const params = lastChecked ? { last_checked: lastChecked } : {};
            const response = await fetch(`${apiUrl}/check_reg/`, { method: 'GET', headers: params });
            const data = await response.json();
            setAllUsers(data);
            console.log(data.length, orders.length)
            if (data.length > orders.length) {
                console.log('Новая заявка на регистрацию');
                const lastMessage = data[data.length - 1];
                setOrders(data);
                if (lastMessage.role_name === 'partner') {
                    setNewOrders(lastMessage);
                    setNotificationSent((prev) => ({ ...prev, orders: false }));
                    toast('Новая заявка на регистрацию от партнёра!');
                    audio.play();
                } else if (lastMessage.role_name === 'driver') {
                const params = {
                    direction: ['taxi'],
                    search: lastMessage.phone,
                    status: ['draft', 'not_filled', 'not_processed', 'exchange_error', 'filled'],
                    page: 1,
                    per_page: '20',
                    order: '-date'
                };
                const headers = { 'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1' };
                const response_jump = await axios.get(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications`, {params, headers});
                
                if (response_jump.data.items.length === 1) {
                    setNewOrders(lastMessage);
                    setNotificationSent((prev) => ({...prev, orders: false}));
                    toast('Новая заявка на регистрацию от водителя!');
                    audio.play();
                }
                } 
            }

            // Обновляем метку времени последнего запроса
            setLastChecked(new Date().toISOString());
        };

        // Функция для получения новых сообщений
        const fetchMessages = async () => {
            const params = lastChecked ? { last_checked: lastChecked } : {}; // Если есть lastChecked, передаем его
            const response = await fetch(`${apiUrl}/messages/poll/`, { method: 'GET', headers: params });
            const data = await response.json();
            setMessages(data);

            // Уведомление при появлении новых сообщений
            if (data.length > messages.length) {
                const newOrderMessages = data.filter((message) => message.role === 'orders');
                const newAppealMessages = data.filter((message) => message.role === 'appeal');
                const newHelpMessages = data.filter((message) => message.role === 'help');

                if (newOrderMessages.length > 0) {
                    setNewMessages(newOrderMessages);
                    setNotificationSent((prev) => ({...prev, messages: false}));
                    toast('Новая заявка!');
                    audio.play();
                } else if (newAppealMessages.length > 0) {
                    setNewMessages(newAppealMessages);
                    setNotificationSent((prev) => ({...prev, messages: false}));
                    toast('Новое обращение!');
                    audio.play();
                } else if (newHelpMessages.length > 0) {
                    setNewMessages(newHelpMessages);
                    setNotificationSent((prev) => ({...prev, messages: false}));
                    toast('Нужна помощь!');
                    audio.play();
                }
            }

            // Обновляем метку времени последнего запроса
            setLastChecked(new Date().toISOString());
        };

        // Устанавливаем интервалы для периодического получения данных
        const fetchMessagesInterval = setInterval(fetchMessages, 5000);
        const fetchOrdersInterval = setInterval(fetchOrders, 5000);

        // Чистим интервалы при размонтировании компонента
        return () => {
            clearInterval(fetchMessagesInterval);
            clearInterval(fetchOrdersInterval);
        };
    }, [orders, messages, lastChecked]);

    function handleViewClick(view) {
        setSelectView(view);
        console.log(view)
    }

    function renderComponent() {
        switch (selectView) {
            case 'orderView':
                return (
                <>
                <Headadmin logOut={logOut} username={username}/>
                <Mainbuttons onClick={handleViewClick}/>
                <Orders orders={allUsers}/>
                <ToastContainer hideProgressBar={true}/>
                </>
                )
            case 'manageStockView':
                return (
                <>
                <Headadmin logOut={logOut} username={username}/>
                <Mainbuttons onClick={handleViewClick}/>
                <ManageStock />
                <ToastContainer hideProgressBar={true}/>
                </>
                )
            case 'referalKeysView':
                return (
                <>
                <Headadmin logOut={logOut} username={username}/>
                <Mainbuttons onClick={handleViewClick}/>
                <Referalkeys />
                <ToastContainer hideProgressBar={true}/>
                </>
                )
            case 'comunicationView':
                return (
                <>
                <Headadmin logOut={logOut} username={username}/>
                <Mainbuttons onClick={handleViewClick}/>
                <Comunications />
                <ToastContainer hideProgressBar={true}/>
                </>
                )
            case 'ordersAndMessageView':
                return (
                <>
                <Headadmin logOut={logOut} username={username}/>
                <Mainbuttons onClick={handleViewClick}/>
                <OrdersMessage messages={messages}/>
                <ToastContainer hideProgressBar={true}/>
                </>
                )
            case 'reportView':
                return (
                <>
                <Headadmin logOut={logOut} username={username}/>
                <Mainbuttons onClick={handleViewClick}/>
                <Reports />
                <ToastContainer hideProgressBar={true}/>
                </>
                )
            default:
                return (
                    <>
                    <Headadmin logOut={logOut} username={username}/>
                    <Mainbuttons onClick={handleViewClick}/>
                    <ToastContainer hideProgressBar={true}/>
                    </>
                )           
    }}
    
    return ( <>
        {renderComponent()}
        </>
    )
}