import React, { useState, useRef, useEffect } from "react";
import './comunications.css';
import axios from "axios";

export default function Comunications() {
    const [activeMessage, setActiveMessage] = useState(false);
    const [selectedWhom, setSelectedWhom] = useState('Всем');
    const [whomStatus, setWhomStatus] = useState(false);
    const [dateStatus, setDateStatus] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateTo, setSelectedDateTo] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [activeMessageSet, setActiveMessageSet] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedMess, setSelectedMess] = useState(null);
    const [modalComponent, setModalComponent] = useState(null);
    const apiUrl = process.env.REACT_APP_URL_API;

    const formattedDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }

    const handleInputDateFrom = (event) => {
        setSelectedDate(event.target.value);
    }

    const handleInputDateTo = (event) => {
        setSelectedDateTo(event.target.value);
    }

    const handleInputTime = (event) => {
        setSelectedTime(event.target.value);
    }

    const handleMessageChange = (event) => {
        setMessageText(event.target.value);
    }

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

    const handleSelectDate = () => {
        if (dateStatus) {setDateStatus(false)}
        else setDateStatus(true);
    }

    const handleClickMessage = async () => {
        const message = {
            whom: selectedWhom,
            date_from: selectedDate,
            date_to: selectedDateTo,
            time: selectedTime,
            message: messageText
        }
        console.log(message);
        try {
            const response = await axios.post(`${apiUrl}/saveMessage/`, message);
            fetchActiveMessage();
            console.log(response);
            setSelectedTime(null);
            setSelectedDateTo(null);
            setMessageText('');
            setWhomStatus(false);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchActiveMessage = async () => {
        try {
            const response = await axios.get(`${apiUrl}/saveMessage/`);
            setActiveMessageSet(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleDeleteMessage = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/saveMessage/${id}/`);
            setIsOpenModal(false);
            setSelectedMess(null);
        } catch (err) {
            console.log(err);
        }
    }

    const handleEditMessage = async (id) => {
        try {
            if (selectedMess.whom === "Всем") {
                selectedMess.whom = "all";
            } else if (selectedMess.whom === "Водителям") {
                selectedMess.whom = "driver";
            } else if (selectedMess.whom === "Партнёрам") {
                selectedMess.whom = "partner";
            }
            const response = await axios.put(`${apiUrl}/saveMessage/${id}/`, { ...selectedMess });
            console.log(response);
            setIsOpenModal(false);
            setSelectedMess(null);
        } catch (err) {
            console.log(err);
        }
    }

    const handleOpenModal = (message) => {
        setIsOpenModal(true);
        setSelectedMess(message);
    }

    const handleCloseModal = () => {
        setIsOpenModal(false);
        setSelectedMess(null);
    }

    const handleChangeMessage = (name, e) => {
        console.log(e.target.value);
        setSelectedMess({
            ...selectedMess,
            [name]: e.target.value
        })
        console.log(selectedMess);
    }

    useEffect(() => {
        fetchActiveMessage();
        if (selectedMess) {
            setModalComponent(
                (
                <div className="modalCommunications">
                    <span className="timeDelta">С
                        <input type="text" value={selectedMess.date_from} onChange={(e) => handleChangeMessage('date_from', e)}/>по
                        <input type="text" value={selectedMess.date_to} onChange={(e) => handleChangeMessage('date_to', e)}/>Время
                        <input type="text" value={selectedMess.time} onChange={(e) => handleChangeMessage('time', e)}/>
                        <select className="whom" value={selectedMess.whom} onChange={(e) => handleChangeMessage('whom', e)}>
                            <option selected disabled>{selectedMess.whom}</option>
                            <option value="Всем">Всем</option>
                            <option value="Водителям">Водителям</option>
                            <option value="Партнёрам">Партнёрам</option>
                        </select>
                    </span>
                    <span className="textModalMess">
                        <textarea value={selectedMess.message} onChange={(e) => handleChangeMessage('message', e)}></textarea>
                    </span>
                    <span className="btnModalMess">
                        <button onClick={() => {handleEditMessage(selectedMess.id)}}>Изменить</button>
                        <button onClick={() => {handleDeleteMessage(selectedMess.id)}}>Удалить</button>
                        <button id="closeModalMess" onClick={() => {handleCloseModal()}}>Закрыть</button>
                    </span>
                </div>
                )
            );
        } else { setModalComponent(null); return;}
    }, [isOpenModal, selectedMess]);

    useEffect(() => {
        fetchActiveMessage();
        setSelectedDate(formattedDate());
    }, []);

    return (
        <div className="comunications">
            {modalComponent}
            <div className="modalWhom" style={{ display: whomStatus ? 'flex' : 'none' }}>
                <span className="all" onClick={() => {handleSelectWhom('Всем')}}>Всем <span className="ar"></span></span>
                <span className="drivers" onClick={() => {handleSelectWhom('Водителям')}}>Водителям <span className="ar"></span></span>
                <span className="partners" onClick={() => {handleSelectWhom('Партнёрам')}}>Партнёрам <span className="ar"></span></span>
            </div>
            <div className="modalDateTime" style={{ display: dateStatus ? 'flex' : 'none' }}>от
                <input type="text" className="dateInputFrom" placeholder="гггг-мм-дд" value={selectedDate} onChange={handleInputDateFrom}/>до
                <input type="text" className="dateInputTo" placeholder="гггг-мм-дд" value={selectedDateTo} onChange={handleInputDateTo}/>время
                <input type="text" className="time" placeholder="чч:мм" value={selectedTime} onChange={handleInputTime}/>
            </div>
            <div className="actionCom">
                <span className="viewName">Введите сообщение</span>
                <span className="filter" id="selectedWhom">Видно {selectedWhom}</span><span className="arrowWhom" onClick={handleWhomStatus} style={{transform: whomStatus ? 'rotate(-48deg)' : 'rotate(41deg)'}}></span>
                <span className="filter" id="selectedDate">{selectedDate} - {selectedDateTo}</span><span className="arrowDate" onClick={handleSelectDate} style={{transform: dateStatus ? 'rotate(-48deg)' : 'rotate(41deg)'}}></span>
            </div>
            <div className="messageCom">
                <textarea className="textMessage" placeholder="Введите сообщение" value={messageText} onChange={handleMessageChange}></textarea>
            </div>
            <button className="activeBtn" onClick={handleActiveMess} style={{background: activeMessage ? '#506365' : '#7A9E9F'}}>Активыне cообщения</button>
            <button className="sendMessage" onClick={handleClickMessage}>Отправить</button>
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
                            {activeMessageSet.length > 0 ? (
                                activeMessageSet.map((message) => (
                                    <tr className="rowDataActive" onClick={() => {handleOpenModal(message)}} key={message.id}>
                                        <td>{`${message.date_from} - ${message.date_to}`}</td>
                                        <td>{message.whom}</td>
                                        <td>{message.message}</td>
                                    </tr>
                                ))
                            ):(
                                <tr>
                                    <td colSpan="3">Данные отсутствуют</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </span>
            </div>
        </div>
    )
}