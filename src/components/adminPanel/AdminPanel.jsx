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
    const apiUrl = process.env.REACT_APP_URL_API;

    useEffect(() => {
        const audio = new Audio(process.env.PUBLIC_URL + '/audio/new_message.WAV');
        const fetchOrders = async () => {
            const response = await fetch(`${apiUrl}/check_reg/`);
            const data = await response.json();
            // setOrders(data);
            setAllUsers(data);
            if (data.length <= orders.length) {
                console.log('Новых заявок на регистрацию нет');
                return;
            } else {
                if ((data.length - orders.length) === 1) {
                    console.log('Новая заявка на регистрацию');
                    const lastMessage = data[data.length - 1];
                    setOrders(data);
                    const params = {
                        direction: ['taxi'], // Направления регистрации
                        search: lastMessage.phone,     // Поиск по ФИО и телефону
                        status: ['draft', 'not_filled', 'not_processed', 'exchange_error', 'filled'],  // Статусы заявок
                        page: 1,                            // Текущая страница
                        per_page: '20',                     // Количество элементов на странице
                        order: '-date'                      // Сортировка по дате создания (по убыванию)
                      };
                    
                    const headers = {
                        'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1' // заголовок с клиентским ключом
                      };
        
                    const response_jump = await axios.get(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications`, {params, headers});
                    console.log(response_jump.data)
                    if (response_jump.data.items.length=== 1) {
                        setNewOrders(lastMessage);
                        setNotificationSent({orders: false});
                        toast('Новая заявка на регистрацию!');
                        audio.play();
                        console.log(response);
                    }
                } else {
                    setOrders(data);
                    return
                }
        }
        };

        const fetchMessages = async () => {
            console.log('fetchMessages');
            const response = await fetch(`${apiUrl}/messages/poll/`);
            const data = await response.json();
            if (data.length <= messages.length) {
                setMessages(data);
                return
            }
            else {
                setMessages(data);
                if (data.filter((message) => message.role === 'orders').length > 0) {
                    const item = data.filter((message) => message.role === 'orders');
                    setNewMessages(item);
                    setNotificationSent({messages: false});
                    toast('Новая заявка!');
                    audio.play();
                }
                else if (data.filter((message) => message.role === 'appeal').length > 0) {
                    const item = data.filter((message) => message.role === 'appeal');
                    setNewMessages(item);
                    setNotificationSent({messages: false});
                    toast('Новое обращение!');
                    audio.play();
                }
                else if (data.filter((message) => message.role === 'help').length > 0) {
                    const item = data.filter((message) => message.role === 'help');
                    setNewMessages(item);
                    setNotificationSent({messages: false});
                    toast('Нужна помощь!');
                    audio.play();
                }
                return
            }
        };

        let fetchOrdersInterval;

        const fetchMessagesInterval = setInterval(() => {
            fetchMessages();
        }, 5000);
    
        const fetchOrdersTimeout = setTimeout(() => {
            fetchOrders();
            fetchOrdersInterval = setInterval(fetchOrders, 5000);
        }, 1000);
    
        return () => {
            clearInterval(fetchMessagesInterval);
            clearTimeout(fetchOrdersTimeout);
            clearInterval(fetchOrdersInterval);
        };
    }, [newMessages, newOrders]);

    useEffect(() => {
        if (newOrders && !notificationSent.orders) {;
            setNotificationSent((prev) => ({...prev, orders: true}));
        } else {
            return;
        }
    }, [newOrders, notificationSent]);

    useEffect(() => {
        if (newMessages && !notificationSent.messages) {
            setNotificationSent((prev) => ({...prev, messages: true}));
        } else {
            return;
        }
    }, [newMessages,notificationSent]);

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