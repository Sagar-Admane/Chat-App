import React, { useContext, useEffect, useState } from 'react'
import style from "./message.module.scss"
import Loading from '../Miscellaneous/Loading';
import { IoSendSharp } from 'react-icons/io5';
import chatContext from '../../Context/chatProvider';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import ScrollableChats from '../ScrollableChats/ScrollableChats';
import io from "socket.io-client"
import Lottie, {} from "react-lottie"
import anumation from "../../typing/type.json"
import env from "dotenv"

const ENDPOINT = process.env.VITE_BACKEND_URL;
var socket, selectedChatCompare;

function Message({ fetchAgain, setFetchAgain }) {

    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoding] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false); 
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const {user, selectedChat, setSelectedchat, notification, setNotification} = useContext(chatContext)

    const defaultOption = {
        loop : true,
        autoplay : true,
        animationData : anumation,
        renderingSettings : {
            preserveAspectRatio : "xMidYMid slice",
        }
    }

    useEffect(()=>{
        fetchMessage();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        console.log(notification, "Updated Notification");
    }, [notification]);

    
    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected", ()=> setSocketConnected(true));
        socket.on('typing',()=>setIsTyping(true));
        socket.on('stop typing',()=>setIsTyping(false));
    }, [])
    
    useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id!=newMessageRecieved.chat._id){
                // givenotification
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
                
            } else {
                setMessage([...message,newMessageRecieved]);
            }
        })
    })
    
    
    async function fetchMessage(){
        if(!selectedChat) return;

        

        try {
            const {data} = await axios.get(`https://chat-backend-zyqz.onrender.com/api/message/${selectedChat._id}`,{
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            })
            setMessage(data);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast.error("Failed to load the messages");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!newMessage) {
            toast.error("There should be some message");
            return;
        }
    
        setNewMessage("");
        socket.emit('stop typing', selectedChat._id);
        try {
            const { data } = await axios.post("https://chat-backend-zyqz.onrender.com/api/message", {
                content: newMessage,
                chatId: selectedChat._id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            });
    
            setMessage([...message, data]);  
            socket.emit("new message", data);
            fetchMessage();  
        } catch (error) {
            toast.error("Failed to send message");
        }
    }

    function typingHandler(e){
        setNewMessage(e.target.value);

        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow-lastTypingTime;
            if(timeDiff>=timerLength && typing){
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength)
    }

    return (
        <div className={style.container} >
            <ToastContainer />
            {loading ? <Loading /> : (
                <div className={style.container1} >
                    <div className={style.msg} >
                        {<ScrollableChats message={message} />}
                    </div>
                    <div className={style.inp} >
                        {isTyping ? <div><Lottie 
                        options={defaultOption}
                        width={70}
                        style={{ marginLeft: 5}}
                        /></div> : <></>}
                        <form onSubmit={handleSubmit} >
                            <input type="text" placeholder='Enter Your text' onChange={typingHandler} value={newMessage} />
                            <IoSendSharp onClick={handleSubmit} size={24} />
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Message
