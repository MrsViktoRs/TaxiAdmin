import React, {useState} from "react";
import axios from 'axios';

import './App.css';
import Authorization from './/components/authorization/Authorization.jsx';
import AdminPanel from './components/adminPanel/AdminPanel.jsx';

function App() {
  const [isLonIn, setIsLogIn] = useState(false);

  const handleLogIn = () => {
    setIsLogIn(true);
  }
  
  function renderComponent() {
    if (isLonIn) {
      return (
        <>
        <AdminPanel />
        </>
      )
    } else {
      return (
        <>
        <Authorization logIn={handleLogIn}/>
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
