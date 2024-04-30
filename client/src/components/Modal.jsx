import React from 'react'
import {RiCloseLine} from 'react-icons/ri'
import './Modal.css'
import {useNavigate} from 'react-router-dom'


export default function Modal({setModalOpen}) {
  const navigate = useNavigate()
  return (
    <div className="darkBg" onClick={()=>setModalOpen(false)}>
      <div className="centered">
        <div className='modal'>
          {/* modal-header */}
          <div className="moadalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button className='closeBtn' onClick={()=>setModalOpen(false)}>
            <RiCloseLine/>
          </button>
          {/* modal-content */}
          <div className="modalContent">
            <p>Are you sure you want to logout?</p>
          </div>
          <div className="modalActions">
            <div className="actionContainer">
              <button className='cancelBtn' onClick={()=>setModalOpen(false)}>Cancel</button>
              <button className='logOutBtn' onClick={()=>{setModalOpen(false);
                localStorage.clear();
                navigate('/login')}}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
