import React from "react";
import './mainbuttons.css'

export default function Mainbuttons({ onClick }) {

    

    return (
        <div className="navMenu">
            <button className="navMenuBtn" id="orderView" onClick={() => onClick('orderView')}>Заявки</button>
            <button className="navMenuBtn" id="manageStockView" onClick={() => onClick('manageStockView')}>Управление акциями</button>
            <button className="navMenuBtn" id="referalKeysView" onClick={() => onClick('referalKeysView')}>Реферальные ключи</button>
            <button className="navMenuBtn" id="comunicationView" onClick={() => onClick('comunicationView')}>Комуникации</button>
            <button className="navMenuBtn" id="ordersAndMessageView" onClick={() => onClick('ordersAndMessageView')}>Заявки и обращения</button>
            <button className="navMenuBtn" id="reportView" onClick={() => onClick('reportView')}>Отчёт</button>
        </div>
    )
}