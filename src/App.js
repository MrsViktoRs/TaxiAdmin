import React, {useState, useEffect} from "react";
import axios from 'axios';

import './App.css';
import Authorization from './/components/authorization/Authorization.jsx';
import AdminPanel from './components/adminPanel/AdminPanel.jsx';
import { toast } from "react-toastify";

function App() {
  const [isLonIn, setIsLogIn] = useState(false);
  const [regData, setRegData] = useState({
    username: '',
    password: '',
    invite: '',
  });
  const apiUrl = process.env.REACT_APP_URL_API;

  const handleLogIn = async () => {
    try {
      const response = await axios.post(`${apiUrl}/login/`, {regData});
      localStorage.setItem('isLoggedIn', 'true');
      setIsLogIn(true);
    } catch (error) {
      toast.error('Не верный логин или пароль');
    }
  }

  const logOut = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLogIn(false);
  }

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedLoggedIn === 'true') {
      setIsLogIn(true);
    }
  }, []);
  
  function renderComponent() {
    if (isLonIn) {
      return (
        <>
        <AdminPanel logOut={logOut} username={regData.username} />
        </>
      )
    } else {
      return (
        <>
        <Authorization logIn={handleLogIn} regData={regData} setRegData={setRegData}/>
        </>
      )
    }
  }

  return (
    <div className="App">
      {renderComponent()}
    </div>
  );
}

export default App;
