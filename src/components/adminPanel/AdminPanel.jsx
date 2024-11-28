import React, {useState, useEffect, useLayoutEffect} from "react";
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

export default function AdminPanel() {
    const [selectView, setSelectView] = useState('orderView');
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    
    const fetchMessages = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/v1/messages/poll/');
        const data = await response.json();
        if (data.length <= messages.length) {
            console.log('Новых сообщений нет');
            setMessages(data);
            return
        }
        else {
            setMessages(data);
            if (data.filter((message) => message.role === 'orders').length > 0) {
                const item = data.filter((message) => message.role === 'orders');
                const lastMessage = item[item.length - 1];
                setNewMessages(item);
                alert(`Новая заявка от ${lastMessage.user.name} ${lastMessage.user.surname}!`);
            }
            else if (data.filter((message) => message.role === 'appeal').length > 0) {
                const item = data.filter((message) => message.role === 'appeal');
                const lastMessage = item[item.length - 1];
                setNewMessages(item);
                alert(`Новое обращение от ${lastMessage.user.name} ${lastMessage.user.surname}!`);
            }
            else if (data.filter((message) => message.role === 'help').length > 0) {
                const item = data.filter((message) => message.role === 'help');
                const lastMessage = item[item.length - 1];
                setNewMessages(item);
                alert(`Новое обращение от ${lastMessage.user.name} ${lastMessage.user.surname}!`);
            }
            return
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [newMessages]);

    function handleViewClick(view) {
        setSelectView(view);
        console.log(view)
    }

    function renderComponent() {
        switch (selectView) {
            case 'orderView':
                return (
                <>
                <Headadmin />
                <Mainbuttons onClick={handleViewClick}/>
                <Orders />
                </>
                )
            case 'manageStockView':
                return (
                <>
                <Headadmin />
                <Mainbuttons onClick={handleViewClick}/>
                <ManageStock />
                </>
                )
            case 'referalKeysView':
                return (
                <>
                <Headadmin />
                <Mainbuttons onClick={handleViewClick}/>
                <Referalkeys />
                </>
                )
            case 'comunicationView':
                return (
                <>
                <Headadmin />
                <Mainbuttons onClick={handleViewClick}/>
                <Comunications />
                </>
                )
            case 'ordersAndMessageView':
                return (
                <>
                <Headadmin />
                <Mainbuttons onClick={handleViewClick}/>
                <OrdersMessage messages={messages}/>
                </>
                )
            case 'reportView':
                return (
                <>
                <Headadmin />
                <Mainbuttons onClick={handleViewClick}/>
                <Reports />
                </>
                )
            default:
                return (
                    <>
                    <Headadmin />
                    <Mainbuttons onClick={handleViewClick}/>
                    </>
                )           
    }}
    
    return ( <>
        {renderComponent()}
        </>
    )
}