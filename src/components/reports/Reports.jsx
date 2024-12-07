import React, { useState, useRef, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './reports.css';

export default function Reports() {

    return (
        <div className="reports">
            <div className="actionReports">
                <button className="usersBtn">Пользователи</button>
                <span className="labelCheckBox" id="activeUsers">Неактивные пользователи</span>
                <input type="checkbox" className="reportsCheckBox"/>
                <span className="labelCheckBox">Не тинькофф</span>
                <input type="checkbox" className="reportsCheckBox"/>
                <span className="labelCheckBox">Победители акции</span>
                <input type="checkbox" className="reportsCheckBox"/>
           </div>
           <div className="tableContainer">
                <table className="tableReports">
                    <thead>
                        <tr className="rowTitleReports">
                            <th className="titleFullName">ФИО</th>
                            <th>Telegram</th>
                            <th>Номер</th>
                            <th>Название акции</th>
                            <th>Дата победы в акции</th>
                            <th>Сумма выигрыша</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                        <tr className="rowDataReports">
                            <td className="fullName">Хомутов Вкитор Андреевич</td>
                            <td>@WYJBro</td>
                            <td>+79066642548</td>
                            <td>Твой таксопарк</td>
                            <td>16.11.2024</td>
                            <td>35000</td>
                        </tr>
                    </tbody>
                </table>
           </div>
           <button className="btnDownloadDocs">Скачать документ</button>
        </div>
    )
}