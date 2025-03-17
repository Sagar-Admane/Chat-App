import React, { useEffect, useState } from 'react'
import style from "./login.module.scss"
import bird from "../../assets/Birdie.svg"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user) navigate("/chat");
  }, [navigate])

  async function handleSubmit(e){
    e.preventDefault();
    console.log(email);
    console.log(password);
    if(!email || !password){
      toast.warning("Please enter all the fields");
      
    }
    try {
      const {data} = await axios.post("https://chat-backend-zyqz.onrender.com/api/user/login",{email, password},{headers:{"Content-Type" : "application/json"}});
      toast.success("Logged In Successfully");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chat");
    } catch (error) {
      toast.error("Login failed");
      console.log(error);
    }
  }

  

  return (
    <div className={style.container} >
      
        <div className={style.left} >
          <div className={style.heading} >
            <h6>Birdie Talks</h6>
            <h2>Login</h2>
          </div>
          <div className={style.form} >
            <form onSubmit={handleSubmit} >
              <div className={style.email} >
                <p>Email : </p>
                <input type="text" placeholder='Enter Your Email Address' value={email} onChange={(e) => {setEmail(e.target.value); console.log(e.target.value)}}  />
              </div>
              <div className={style.password} >
                <p>Password : </p>
                <input type="password" placeholder='Enter Password' onChange={(e) => {setPassword(e.target.value); console.log(e.target.value)}} />
                {/* <input type="password" placeholder="Enter Password" value={password} onChange={(e) => {setPassword(e.target.password); console.log(e.target.value)}}  /> */}
              </div>
              <div className={style.login} >
                <button>Login</button>
                
              </div>
              <div className={style.signup} >
                <p>Don't have an account? <span><Link to="/signup">Register Account</Link></span></p>
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

export default Login
