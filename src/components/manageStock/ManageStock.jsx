import React, { useState, useLayoutEffect } from "react";
import axios from 'axios';
import './manageStock.css';

export default function ManageStock() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [switchStates, setSwitchStates] = useState(true);
    const [data, setData] = useState([]);
    const [text, setText] = useState();
    const [selectElem, setSelectElem] = useState(null);
    const [stockId, setStockId] = useState(1);

    const fetchStock = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/stocks/`);
            setData(response.data);
        } catch (err) {
            setError(err);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (param) => {
        console.log('Отправляемые данные:', param);
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/v1/stocks/${stockId}/`, 
                param
            );
            await fetchStock();
            console.log('Данные обновлены:', response.data);
        } catch (error) {
            console.error('Ошибка обновления данных:', error);
        }
    };

    const handleAccepClick = async () => {
        if (switchStates) {
            let param = {
                on_text: text,
                off_text: selectElem.off_text,
                status: true
            }
            await handleUpdate(param);
        }
        else {
            let param = {
                on_text: selectElem.on_text,
                off_text: text,
                status: false
            }
            await handleUpdate(param);
        }
    };

    const handleButtonClick = (id) => {
        const stock = data.find((item, index) => item.id === id);
        console.log(stock)
        if (stock) {
            setSelectElem(stock)
            setStockId(stock.id);
            if (stock.status) {
                setText(stock.on_text);
                setSwitchStates(stock.status)
                console.log(`Text ${text}`)
            }
            else {
                setText(stock.off_text);
                setSwitchStates(stock.status)
            }
            console.log(`Акция ${stock.id}`)
            console.log(`Text ${text}`)
        } else {
            console.error(`Акция с id ${id} не найдена`);
        }
    };

    const handleSwichClick = () => {
        if (switchStates) {
            setText(selectElem.off_text);
            setSwitchStates(false);

        }
        else {
            setSwitchStates(true);
            setText(selectElem.on_text);
        }
    }

    useLayoutEffect(() => {
        if (loading) {
            fetchStock();
        } else {
            handleButtonClick(1);
        }
    }, [data]);

    if (loading) {
        return <p className="loadingMess">Загрузка данных...</p>
    }

    return (
        <div className="manageStock">
            <label className="switchStock">
                <input type="checkbox" checked={switchStates} onClick={handleSwichClick} onChange={(e) => setSwitchStates(e.target.checked)}/>
                <span className="slider round"></span>
            </label>
            <div className="viewStock">
                <button className="viewBtnStock" onClick={() => handleButtonClick(1)} style={{backgroundColor: stockId === 1 ? '#506365' : '#7A9E9F'}}>Акция 1</button>
                <button className="viewBtnStock" onClick={() => handleButtonClick(2)} style={{backgroundColor: stockId === 2 ? '#506365' : '#7A9E9F'}}>Акция 2</button>
                <button className="viewBtnStock" onClick={() => handleButtonClick(3)} style={{backgroundColor: stockId === 3 ? '#506365' : '#7A9E9F'}}>Акция 3</button>
                <button className="viewBtnStock" onClick={() => handleButtonClick(4)} style={{backgroundColor: stockId === 4 ? '#506365' : '#7A9E9F'}}>Акция 4</button>
                <button className="viewBtnStock" onClick={() => handleButtonClick(5)} style={{backgroundColor: stockId === 5 ? '#506365' : '#7A9E9F'}}>Акция 5</button>
                <button className="viewBtnStock" id="helpRoad" onClick={() => handleButtonClick(6)} style={{backgroundColor: stockId === 6 ? '#506365' : '#7A9E9F'}}>Помощь</button>
                <button className="viewBtnStockMini" onClick={() => handleButtonClick(1)} style={{backgroundColor: stockId === 1 ? '#506365' : '#7A9E9F'}}>1</button>
                <button className="viewBtnStockMini" onClick={() => handleButtonClick(2)} style={{backgroundColor: stockId === 2 ? '#506365' : '#7A9E9F'}}>2</button>
                <button className="viewBtnStockMini" onClick={() => handleButtonClick(3)} style={{backgroundColor: stockId === 3 ? '#506365' : '#7A9E9F'}}>3</button>
                <button className="viewBtnStockMini" onClick={() => handleButtonClick(4)} style={{backgroundColor: stockId === 4 ? '#506365' : '#7A9E9F'}}>4</button>
                <button className="viewBtnStockMini" onClick={() => handleButtonClick(5)} style={{backgroundColor: stockId === 5 ? '#506365' : '#7A9E9F'}}>5</button>
                <button className="viewBtnStockMini" id="helpRoad" onClick={() => handleButtonClick(6)} style={{backgroundColor: stockId === 6 ? '#506365' : '#7A9E9F'}}>П</button>
            </div>
            <textarea name="textStock" id="textStock" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <button className="accepStock" onClick={handleAccepClick}>Применить</button>
        </div>
    )
}