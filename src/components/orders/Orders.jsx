import React, { useState, useEffect } from "react";
import axios from 'axios';
import './orders.css';
import ModalOrder from "../modalOrder/ModalOrder.jsx";
import ModalPartner from "../modalPartner/ModalPartner.jsx"

export default function Orders ({ orders }) {
    const [error, setError] = useState(null);
    const [selectedView, setSelectedView] = useState(1);
    const [data, setData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalComponent, setModalComponent] = useState(null);
    const [fetchOrdersRegCalled, setFetchOrdersRegCalled] = useState(false);
    const [partners, setPartners] = useState([]);
    const [modalComponentPartner, setModalComponentParnter] = useState(null);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isModalPartner, setIsModalPartner] = useState(false);
    const apiUrl = process.env.REACT_APP_URL_API;

    function formatDate(dateString, mode) {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
        const monthName = months[monthIndex];

        if (mode === 'date') {
            const formattedDate = `${day} ${monthName} ${year}г.`;
            return formattedDate;
        } else if (mode === 'time') {
            const formattedDate = `${hours}:${minutes}`;
            return formattedDate;
        } else {
            const formattedDate = `${day} ${monthName} ${year}г.`;
            return formattedDate;
        }
    }

    const handleClickView = (view) => {
        setSelectedView(view)
    }

    const fetchOrdersPartner = async () => {
        try {
            const response = await axios.get(`${apiUrl}/get_partners/`);
            setPartners(response.data);
        } catch (err) {
            setError(err);
            console.log(error);
        }
    }

    const fetchOrdersReg = async () => {
        if (modalOpen) return;
        try {
            const params = {
                direction: ['taxi'],
                status: ['draft', 'not_filled', "exchange_error", 'not_processed'],
                page: 1,
                per_page: '20',
                order: '-date'
              };
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1'
              };
            const response_jump = await axios.get(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications`, {params, headers});
            setData(response_jump.data.items);
        } catch (err) {
            setError(err);
            console.log(error);
        }
    };

    const fetchOrderData = async (id) => {
        if (modalOpen) return;
        console.log('отпрапвляем запрос', 'orderData');
        try {
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1'
            };
            const response = await axios.get(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications/${id}/`, { headers });
            const orderData = response.data.item;
            setSelectedOrder(orderData, 'Ответ получен', 'orderData');
        } catch (err) {
            setError(err);
            console.error(err);
        }
    };

    const handleModalOpen = async (id) => {
        if (!fetchOrdersRegCalled) {
            setFetchOrdersRegCalled(true);
        }
        await fetchOrderData(id);
        setModalOpen(true);
    };

    const handeModalOpenPartner = (partner) => {
        setSelectedPartner(partner);
        setIsModalPartner(true);
    }

    const handleCloseModalPartner = () => {
        setIsModalPartner(false);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
    }

    useEffect(() => {
        if (modalOpen) {
            setModalComponent(<ModalOrder isModalOpen={modalOpen} handleCloseModal={handleCloseModal} selectedOrder={selectedOrder} />)
        } else {
            setModalComponent(null);
            fetchOrdersReg();
        }
    }, [modalOpen]);

    useEffect(() => {
        if (isModalPartner) {
            setModalComponentParnter(<ModalPartner isModalOpen={isModalPartner} handleCloseModal={handleCloseModalPartner} partner={selectedPartner} updatePartners={fetchOrdersPartner} />)
        } else {
            setModalComponentParnter(null);
            fetchOrdersReg();
        }
    }, [isModalPartner]);

    return (
        <div className="orders">
            {modalComponent}
            {modalComponentPartner}
            <div className="viewOrders">
                <button className="viewBtnOrders" onClick={() => handleClickView(1)} style={{backgroundColor: selectedView === 1 ? '#506365' : '#7A9E9F'}}>Регистрация водителей</button>
                <button className="viewBtnOrders" onClick={() => handleClickView(2)} style={{backgroundColor: selectedView === 2 ? '#506365' : '#7A9E9F'}}>Регистрация партнёров</button>
            </div>
            <div className="tableContainer">
                <table className="tableOrder">
                    {selectedView === 1 ? (
                    <>
                    <thead>
                        <tr className="rowTitle">
                            <th className="titleFullName">ФИО</th>
                            <th>Телефон</th>
                            <th>Время</th>
                            <th>Дата</th>
                            <th className="titleUrlJump">Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((order, index) => (
                            <tr key={index} onClick={() => {handleModalOpen(order.id)}} className="rowDataOrdersReg">
                                <td>{order.name}</td>
                                <td>{order.phone}</td>
                                <td>{formatDate(order.date, 'time')}</td>
                                <td>{formatDate(order.date, 'date')}</td>
                                <td>{order.status.title}</td>
                            </tr>
                            ))
                        ) : (
                            <tr className="noOrders">
                                <td colSpan="5" id="noOrdersId">Загрузка...</td>
                            </tr>
                        )}
                    </tbody>
                        </>
                    ):(
                        <>
                    <thead>
                        <tr className="rowTitle">
                            <th className="titleFullName">ФИО</th>
                            <th>Телефон</th>
                            <th className="titleUrlJump">Способ оплаты</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.length > 0 ? (
                            partners.map((order, index) => (
                            <tr key={index} onClick={() => {handeModalOpenPartner(order)}} className="rowDataOrdersReg">
                                <td>{`${order.surname} ${order.name} ${order.patronymic}`}</td>
                                <td>{order.phone}</td>
                                <td>{order.card_number}</td>
                            </tr>
                            ))
                        ) : (
                            <tr className="noOrders">
                                <td colSpan="5" id="noOrdersId">Заявок нет</td>
                            </tr>
                        )}
                    </tbody>
                        </>
                    )}

                </table>
            </div>
        </div>
    )
}