import React, { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './modalOrder.css';

export default function ModalOrder({ isModalOpen, handleCloseModal, selectedOrder }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorStatus, setErrorStatus] = useState(false);
    const [backendData, setBackendData] = useState([]);
    const [optionsData, setOptionsData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchModelsAuto, setSearchModelsAuto] = useState([]);
    const [isClosing, setIsClosing] = useState(false);
    const [highlightedFields, setHighlightedFields] = useState({});
    const [appInter, setAppInter] = useState({});
    const [tempOrder, setTempOrder] = useState({
        car: {
            model: {
                name: '',
            },
            license: '',
            vin: '',
            number: '',
            year: '',
            color: {
                name: '',
            },
        },
        driver_license: {
            country: {
                value: '',
                title: '',
            },
            expiry_date: '',
            issue_date: '',
            number: '',
            total_since_date: '',
        },
        person_info: {
            first_name: '',
            last_name: '',
            middle_name: '',
            city: '',
        },
        integrations: {

        },
        phone: '',
    });
    const apiUrl = process.env.REACT_APP_URL_API;

    const handleClose = () => {
        console.log(tempOrder);
        setIsClosing(true);
        console.log(appInter);
        setTimeout(() => {
            handleCloseModal();
            setIsClosing(false);
        }, 500);
    };

    function formatDate(dateString, mode) {
        if (dateString === 'Не заполнено' || dateString === '' || dateString === undefined) {return dateString;}
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const monthIndex = date.getMonth() + 1;
        const month = monthIndex.toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (mode === 'date') {
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        } else if (mode === 'time') {
            const formattedDate = `${hours}:${minutes}`;
            return formattedDate;
        } else if (mode === 'reverse_date') {
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const timezoneOffset = date.getTimezoneOffset() / -60;
            const timezone = timezoneOffset >= 0 ? `+${timezoneOffset}` : `${timezoneOffset}`;
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}:00`;
        } else {
            return dateString;
        }
    }

    const handleSearch = async (text) => {
        try {
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1'
            };
            const params = {search: text};
            const responseColors = await axios.get('https://v2.jump.taxi/taxi-public/v1/dictionaries/autoreg/models_search', { headers, params });
            setSearchModelsAuto(responseColors.data);
        } catch (err) {
            setError(err);
            setErrorStatus(true);
            console.error(err);
        }
    };
    

    const handleChangeModel = (text) => {
        setSearchText(text);
        const newOrder = { 
            ...tempOrder, 
            car: { 
                ...tempOrder.car, 
                model: { 
                    name: text 
                } 
            }
        };
        setTempOrder(newOrder);
        if (text.length >= 2) {
            handleSearch(text);
        }
    };

    const handleSelectModel = (model) => {
        setSearchText('');
        setSearchModelsAuto([]);
        const newOrder = { 
            ...tempOrder, 
            car: { 
                ...tempOrder.car, 
                model: {
                    id: model.id, 
                    name: model.name 
                } 
            }
        };
        setTempOrder(newOrder);
        console.log(newOrder);
    };

    const handleInputFocus = () => {
        setIsDropdownOpen(true);
    };

    const handleInputBlur = () => {
        console.log(tempOrder);
        setTimeout(() => {
          setIsDropdownOpen(false);
        }, 200);
    };

    const handleChangeColor = (selectedValue) => {
        const selectedOption = optionsData.find(option => option.value === selectedValue);
        const newOrder = { 
            ...tempOrder, 
            car: { 
                ...tempOrder.car, 
                color: { 
                    name: selectedOption ? selectedOption.value : selectedValue,
                    id: selectedOption ? selectedOption.id : ''
                } 
            }
        };
        setTempOrder(newOrder);
    };

    const handleChangeCountry = (selectedValue) => {
        const selectedOption = countryData.find(option => option.title === selectedValue);
        console.log(selectedOption);
        const newOrder = { 
            ...tempOrder, 
            driver_license: { 
                ...tempOrder.car, 
                country: { 
                    title: selectedOption ? selectedOption.title : selectedValue,
                    value: selectedOption ? selectedOption.value : ''
                } 
            }
        };
        setTempOrder(newOrder);
    };

    const fetchBackendData = async () => {
        try {
            setLoading(true);
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1'
            };
            const responseColors = await axios.get('https://v2.jump.taxi/taxi-public/v1/dictionaries/autoreg/colors', { headers });
            let precolors = responseColors.data;
            let colors = precolors.slice(1);
            setOptionsData(colors);
            const responseCountries = await axios.get('https://v2.jump.taxi/taxi-public/v1/dictionaries/autoreg/countries', { headers });
            let precountries = responseCountries.data;
            setCountryData(precountries);
            const phone = selectedOrder.phone.replace(/\D/g, '');
            const responsUserData = await axios.get(`${apiUrl}/getUser/${phone}`);
            setBackendData(responsUserData.data);
        } catch (err) {
            setError(err);
            setErrorStatus(true);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const convertPersonInfo = () => {
        const person_info = {
            "first_name": tempOrder.person_info.first_name, 
            "last_name": tempOrder.person_info.last_name, 
            "middle_name": tempOrder.person_info.middle_name,
            "city": tempOrder.person_info.city
        }
        return person_info;
    }

    const convertDriverLicense = () => {
        const driver_license = {
            "driver_license_country": {
                "value": tempOrder.driver_license.country.value,
                "title": tempOrder.driver_license.country.title
            },
            "driver_license_number": tempOrder.driver_license.number, 
            "driver_license_issue_date": tempOrder.driver_license.issue_date,
            "driver_license_expiry_date": tempOrder.driver_license.expiry_date,
            "driver_license_total_since_date": tempOrder.driver_license.total_since_date,
            "driver_license_expiry_date_unlimited": false
        }
        return driver_license;
    }

    const convertCar = () => {
        const car = {
            "car_model_id": tempOrder.car.model.id,
            "car_color_id": tempOrder.car.color.id,
            "car_year": tempOrder.car.year,
            "car_number": tempOrder.car.number,
            "car_license": tempOrder.car.license,
            "car_vin": tempOrder.car.vin,
        }
        return car;
    }

    const handleSave = async () => {
        try {
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            };
            let person_info = convertPersonInfo();
            let driver_license = convertDriverLicense();
            let car = convertCar();
            const response = axios.patch(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications/${selectedOrder.id}/`,
                { person_info, car, driver_license },
                { headers }
            );
            if (( await response).status === 200) {
                handleCheckAgreg();
                toast.success('Данные сохранены');
            }
        } catch (err) {
            setError(err);
            console.error(err);
            toast.error('Произошла ошибка при сохранении, проверьте корректность данных');
        }
    };

    const handleCheckAgreg = async () => {
        try {
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            };
            const response = await axios.get(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications/${selectedOrder.id}/integrations/${selectedOrder.integrations[0].application_integrations[0].id}`, {headers:headers})
            setAppInter(response.data.application_integrations[0].status)
        } catch (err) {
            setError(err);
            console.log(err);
        }
    }

    const handleAccepClick = async () => {
        try {
            setLoading(true);
            const headers = {
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            };
            console.log('send_patch')
            const status_agerg = selectedOrder.integrations[0].application_integrations[0].status.name
            console.log(appInter.slug)
            if (appInter.slug === "exchange_error") {
                toast.error('Ошибка агрегатора, проверьте корректность данных');
                return 
            }
            if (selectedOrder.integrations[0].application_integrations[0].id) {
                const responseRegister = await axios.patch(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications/${selectedOrder.id}/integrations/${selectedOrder.integrations[0].application_integrations[0].id}`, null, { headers: headers });
                console.log(responseRegister)
                if (responseRegister.status === 204) {
                    toast.success('Заявка принята');
                    const responseAcceptMess = await axios.post(`${apiUrl}/accept_message/`, {
                        chat_id: backendData.chat_id,
                        name: selectedOrder.person_info.first_name,
                        surname: selectedOrder.person_info.last_name,
                        patronymic: selectedOrder.person_info.middle_name
                    });
                    handleCloseModal();
                } else {
                    toast.error('Произошла ошибка на этапе регистации заявки через конкретную интеграцию', responseRegister.status);
                }
            } else {
                const responseAgreg = await axios.post(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications/${selectedOrder.id}/integrations`, {integration_id:18883}, {headers: headers});
                console.log(responseAgreg)
                if (responseAgreg.status == 201) {
                    const responseRegister = await axios.patch(`https://v2.jump.taxi/taxi-public/v1/autoreg/applications/${selectedOrder.id}/integrations/${responseAgreg.data.application_integration_id}`, null, { headers: headers });
                    console.log(responseRegister)
                    if (responseRegister.status === 204) {
                        toast.success('Заявка принята');
                        const responseAcceptMess = await axios.post(`${apiUrl}/accept_message/`, {
                            chat_id: backendData.chat_id,
                            name: selectedOrder.person_info.first_name,
                            surname: selectedOrder.person_info.last_name,
                            patronymic: selectedOrder.person_info.middle_name
                        });
                        handleCloseModal();
                }
            }
        }
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
                'Client-Key': '4cf38a3d-abd3-4007-8e02-6cdc93c329a1'
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
            for (let i = 0; i < fields.length - 1; i++) {
                if (!current[fields[i]]) {
                    current[fields[i]] = {};
                }
                current = current[fields[i]];
            }
            current[fields[fields.length - 1]] = value;
            return updatedData;
        });
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
        setLoading(false);
        handleCheckAgreg();
    }, []);

    return (
        <div className={`modalOrder ${isModalOpen ? 'open' : ''}`} id="modalOrderId">
            {loading ? (
                <div className="loader">Загрузка...</div>
            ):(
            <>  <span className="dataUser">
                <span className="agergStatus">Статус агрегатора: {appInter.name}</span>
                <span className="tgLink" onClick={() => window.open(`https://t.me/${backendData.chat_id}`, '_blank')}>https://t.me/@{backendData.chat_id}</span>
                </span>
                <div className="peoplePersonInfo">
                    <span className="peopleName">
                        <input type="text" 
                        placeholder="Иван"
                        defaultValue={tempOrder.person_info.first_name} 
                        onChange={(e) => handleChange('person_info.first_name', e.target.value)}
                        />
                        <input type="text" 
                        placeholder="Иванов"
                        defaultValue={tempOrder.person_info.last_name} 
                        onChange={(e) => handleChange('person_info.last_name', e.target.value)} 
                        />
                        <input type="text" 
                        placeholder="Иванович"
                        defaultValue={tempOrder.person_info.middle_name} 
                        onChange={(e) => handleChange('person_info.middle_name', e.target.value)} 
                        />
                    </span>
                </div>
                <div className="peopleData">
                    <span className="peoplePhone">Телефон
                        <input type="text"
                        placeholder="+79998887766"
                        defaultValue={tempOrder.phone} 
                        onChange={(e) => handleChange('phone', e.target.value)} 
                        />
                    </span>
                    <span className="peopleCity">Город
                        <input type="text"
                        placeholder="Москва"
                        defaultValue={tempOrder.person_info.city} 
                        onChange={(e) => handleChange('person_info.city', e.target.value)} 
                        />
                    </span>
                </div>
                <div className="docDriverData">
                    <div className="docData">Водительское удостоверение
                        <span className="numberDoc">Серия номер
                        <input type="text"
                        placeholder="1122333333"
                        value={tempOrder.driver_license.number} 
                        onChange={(e) => handleChange('driver_license.number', e.target.value)}
                        />
                        </span>
                        <span className="countryDoc">Страна
                            <select 
                            name="contry" 
                            className="countryDriver" 
                            value={tempOrder.driver_license.country.title} 
                            onChange={(e) => handleChangeCountry(e.target.value)}
                            style={{ 
                                color: tempOrder.driver_license.country.title ? 'black' : 'grey',
                                }}
                            >
                            <option value="" disabled hidden id="countryDeafault">Страна не выбрана</option>
                                {countryData.map((option) => (
                                    <option key={option.id} defaultValue={option.title}>{option.title}</option>
                                ))}
                            </select>
                        </span>
                        <span className="mindateDoc">Выдано
                            <input type="text"
                            placeholder="2024-12-01" 
                            value={formatDate(tempOrder.driver_license.issue_date, 'date')} 
                            onChange={(e) => handleChange('driver_license.issue_date', e.target.value)}
                            />
                        </span>
                        <span className="maxDateDoc">Действует
                            <input type="text"
                            placeholder="2027-12-01"
                            value={formatDate(tempOrder.driver_license.expiry_date, 'date')}
                            onChange={(e) => handleChange('driver_license.expiry_date', e.target.value)}
                            />
                        </span>
                        <span className="startDateDoc">Дата начала
                            <input type="text"
                            placeholder="2020-11-01" 
                            value={formatDate(tempOrder.driver_license.total_since_date, 'date')} 
                            onChange={(e) => handleChange('driver_license.total_since_date', e.target.value)}
                            />
                        </span>
                    </div>
                    <div className="autoData">Автомобиль
                        <span className="numberAuto">Номер
                            <input type="text"
                            placeholder="АА777А99"
                            defaultValue={tempOrder.car.number} 
                            onChange={(e) => handleChange('car.number', e.target.value)}
                            />
                        </span>
                        <span className="modelAuto">Марка
                            <input type="text"
                            value={tempOrder.car.model.name || ''}
                            placeholder="Lada"
                            onChange={(e) => handleChangeModel(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            />
                            {isDropdownOpen && (
                                <div id="modelAutoList">
                                    <ul className="modelAutoListUl">
                                    {searchModelsAuto.map((model) => (
                                        <li key={model.id} defaultValue={model.name} onClick={() => handleSelectModel(model)}>{model.name}</li>
                                    ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                        <span className="yearAuto">Год выпуска
                            <input type="text" 
                            value={tempOrder.car.year}
                            placeholder="2022"
                            onChange={(e) => handleChange('car.year', e.target.value)}
                            />
                        </span>
                        <span className="colorAuto">Цвет
                            <select 
                                name="color" 
                                className="colorsAuto" 
                                value={tempOrder.car.color.name} 
                                onChange={(e) => handleChangeColor(e.target.value)}
                                style={{ 
                                    color: tempOrder.car.color.name ? 'black' : 'grey',
                                }}
                            >
                                <option value="" disabled hidden id="colorDefault">Цвет не выбран</option>
                                {optionsData.map((option) => (
                                    <option key={option.id} defaultValue={option.value}>{option.value}</option>
                                ))}
                            </select>
                        </span>
                        <span className="STSAuto">СТС 
                            <input type="text"
                            placeholder="1234567890"
                            defaultValue={tempOrder.car.license} 
                            onChange={(e) => handleChange('car.license', e.target.value)}
                            />
                        </span>
                        <span className="VINAuto">VIN номер
                            <input type="text"
                            placeholder="ХТА123456С7890123"
                            defaultValue={tempOrder.car.vin} 
                            onChange={(e) => handleChange('car.vin', e.target.value)}
                            />
                        </span>
                    </div>
                </div>
                <div className="ControlOrder">
                    <button className="controlBtn" id="acceptModalOrder" onClick={handleAccepClick}>Принять</button>
                    <button className="controlBtn" id="declineModalOrder" onClick={handleDeleteClick}>Отклонить</button>
                    <button className="controlBtn" id="saveModalOrder" onClick={handleSave}>Изменить</button>
                    <button className="controlBtn" id="closeModalOrder" onClick={() => {handleClose()}}>Закрыть</button>
                </div>
                </>
            )}
        </div>
    );
};
