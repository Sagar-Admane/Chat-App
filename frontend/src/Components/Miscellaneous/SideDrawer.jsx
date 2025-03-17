import React, { useContext, useEffect, useState } from 'react'
import style from "./sidedrawer.module.scss"
import Tooltip from "@mui/material/Tooltip"
import { Avatar, Button, Divider, Drawer, Menu, MenuItem } from '@mui/material'
import { FaBell } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import chatContext from '../../Context/chatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify"
import axios from "axios";
import Loading from './Loading';


function SideDrawer() {

  const val = useContext(chatContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    val.setOpen1(true);
  }

  function handleLogout(){
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  const [draweropen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const handleSearch = async(e) => {
    e.preventDefault();
    if(!search){
      toast.error("Search was empty");
      return;
    }
    try {
      setLoading(true);
      console.log(val.user.token);
      const {data} = await axios.get(`https://chat-backend-zyqz.onrender.com/api/user?search=${search}`,{
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${val.user.token}`,
        }
      })
      setSearchResult(data);
      setLoading(false);

    } catch (error) {
      console.log(error);
      toast.error("Error in loading the search result");
    }
  }

  async function handleFunction(userId){
    console.log(userId)
    try {
      setLoadingChat(true);
      const {data} = await axios.post("https://chat-backend-zyqz.onrender.com/api/chat", {userId}, {
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${val.user.token}`
        }
      })

      if(!val.chats.find((c) => c._id === data._id)) val.setChats([data, ...chats]);
      console.log(data);
      setLoadingChat(false);
      val.setSelectedchat(data);
      console.log(val.selectedChat)
      setDrawerOpen(false);

    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  return (
    <div className={style.container} >
      <div className={style.search1} >
        <Tooltip title="Search User " arrow>
          <Button onClick={toggleDrawer(true)} color='black' className={style.searchButton} >
            <FaSearch size={16} />
            <p>Search User</p>
          </Button>
        </Tooltip>
      </div>


      <div className={style.logo} >
        <h2>Birdie Talks</h2>
      </div>


      <div className={style.profile} >
        
        
        <Button color='black'
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick} >
          <span>Profile</span>
          <Avatar src={val.user.pic} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          slotProps={{
            paper: {
              sx: {
                width: 150
              }
            }
          }}
        > 

          <ProfileModal />
          <MenuItem onClick={handleOpen} >Profile</MenuItem>

          <Divider />
          <MenuItem onClick={handleLogout} >Logout</MenuItem>
        </Menu>
      </div>

      <Drawer open={draweropen} onClose={toggleDrawer(false)} >
      <ToastContainer />
          <div className={style.drawer} >
            <p>Search Users</p>
          </div>
          <Divider />
          <div className={style.input} >
            <form onSubmit={handleSearch} >
              <input type="text" placeholder='Search for user' onChange={(e) => setSearch(e.target.value)} name="" id="" />
              <input type="submit" value="Go" />
            </form>
          </div>

          <div className={style.res} >
            {
              loading ? <Loading /> : searchResult.map((val) => {
                
                return(
                  
                  <div key={val._id} className={style.result} >
                  <div>
                    <Avatar src={val.pic} />
                  </div>
                  <div key={val._id} user={val} onClick={()=>{handleFunction(val._id)}} >
                    <p>{val.name}</p>
                    <p><span style={{fontWeight : "bold"}} >Email : </span>{val.email}</p>
                  </div>
                  <hr />
                  </div>
                  
                )
              })
            }
          </div>
      </Drawer>
    </div>
  )
}

export default SideDrawer
