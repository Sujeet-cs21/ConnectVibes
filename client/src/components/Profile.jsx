import React,{useEffect,useState} from 'react'
import './Profile.css'

export default function Profile() {

  const [pic, setPic] = useState([])

  useEffect(()=>{
    fetch('http://localhost:4000/myPosts',{
      headers:{
        'Authorization':'Bearer '+localStorage.getItem('jwt')
      }
    })
    .then(res=>res.json())
    .then(result=>{setPic(result)})
  },[])


  return (
    <div className='Profile'>
      {/* Profile-box */}
      <div className="profile-box">
        {/* profile-pic */}
        <div className="profile-pic">
          <img src="https://source.unsplash.com/random" alt="random" />
        </div>
        {/* profile-data */}
        <div className="profile-data">
          <h1>Connecct Vibes</h1>
          {/* profile-info */}
          <div className="profile-info">
            <p>100 posts</p>
            <p>100 followers</p>
            <p>100 following</p>
          </div>
        </div>
      </div>
<hr/>
      {/* Gallery */}
      <div className="gallery">
        {pic.map((pics)=>{
          return(
            <img key={pics._id} src={pics.photo} alt={pics.title} className='item' />
          )
        })}
      </div>
    </div>
  )
}
