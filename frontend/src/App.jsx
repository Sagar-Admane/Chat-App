import React, { useState } from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import ChatPage from './Components/CHat/chatPage'
import Login from './Components/Login/Login'
import Signup from './Components/SignUp/Signup'
import chatContext from './Context/chatProvider'
import "./App.css"


const router = createBrowserRouter([
  {
    path : "/",
    element : <Login />
  },
  {
    path : "/chat",
    element : <ChatPage />
  }, {
    path : "/signup",
    element : <Signup />
  }
])

function App() {
  const [user, setUser] = useState();
  const [open1, setOpen1] = useState(false);
  const [selectedChat, setSelectedchat] = useState();
  const [groupModal, setGroupModal] = useState(false);
  const [chats, setChats] = useState([]);;
  const [notification, setNotification] = useState([]); 
  
  return (
    <chatContext.Provider value={{user, setUser, open1, setOpen1, selectedChat, setSelectedchat, chats, setChats, groupModal, setGroupModal, notification, setNotification}} >
    <div>
      <RouterProvider router={router} />
    </div>
    </chatContext.Provider>
  )
}

export default App
