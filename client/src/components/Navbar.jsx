import React,{useContext} from 'react'
import logo from '../img/logoW&B.jpg'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { LoginContext } from '../context/loginContext'
import {useNavigate} from 'react-router-dom'

export default function Navbar({login}) {
  const navigate = useNavigate()

  const {setModalOpen}=useContext(LoginContext)
  const loginStatus=()=>{
    const token = localStorage.getItem('jwt')
    if(login || token){
      return [
        <>
        <Link to='/'><li>Home</li></Link>
        <Link to='/profile'><li>Profile</li></Link>
        <Link to='/createpost'><li>Create Post</li></Link>
        <Link style={{marginLeft:"20px"}} to={'/followingpost'}>Following </Link>
        <Link to=''>
          <button className="primaryBtn" onClick={()=>setModalOpen(true)}>logout</button>
        </Link>
        </>
      ]
    }
    else{
      return [
        <>
        <Link to='/signup'><li>Signup</li></Link>
        <Link to='/login'><li>Login</li></Link>
        </>
      ]
    }
  }

  return (
    <div className='navbar'>
      <img src={logo} alt='logo' onClick={()=>{navigate('/')}} />
      <ul className='nav-menu'>
        {loginStatus()}
      </ul>    
    </div>
  )
}
