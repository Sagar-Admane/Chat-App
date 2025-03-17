  import React, { useState } from 'react'
  import style from "./signup.module.scss"
  import bird from "../../assets/Birdie.svg"
  import { Link, useNavigate } from 'react-router-dom'
  import {toast, ToastContainer} from "react-toastify"
  import axios from "axios";

  function Signup() {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e){
      e.preventDefault();
      
      if(!name || !email || !password || !confirm){
        toast.warn("Please fill all the fields");
      }

      if(password!==confirm){
        toast.warn("Password does not match");
      }

      try {
        const {data} = await axios.post("https://chat-backend-zyqz.onrender.com/api/user",{name, email, password, pic},{headers : {"Content-Type" : "application/json"}});
        toast.success("Registration Successful");
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate("/chat");
      } catch (error) {
        toast.error("Error has been occurred");
        console.log(error);
      }

    }

    function postDetails(pics){
      setLoading(true);
      if(!pics){
        toast.error('Error on uploading picture', {
          position : "top-right"
        })
      }
      console.log(pics);

      try {
        if(pics.type === "image/jpeg" || pics.type === "image/png"){
          const data = new FormData();
          data.append("file", pics);
          data.append("upload_preset", "chat-app");
          data.append("cloud_name", "dv7kq1ybw");
          fetch("https://api.cloudinary.com/v1_1/dv7kq1ybw/image/upload",{
            method : "POST",
            body : data
          }).then((res) => res.json()).then(data => {
            setPic(data.url.toString());
            setLoading(false);
          }).catch((err) => {
            console.log(err);
          })
        } else {
          toast.warning("Please select an image");
          setLoading(false);
        }
      } catch (error) {
        console.log(error)
      }
      
    }
    
    return (
      <div className={style.container} >
        <ToastContainer position='top-right' />
          <div className={style.left} >
            <div className={style.heading} >
              <h6>Birdie Talks</h6>
              <h2>SignUp</h2>
            </div>
            <div className={style.form} >
              <form onSubmit={handleSubmit} >
                <div className={style.email} >
                  <p>Name : </p>
                  <input type="text" placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} id="" />
                </div>
                <div className={style.email} >
                  <p>Email : </p>
                  <input type="email" placeholder='Enter Your Email Address' onChange={e => setEmail(e.target.value)} id="" />
                </div>
                <div className={style.password} >
                  <p>Password : </p>
                  <input type="password" placeholder="Enter Password" onChange={e=> setPassword(e.target.value)} name="" id="" />
                </div>
                <div className={style.password} >
                  <p>Confirm Password : </p>
                  <input type="password" placeholder="Re-enter Password" name="" id="" onChange={ e=>setConfirm(e.target.value)} />
                </div>
                <div className={style.password} >
                  <p>Profile Pic : </p>
                  <input type="file" accept='image/*' onChange={(e) => postDetails(e.target.files[0])} name="" id="" />
                </div>
                <div className={style.login} >
                  <button>Login</button>
                </div>
                <div className={style.signup} >
                  <p>Account already created ? <span><Link to="/">Redirect to Login</Link></span></p>
                </div>
              </form>
            </div>
          </div>
          <div className={style.right} >
            <img src={bird} alt="" />
          </div>
      </div>
    )
  }

  export default Signup
