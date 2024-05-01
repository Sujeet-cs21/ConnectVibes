import './App.css';
import React,{createContext,useState} from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import{ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './components/CreatePost';
import { LoginContext } from './context/loginContext';
import Modal from './components/Modal';
import MyFolliwngPost from './components/MyFollowingPost';

function App() {
  const [userLogin,setUserLogin] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{setUserLogin,setModalOpen}}>
          <Navbar Login={userLogin}/>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route exact path='/profile' element={<Profile />} />
            <Route path='/createPost' element={<CreatePost/>} />
            <Route path='/profile/:userid' element={<UserProfile/>} />
            <Route path='/followingpost' element={<MyFolliwngPost/>} />
            
          </Routes>
          <ToastContainer theme='dark'/>
          {modalOpen && <Modal setModalOpen={setModalOpen} />}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
