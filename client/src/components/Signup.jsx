import React,{useEffect,useState} from 'react'
import logo from '../img/logoW&B.jpg'
import { Link,useNavigate } from 'react-router-dom'
import './Signup.css'
import { toast } from 'react-toastify';

export default function Signup() {
  const navigate = useNavigate()
  const [userName, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Toast Container
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  const emailRegex = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

  const postData = () => {
    if (!emailRegex.test(email)) {
      return notifyA('Invalid Email')
    }
    else if (!passwordRegex.test(password)) {
      return notifyA('Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters')
    }
    fetch('http://localhost:4000/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName,
        email,
        password
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error)
        }
        else {
          notifyB(data.message)
          navigate('/login')
        }
        console.log(data)
      })
  }



  
  return (
    <div className='signup'>
      <div className='form-container'>
        <div className="box">
          <img className='signUplogo' src={logo} alt='' />
        </div>
        <p className='box'>Sign up to Connect</p>
        <div className='box'>
          <input type="text" name='userName' id='userName' value={userName} placeholder='username' onChange={(e)=>{setUsername(e.target.value)}} />
        </div>
        <div className='box'>
          <input type="email" name="email" id='email' value={email} placeholder="email" onChange={(e)=>{setEmail(e.target.value)}}/>
        </div>
        <div className='box'>
          <input type="password" name="password" id='password' value={password} placeholder="password" onChange={(e)=>{setPassword(e.target.value)}} />
        </div>
        <div className="box">
          <input type="submit" id='submit-btn' value='SignUp' onClick={()=>postData()} />
        </div>
        <p className='box'>Already Have an account? <Link to="/login">login</Link></p>
      </div>
    </div>
  )
}
