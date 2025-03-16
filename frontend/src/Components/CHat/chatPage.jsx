import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import chatContext from '../../Context/chatProvider'
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../Miscellaneous/SideDrawer';
import MyChats from '../Mychats/MyChats';
import ChatBox from '../Miscellaneous/ChatBox';
import style from "./chatpage.module.scss"

function ChatPage() {

  const val = useContext(chatContext);
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    val.setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate])

  return (
    <div className={style.container} >
      {val.user && <SideDrawer   /> }
      <div className={style.chatSection} >
        {val.user && <MyChats fetchAgain={fetchAgain} />}
        {val.user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </div>
    </div>
  )
}

export default ChatPage
