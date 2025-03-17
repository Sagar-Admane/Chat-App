import React, { useState } from 'react'
import { HashRouter, Routes, Route } from "react-router-dom"
import ChatPage from './Components/CHat/chatPage'
import Login from './Components/Login/Login'
import Signup from './Components/SignUp/Signup'
import chatContext from './Context/chatProvider'
import "./App.css"

function App() {
  const [user, setUser] = useState();
  const [open1, setOpen1] = useState(false);
  const [selectedChat, setSelectedchat] = useState();
  const [groupModal, setGroupModal] = useState(false);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]); 
  
  return (
    <chatContext.Provider value={{user, setUser, open1, setOpen1, selectedChat, setSelectedchat, chats, setChats, groupModal, setGroupModal, notification, setNotification}} >
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </HashRouter>
    </chatContext.Provider>
  )
}

export default App
