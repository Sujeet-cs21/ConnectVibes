import React,{useState,useContext} from 'react'
import logo from '../img/logoW&B.jpg'
import { Link,useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import './Login.css'
import { LoginContext } from '../context/loginContext';

export default function Login() {

  const {setUserLogin}=useContext(LoginContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  const emailRegex = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/


  const postData = () => {

    if (!emailRegex.test(email)) {
      return notifyA('Invalid Email')
    }

    fetch('http://localhost:4000/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error)
        }
        else {
          notifyB("Signed In Successfully")
          localStorage.setItem('jwt', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          setUserLogin(true)
          navigate('/')
        }
        console.log(data)
      })
  }

  return (
    <div className='login'>
      <div className='form-container'>
        <img className='logInlogo' src={logo} alt='' />
        <p>Sign in to Explore</p>
        <div>
          <input type="email" name="email" id='email' value={email} placeholder="email" onChange={(e)=>{setEmail(e.target.value)}}/>
        </div>
        <div>
          <input type="password" name="password" id='password' value={password} placeholder="password" onChange={(e)=>{setPassword(e.target.value)}} />
        </div>
        <input type="submit" id='submit-btn' value='login' onClick={()=>{postData()}} />
        <p>Don't have an account? <Link to="/signup">signup</Link></p>
      </div> 
    </div>
  )
}
