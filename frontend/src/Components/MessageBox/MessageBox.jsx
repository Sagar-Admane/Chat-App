import React, { useContext, useEffect, useState } from 'react'
import style from "./message.module.scss"
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSendSharp } from "react-icons/io5";
import chatContext from '../../Context/chatProvider';
import { getSender } from '../../config/chatLogics';
import { Avatar, Button, Chip, ListItem, Modal, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Loading from '../Miscellaneous/Loading';
import { MdOutlineCancel } from 'react-icons/md';
import Message from '../Messages/Message';

function MessageBox({ fetchAgain, setFetchAgain }) {

  const CustomChip = styled(Chip)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0px",
    cursor: "pointer",

    ".MuiChip-avatar": {
      marginRight: "0px",
    },
    ".MuiChip-label": {
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
  });

  const { user, selectedChat, setSelectedchat } = useContext(chatContext);

  const [loggedUser, setLoggedUser] = useState();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rename, setRename] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const sender = !selectedChat.isGroupChat
    ? getSender(loggedUser, selectedChat.users)
    : { name: selectedChat.chatName, pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
  }, [])

  const handleClick = async (id) => {
    if(selectedChat.groupAdmin._id !== user._id){
      toast.error("This can only be modified by admin");
    }

    if(id === user._id){
      toast.error("You can't remove yourself");
      return;
    }

    try {
      const {data} = await axios.put("https://chat-backend-zyqz.onrender.com/api/chat/groupremove", {chatId : selectedChat._id, userId : id},{
        headers : {
          Authorization : `Bearer ${user.token}`,
        }
      })
      setSelectedchat(data);
    } catch (error) {
      console.log(error);
    }

  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(selectedUser);
    if(selectedChat.groupAdmin._id !== user._id){
      toast.error("This can only be modified by admin");
    }
    if (!selectedUser) {
      toast.error("There are no user selected");
      return;
    }

    if(selectedChat.users.some(user => user._id === selectedUser[0]._id)){
      toast.error("The user is already present");
      return;
    }

    console.log(selectedUser[0]._id);
    console.log(selectedChat._id);
    console.log(user.token);

    try {

      const { data } = await axios.put("https://chat-backend-zyqz.onrender.com/api/chat/groupadd", { chatId: selectedChat._id, userId: selectedUser[0]._id }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      },)

      if (data) console.log(data);
      setSelectedchat(data);
      handleClose();
      setSelectedUser([]);
      setSearchResult([]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRename(e) {
    e.preventDefault();
    if (!rename) {
      toast.error("Please Enter a name");
    }
    if (rename === selectedChat.chatName) {
      toast.error("Name cannot be same as previous name");
    }
    try {
      const { data } = await axios.put("https://chat-backend-zyqz.onrender.com/api/chat/rename", { name: rename, chatId: selectedChat._id }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      if (data) {
        console.log(data);
        handleClose();
        setSelectedchat(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Cannot rename");
    }
  }


  async function handleSearch(query) {
    setSearch(query);
    if (!query) return;
    setLoading(true)

    try {
      const { data } = await axios.get(`https://chat-backend-zyqz.onrender.com/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })

      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error(error);
    }
  }

  function handleGroup(userToAdd) {
    if (selectedUser.includes(userToAdd)) {
      toast.warn("User Already Added");
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  }

  function handleDelete(val){
    console.log(val);
    setLoading(true);
    setSelectedUser((a) => a.filter((b) => b._id!==val._id))
    setLoading(false);
}

const handledelete = (id) => {
  handleClick(id);
  console.info('You clicked the delete icon.');
};

  return (
    <div className={style.container} >
      <ToastContainer />
      <div className={style.head} >
        <div className={style.sender} >
          {!selectedChat.isGroupChat ? <Avatar src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" sx={{ width: '28px', height: '28px' }} /> : <Avatar src={sender.pic} sx={{ width: '28px', height: '28px' }} />}
          <p>{sender.name}</p>
        </div>
        <GiHamburgerMenu onClick={handleOpen} className={style.burger} size={24} />
      </div>
      <div className={style.box} >
        <div className={style.msg} >
          <Message fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>

      </div>

      {/* /*Modal*/}

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={style.styles}>
            <Typography className={style.modalH} id="modal-modal-title" variant="h6" component="h2">
              {selectedChat.isGroupChat ? <Avatar src='https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' /> : <Avatar src={selectedChat.pic} />}
              {sender.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, margin: "15px 0px" }}>
              {selectedChat.isGroupChat ? (
                selectedChat.users.map((v) => {
                  console.log('The answer is tidbfids : ');
                  
                  return (
                    <span style={{ margin: '5px' }} >
                      <Chip label={v.name} key={v._id} onDelete={()=>handledelete(v._id)} onClick={()=>handleClick(v._id)} />
                    </span>
                  )
                })
              ) : <span style={{ fontWeight: "bold" }}>Email: {sender.email} </span>}
            </Typography>
            {selectedChat.isGroupChat ? (
              <>
                <form onSubmit={handleRename} className={style.rename} >
                  <input placeholder='Rename' type="text" name="" id="" onChange={(e) => setRename(e.target.value)} />
                  <button>Update Name</button>
                </form>
                <form onSubmit={handleSubmit} className={style.rename1} >
                  <input placeholder='Enter User Name' type="text" name="" id="" onChange={(e) => handleSearch(e.target.value)} />
                  <button>Add Users</button>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }} >
                    {selectedUser.map((val) => {
                      console.log(val);
                      return (
                        <CustomChip
                          avatar={<Avatar alt="User" src={val.pic} />}
                          label={
                            <Box display="flex" alignItems="center">
                              <span style={{ paddingRight: "5px" }} >{val.name}</span>
                              <MdOutlineCancel cursor={'pointer'} onClick={() => handleDelete(val)} />
                            </Box>
                          }
                          variant="outlined"
                        />
                      )
                    })}
                  </div>
                  {
                    loading ? <Loading /> : (
                      searchResult.slice(0, 4).map((v) => {
                        return (
                          <>
                            <ListItem key={v._id} users={v} onClick={() => handleGroup(v)} className={style.listItem} >
                              <div>
                                <Avatar src={v.pic} />
                              </div>
                              <div>
                                <div>
                                  <p>Name :
                                    {v.name}</p>
                                </div>
                                <div>
                                  <p>Email :
                                    {v.email}</p>
                                </div>
                              </div>
                            </ListItem>
                          </>
                        )
                      })
                    )
                  }
                </form>
              </>
            ) : null}
          </Box>
        </Modal>
      </div>

    </div>
  )
}

export default MessageBox
