import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import './referalkeys.css';

export default function Referalkeys() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectKey, setSelectKey] = useState('');
    const modalRef = useRef();
    const [data, setData] = useState([]);
    const [paramName, setParamName] = useState();
    const [paramKey, setParamKey] = useState();
    const [search, setSearch] = useState({});
    const [phone, setPhone] = useState('');
    const apiUrl = process.env.REACT_APP_URL_API;

    const generateRandomKey = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 15; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      };
    
    const handleFilterChange = (event) => {
        const { value } = event.target;
        setSearch(value);
        let param = {
            name: value,
            phone: phone // добавляем phone в параметры поиска
        };
        console.log(value);
        fetchKeys(param);
    };

    const handlePhoneChange = (event) => {
        const { value } = event.target;
        setPhone(value);
        let param = {
            name: search, // сохраняем текущее значение поиска по имени
            phone: value // добавляем номер телефона в параметры поиска
        };
        console.log(value);
        fetchKeys(param);
    };

    const updateKeys = async () => {
        try {
            const response = await axios.put(`${apiUrl}/ref-keys/${selectKey.id}/`, {
                name: paramName,
                key: paramKey || generateRandomKey(),
            });
            setEditModal(false);
            fetchKeys();
            console.log('Ответ получен', response.data);
            return response.data;
        } catch (err) {
                setError(err);
                console.log('Ошибка API запроса', err);
            } finally {
                setLoading(false);
            }
        }

    const fetchKeys = async (param) => {
        try {
            const response = await axios.get(`${apiUrl}/ref-keys/`, {params: param});
            setData(response.data)
            console.log('Ответ получен')
        } catch (err) {
            setError(err);
            console.log('Ошибка API запроса', error);
        } finally {
            setLoading(false);
        }
    };

    const createKey = async () => {
        let param = {
          name: paramName,
          key: paramKey || generateRandomKey(),
          count_invite: 0
        };
      
        try {
          const response = await axios.post(`${apiUrl}/ref-keys/`, param);
          console.log('Ключ создан');
          setIsModalOpen(false);
          fetchKeys();
          return response.data;
        } catch (err) {
            setError(err);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteRefKey = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/ref-keys/${id}/`);
            console.log('Ключ удалён');
            fetchKeys();
            return response.data;
          } catch (err) {
              setError(err);
              console.log(error);
          } finally {
              setLoading(false);
          }
    };

    const handleAddKeyClick = () => {
        setParamName('');
        setParamKey('');
        setIsModalOpen(true);
    };

    const handleEditClick = (elem) => {
        setSelectKey(elem);
        setParamName(elem.name);
        setParamKey(elem.key);
        setEditModal(true);
    }

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        fetchKeys();
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="referalKeys">
                {isModalOpen && (
                <div className="modal" ref={modalRef}>
                    <div className="modalContent">
                        <span className="titleKey">Имя ключа</span>
                        <input type="text" className="inputKey" onChange={(e) => setParamName(e.target.value)}/>
                        <span className="titleKey">Ключ</span>
                        <input type="text" className="inputKey" onChange={(e) => setParamKey(e.target.value)}/>
                        <div className="btnContainer">
                            <button className="modalBtn" onClick={createKey}>Создать</button>
                            <button className="modalBtn" onClick={() => setIsModalOpen(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="modalEdit" style={{display: editModal ? 'flex':'none'}}>
                <div className="modalContent">
                    <span className="titleKey">Имя ключа</span>
                    <input type="text" className="inputKey" value={paramName} onChange={(e) => setParamName(e.target.value)}/>
                    <span className="titleKey">Ключ</span>
                    <input type="text" className="inputKey" value={paramKey} onChange={(e) => setParamKey(e.target.value)}/>
                    <div className="btnContainer">
                        <button className="modalBtn" onClick={updateKeys}>Применить</button>
                        <button className="modalBtn" onClick={() => setEditModal(false)}>Отмена</button>
                    </div>
                </div>
                </div>
            <button className="addKey" onClick={handleAddKeyClick}>Добавить ключ</button>
            <div className="action">
                <input type="text" className="searchKeys" placeholder="Поиск ключей" onChange={handleFilterChange}/>
                <input type="text" className="searchKeysNumber" placeholder="Поиск номеру" onChange={handlePhoneChange}/>
            </div>
            <div className="rowTableTitle">
                <span className="top_table_keys" id="top-left">Имя ключа</span>
                <span className="top_table_keys" id="top-right">Ключ</span>
            </div> 
            <div className="table_keys_all">
                {data.map((elem, index) => (
                    <div className="rowTable" key={index}>
                        <span className="table_keys_left">{elem.name}</span>
                        <span className="table_keys_right">{elem.key}</span>
                        <button className="btn_redact" onClick={() => handleEditClick(elem)}>Ред.</button>
                        <button className="btn_del" onClick={() => deleteRefKey(elem.id)}>Удалить</button>
                        <div className="circle_count">{elem.count_invite}</div>
                    </div>
                ))}
            </div>
            <div className="rowTableBottom" id="row_bottom">
                <span className="table_keys_left">-</span>
                <span className="table_keys_right">-</span>
            </div> 
        </div>
    )
}