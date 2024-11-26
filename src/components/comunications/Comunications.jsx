import React, { useState, useRef, useEffect } from "react";
import './comunications.css';

export default function Comunications() {
    const [activeMessage, setActiveMessage] = useState(false);
    const [selectedWhom, setSelectedWhom] = useState('всем')
    const [whomStatus, setWhomStatus] = useState(false);

    const handleActiveMess = () => {
        if (activeMessage) {setActiveMessage(false)}
        else {setActiveMessage(true)}
    }

    const handleWhomStatus = () => {
        if (whomStatus) {setWhomStatus(false)}
        else {setWhomStatus(true)}
    }

    const handleSelectWhom = (select) => {
        setSelectedWhom(select);
        setWhomStatus(false);
    }



    return (
        <div className="comunications">
            <div className="modalWhom" style={{ display: whomStatus ? 'flex' : 'none' }}>
                <span className="all" onClick={() => {handleSelectWhom('всем')}}>Всем <span className="ar"></span></span>
                <span className="drivers" onClick={() => {handleSelectWhom('водителям')}}>Водителям <span className="ar"></span></span>
                <span className="partners" onClick={() => {handleSelectWhom('партнёрам')}}>Партнёрам <span className="ar"></span></span>
            </div>
            <div className="actionCom">
                <span className="viewName">Введите сообщение</span>
                <span className="filter" id="selectedWhom">Видно {selectedWhom}</span><span className="arrowWhom" onClick={handleWhomStatus} style={{transform: whomStatus ? 'rotate(-48deg)' : 'rotate(41deg)'}}></span>
                <span className="filter" id="selectedDate">15.11.2024</span><span className="arrowWhom"></span>
            </div>
            <div className="messageCom">
                <textarea className="textMessage" placeholder="Введите сообщение"></textarea>
            </div>
            <button className="activeBtn" onClick={handleActiveMess} style={{background: activeMessage ? '#506365' : '#7A9E9F'}}>Активыне cообщения</button>
            <button className="sendMessage">Отправить</button>
            <div className="activeMessages" style={{ display: activeMessage ? 'block' : 'none'}}>
                <span className="activeData">
                    <table className="tableCom">
                        <thead>
                            <tr className="rowTitleActive">
                                <th>Дата</th>
                                <th>Кому видно</th>
                                <th>Отрывок сообщения</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="rowDataActive">
                                <td>16.11.2024</td>
                                <td>Всем</td>
                                <td>Акция — это всегда хорошая новость. Расскажите о вашем сезоне скидок максимально ярко...</td>
                            </tr>
                        </tbody>
                    </table>
                </span>
            </div>
        </div>
    )
}