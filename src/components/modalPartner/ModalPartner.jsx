import React, { useState } from "react";
import axios from 'axios';
import './modalPartner.css'
import { toast } from "react-toastify";

export default function Referalkeys( {isModalOpen, handleCloseModal, partner, updatePartners} ) {
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        chat_id: partner.chat_id,
        name: partner.name || "",
        surname: partner.surname || "",
        patronymic: partner.patronymic || "",
        phone: partner.phone || "",
        card_number: partner.card_number || ""
    });
    const apiUrl = process.env.REACT_APP_URL_API;

    const handleClickPartner = async (id) => {
        try {
            const responseAcceptMess = await axios.post(`${apiUrl}/accept_message/`, {
                chat_id: id,
                name: formData.name,
                surname: formData.surname,
                patronymic: formData.patronymic,
                phone: formData.phone,
                card_number: formData.card_number,
            });
            if (responseAcceptMess.status === 200) {
                toast.apply('Заявка одобрена');
                updatePartners();
            } else {
                toast.error('Ошибка на backend сервере');
            }
        } catch (err) {
            setError(err);
            console.log(error);
        }    
    }

    const handleDeleteUser = async () => {
        try {
            const response = await axios.delete(`${apiUrl}/delete_user/${partner.id}`)
            if (response.status === 204) {
                handleCloseModal();
                updatePartners();
            } else {
                toast.error('Ошибка с backend, обратитесь к разработчику!')
            }
        } catch (err) {
            setError(err)
            console.log(err);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="modalPartner">
            <div className="dataPartner">
                <span className="tgLinkPartner" onClick={() => window.open(`https://t.me/${partner.chat_id}`, '_blank')}>https://t.me/@{partner.chat_id}</span>
                <span className="nameParnter">Имя:
                    <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                </span>
                <span className="surnameParnter">Фамилия:
                    <input type="text" name="surname" value={formData.surname} onChange={handleChange}/>
                </span>
                <span className="patronymicParnter">Отчество:
                    <input type="text" name="patronymic" value={formData.patronymic} onChange={handleChange}/>
                </span>
                <span className="phoneParnter">Телефон:
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}/>
                </span>
                <span className="cardNumberParnter">Способ оплаты:
                    <textarea name="card_number" id="cardNumber" value={formData.card_number} onChange={handleChange}></textarea>
                </span>
            </div>
            <span className="partnerButtons">
                <button className="btnsParnter" onClick={() => {handleClickPartner(formData.chat_id)}}>Принять</button>
                <button className="btnsParnter" onClick={handleDeleteUser}>Отклонить</button>
                <button className="btnsParnter" id="closePartner" onClick={handleCloseModal}>Закрыть</button>
            </span>
        </div>
    )
}