import React, { useContext, useEffect, useState } from 'react'
import chatContext from '../../Context/chatProvider'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import style from "./chats.module.scss";
import { FaPlus } from "react-icons/fa6";
import { Box, ListItem, Stack } from '@mui/material';
import Loading from '../Miscellaneous/Loading';
import { getSender } from '../../config/chatLogics';
import CreaeteGroup from '../Modals/CreaeteGroup';

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState()
  const val = useContext(chatContext);

  async function fetchChats(){
    try {
      const {data} = await axios.get("http://localhost:5000/api/chat",{
        headers : {
          Authorization : `Bearer ${val.user.token}`
        }
      })
      // console.log(data);
      val.setChats(data);
    } catch (error) {
      toast.error(error);
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [val.selectedChat])

  return (
    <div className={val.selectedChat ? style.contain : style.container} >
      <ToastContainer />
      <Box display={{base : val.selectedChat ? "none" : "flex"}} >
      <div className={style.container1} >
        <div className={style.head} >
          <h2>My Chats</h2>

          <CreaeteGroup>
          <button onClick={()=>{val.setGroupModal(true)}} >New Group Chat <FaPlus /> </button>
          </CreaeteGroup>

        </div>
        <div className={style.chats} >
          <Stack overflow={scrollY} padding={1.5} borderRadius={12} display={'flex'} flexDirection={'column'} gap={'12px'} >
            {/* <ListItem className={style.listItem} >
              heloo
            </ListItem>
            <ListItem className={style.listItem} >
              heloo
            </ListItem>  */}
             {
              val.chats ? (
                  // val.chats.map((v)=>{
                  //   console.log(v);
                  //   return(
                  //   <ListItem onClick={()=>{val.setSelectedchat(v); console.log(val.selectedChat)}} className={style.listItem} key={v._id} style={{ backgroundColor: val.selectedChat === v ? "#FEDCC5" : "#E8E8E8" }}
                  //   >
                  //     {!v.isGroupChat ? getSender(loggedUser, v.users) : <p>{v.chatName}</p> }
                  //   </ListItem>
                  //   )
                  // })
                  val.chats.map((v) => {
                    // console.log(v);
                    
                    const sender = !v.isGroupChat ? getSender(loggedUser, v.users) : null;
                
                    return (
                        <ListItem 
                            onClick={() => { val.setSelectedchat(v); console.log(val.selectedChat); }} 
                            className={style.listItem} 
                            key={v._id} 
                            style={{ backgroundColor: val.selectedChat === v ? "#FEDCC5" : "#E8E8E8" }}
                        >
                            {!v.isGroupChat ? (
                                <>
                                    <img src={sender?.pic} alt={sender?.name} style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} />
                                    <span>{sender?.name}</span>
                                </>
                            ) : (
                                <>
                                    <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt={v.chatName} style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} />
                                    <p>{v.chatName}</p>
                                </>
                            )}
                        </ListItem>
                    );
                })
                
              ) : (
                <Loading />
              )
            }
          </Stack>
        </div>
      </div>
      </Box>
    </div>
  )
}

export default MyChats
