import { Avatar, Box, Button, Chip, ListItem, Modal, Stack, styled, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import chatContext from '../../Context/chatProvider';
import styles from "./group.module.scss"
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Loading from '../Miscellaneous/Loading';
import { MdOutlineCancel } from "react-icons/md";

function CreaeteGroup({ children }) {

    const CustomChip = styled(Chip)({
        display: "flex",
        alignItems: "center",
        justifyContent : "center",
        gap: "0px",
        
        ".MuiChip-avatar": {
            marginRight: "0px",
        },
        ".MuiChip-label": {
            display: "flex",
            alignItems: "center",
            gap: "5px",
        },
    });

    const val = useContext(chatContext);
    const { user, chats, setChats } = useContext(chatContext);
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUser, setSelectedUser] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);



    const handleOpen = () => val.setGroupModal(true);
    const handleClose = () => val.setGroupModal(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: '12px',
        boxShadow: 24,
        p: 4,
    };

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

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(selectedUser);
        if(!selectedUser){
            toast.error("There are no user selected");
            return;
        }

        if(selectedUser.length < 2){
            toast.error("Select atleast 2 users");
            return;
        }
        console.log(user.token);

        try {

            const { data } = await axios.post(`https://chat-backend-zyqz.onrender.com/api/chat/group`, {name : groupChatName, users: JSON.stringify(selectedUser)},{
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }, )

            if(data) console.log(data);
            setChats([data, ...chats]);
            setSelectedUser([]);
            setSearchResult([]);
            val.setGroupModal(false);
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

    return (
        <>
            <div>
                <ToastContainer />
                {children}
                {/* <Button onClick={handleOpen}>Open modal</Button> */}
                <Modal
                    open={val.groupModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h5" display={'flex'} justifyContent={'center'} alignItems={'center'} component="h2">
                            Create Group Chat
                        </Typography>

                        <form onSubmit={handleSubmit} className={styles.form} >
                            <input type="text" onChange={(e) => setGroupChatName(e.target.value)} placeholder='Chat Name' />
                            <input type="text" onChange={(e) => handleSearch(e.target.value)} placeholder='Add User' />
                            <div style={{display:"flex", gap:"8px", flexWrap:"wrap"}} >
                            {selectedUser.map((val) => {
                                console.log(val);
                                return (
                                    <CustomChip
                                        avatar={<Avatar alt="User" src={val.pic} />}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <span style={{paddingRight : "5px"}} >{val.name}</span>
                                                <MdOutlineCancel cursor={'pointer'} onClick={()=>handleDelete(val)} />
                                            </Box>
                                        }
                                        variant="outlined"
                                    />
                                )
                            })}
                            </div>

                            <Stack direction={'column'} spacing={1} >
                                {
                                    loading ? <Loading /> : (
                                        searchResult.slice(0, 4).map((v) => {
                                            return (
                                                <>
                                                    <ListItem key={v._id} users={v} onClick={() => handleGroup(v)} className={styles.listItem} >
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
                            </Stack>
                            <button>Create Chat</button>
                        </form>

                    </Box>
                </Modal>
            </div>
        </>
    )
}

export default CreaeteGroup
