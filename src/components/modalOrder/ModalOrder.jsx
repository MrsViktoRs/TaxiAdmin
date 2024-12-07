import React, { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './modalOrder.css';

export default function ModalOrder({ handleCloseModal, selectedOrder }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(false);
    const [backendData, setBackendData] = useState([]);
    const [highlightedFields, setHighlightedFields] = useState({});
    const [tempOrder, setTempOrder] = useState({
        car: {
            model: {
                name: 'Не заполнено',
            },
            license: 'Не заполнено',
            vin: 'Не заполнено',
            number: 'Не заполнено',
            year: 'Не заполнено',
            color: {
                name: 'Не заполнено',
            },
        },
        driver_license: {
            country: {
                title: 'Не заполнено',
            },
            expiry_date: 'Не заполнено',
            issue_date: 'Не заполнено',
            number: 'Не заполнено',
            total_since_date: 'Не заполнено',
        },
        person_info: {
            first_name: 'Не заполнено',
            last_name: 'Не заполнено',
            middle_name: 'Не заполнено',
            city: 'Не заполнено',
        },
        integrations: 18883,
        phone: 'Не заполнено',
    });

    function formatDate(dateString, mode) {
        if (dateString === 'Не заполнено') {return dateString;}
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const monthIndex = date.getMonth() + 1;
        const month = monthIndex.toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (mode === 'date') {
            const formattedDate = `${day}.${month}.${year}`;
            return formattedDate;
        } else if (mode === 'time') {
            const formattedDate = `${hours}:${minutes}`;
            return formattedDate;
        } else if (mode === 'reverse_date') {
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const timezoneOffset = date.getTimezoneOffset() / -60;
            const timezone = timezoneOffset >= 0 ? `+${timezoneOffset}` : `${timezoneOffset}`;
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}:00`;
        }
    }

    const fetchBackendData = async () => {
        try {
            setLoading(true);
            const phone = selectedOrder.phone.replace(/\D/g, '');
            const responsUserData = await axios.get(`http://127.0.0.1:8000/api/v1/getUser/${phone}`);
            setBackendData(responsUserData.data);
        } catch (err) {
            setError(err);
            setErrorStatus(true);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        console.log('Сохраняем изменения');
        handleValidation();
        console.log(tempOrder);
    };

    const handleAccepClick = async () => {
        try {
            setLoading(true);
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1' // заголовок с клиентским ключом
            };
            const body = {'integration_id': 18883};
            // let currentOrder = findMatchingPhoneNumber(selectedOrder.phone, orders);
            // const response = await axios.post(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications/${selectedOrder.id}/integrations`, { headers, body: body });
            // const response = await axios.get(`https://v2.jump.taxi/taxi-public/v1/dictionaries/integrations/`, { headers });
            // const res = response.data;
            // console.log(res);
            const responseAcceptMess = await axios.post(`http://127.0.0.1:8000/api/v1/accept_message/`, {
                chat_id: backendData.chat_id
            });
            console.log(responseAcceptMess.data);
            handleCloseModal();
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async () => {
        try {
            setLoading(true);
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1' // заголовок с клиентским ключом
            };
            const body = { comment: 'Меннеджер отклонил заявку' };
            const response = await axios.delete(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications/${selectedOrder.id}/`, { headers, data: body });
            const res = response.data.item;
            console.log('Удалено', res);
            handleCloseModal();
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        const fields = field.split('.');
        setTempOrder(prevData => {
            let updatedData = { ...prevData };
            let current = updatedData;
            
            // Итерируемся по полям и обновляем значение
            for (let i = 0; i < fields.length - 1; i++) {
                if (!current[fields[i]]) {
                    current[fields[i]] = {}; // Создаем объект, если его нет
                }
                current = current[fields[i]];
            }
            
            // Обновляем конечное значение
            current[fields[fields.length - 1]] = value;
            return updatedData;
        });
    };

    // const handleValidation = () => {
    //     const updatedHighlightedFields = {};
    //     Object.keys(tempOrder).forEach(key => {
    //         if (tempOrder[key] === 'Не заполнено' || tempOrder[key] === '') {
    //             updatedHighlightedFields[key] = true;
    //         } else {
    //             updatedHighlightedFields[key] = false;
    //         }
    //     });
    //     setHighlightedFields(updatedHighlightedFields);
    //     console.log(highlightedFields);
    // };

    const handleValidation = () => {
        const updatedHighlightedFields = {};
        highlightFields(tempOrder, updatedHighlightedFields);
        setHighlightedFields(updatedHighlightedFields);
    };

    const highlightFields = (obj, highlighted) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                highlightFields(obj[key], highlighted);
            } else {
                if (obj[key] === 'Не заполнено' || obj[key] === '') {
                    highlighted[key] = true;
                } else {
                    highlighted[key] = false;
                }
            }
        }
    };

    useEffect(() => {
        if (errorStatus) {
            toast(`Ошибка:${error}`);
            setErrorStatus(false);
        } else {
            return;
        }
    }, [errorStatus])

    useEffect(() => {
        setTempOrder(prevData => ({
            car: selectedOrder.car ? selectedOrder.car : prevData.car,
            driver_license: selectedOrder.driver_license ? selectedOrder.driver_license : prevData.driver_license,
            phone: selectedOrder.phone ? selectedOrder.phone : prevData.phone,
            person_info: selectedOrder.person_info ? selectedOrder.person_info : prevData.person_info,
            integrations: selectedOrder.integrations ? selectedOrder.integrations : prevData.integrations
        }));
        fetchBackendData();
        setLoading(false);;
    }, []);

    return (
        <div className="modalOrder" id="modalOrderId">
            {loading ? (
                <div className="loader">Загрузка...</div>
            ):(tempOrder.car ? (
            <>
                <span className="tgLink">{backendData.phone}</span>
                <div className="peopleData">
                    <span className="peopleName">ФИО
                        <input type="text" 
                        defaultValue={tempOrder.person_info.first_name} 
                        onChange={(e) => handleChange('person_info.first_name', e.target.value)}
                        style={highlightedFields.first_name? { borderColor: 'red' } : {}}
                        />
                    </span>
                    <span className="peoplePhone">Телефон
                        <input type="text" 
                        defaultValue={tempOrder.phone} 
                        onChange={(e) => handleChange('phone', e.target.value)} 
                        style={highlightedFields.phone ? { borderColor: 'red' } : {}}
                        />
                    </span>
                    <span className="peopleCity">Город
                        <input type="text" 
                        defaultValue={tempOrder.person_info.city} 
                        onChange={(e) => handleChange('person_info.city', e.target.value)} 
                        style={highlightedFields.city ? { borderColor: 'red' } : {}}
                        />
                    </span>
                </div>
                <div className="docDriverData">
                    <div className="docData">Водительское удостоверение
                        <span className="numberDoc">Серия номер
                        <input type="text" 
                        defaultValue={tempOrder.driver_license.number} 
                        onChange={(e) => handleChange('driver_license.number', e.target.value)}
                        style={highlightedFields.number ? { borderColor: 'red' } : {}}
                        />
                        </span>
                        <span className="countryDoc">Страна
                            <input type="text" 
                            defaultValue={tempOrder.driver_license.country.title} 
                            onChange={(e) => handleChange('driver_license.country.title', e.target.value)}
                            style={highlightedFields.title ? { borderColor: 'red' } : {}}
                            />
                        </span>
                        <span className="mindateDoc">Выдано
                            <input type="text" 
                            defaultValue={formatDate(tempOrder.driver_license.issue_date, 'date')} 
                            onChange={(e) => handleChange('driver_license.issue_date', e.target.value)}
                            style={highlightedFields.issue_date ? { borderColor: 'red' } : {}}
                            />
                        </span>
                        <span className="maxDateDoc">Действует
                            <input type="text" 
                            defaultValue={formatDate(tempOrder.driver_license.expiry_date, 'date')} 
                            onChange={(e) => handleChange('driver_license.expiry_date', e.target.value)}
                            style={highlightedFields.expiry_date ? { borderColor: 'red' } : {}}
                            />
                        </span>
                        <span className="startDateDoc">Дата начала
                            <input type="text" 
                            defaultValue={formatDate(tempOrder.driver_license.total_since_date, 'date')} 
                            onChange={(e) => handleChange('driver_license.total_since_date', e.target.value)}
                            style={highlightedFields.total_since_date ? { borderColor: 'red' } : {}}
                            />
                        </span>
                    </div>
                    <div className="autoData">Автомобиль
                        <span className="numberAuto">Номер
                            <input type="text" 
                            defaultValue={tempOrder.car.number} 
                            onChange={(e) => handleChange('car.number', e.target.value)}
                            style={highlightedFields.value ? { borderColor: 'red' } : {}}
                            />
                        </span>
                        <span className="modelAuto">Марка
                            <input type="text" 
                            defaultValue={tempOrder.car.model.name} 
                            onChange={(e) => handleChange('car.model.name', e.target.value)}
                            style={highlightedFields.name ? { borderColor: 'red' } : {}}
                            />
                        </span>
                        <span className="STSAuto">СТС 
                            <input type="text" 
                            defaultValue={tempOrder.car.license} 
                            onChange={(e) => handleChange('car.license', e.target.value)}
                            style={highlightedFields.license ? { borderColor: 'red' } : {}}
                            />
                        </span>
                        <span className="VINAuto">VIN номер
                            <input type="text" 
                            defaultValue={tempOrder.car.vin} 
                            onChange={(e) => handleChange('car.vin', e.target.value)}
                            style={highlightedFields.vin ? { borderColor: 'red' } : {}}
                            />
                        </span>
                    </div>
                </div>
                <div className="ControlOrder">
                    <button className="controlBtn" id="acceptModalOrder" onClick={handleAccepClick}>Принять</button>
                    <button className="controlBtn" id="declineModalOrder" onClick={handleDeleteClick}>Отклонить</button>
                    <button className="controlBtn" id="saveModalOrder" onClick={handleSave}>Изменить</button>
                    <button className="controlBtn" id="closeModalOrder" onClick={() => {handleCloseModal()}}>Закрыть</button>
                </div>
            </>) : (
                <div className="loader">Загрузка...</div>
            )
            )}
        </div>
    );
};
