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
                <OrdersMessage />
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