import React,{useEffect,useState} from 'react'
import PostDetail from './PostDetail'
import './Profile.css'
import ProfilePic from './ProfilePic'

export default function Profile() {
  var picLink = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'

  const [pic, setPic] = useState([])
  const [show, setShow] = useState(false)
  const [posts, setPosts] = useState([])
  const [changePic, setChangePic] = useState(false)
  const [user, setUser] = useState('')

  const toggleDetails = (posts) => {
    if(show){
      setShow(false)
    }
    else{
      setShow(true)
      setPosts(posts)
    }
  }

  const changeprofile=()=>{
    if(changePic)
    {
      setChangePic(false);
    }
    else{
      setChangePic(true)
    }
  }

  useEffect(() => {
    fetch(`http://localhost:4000/user/${JSON.parse(localStorage.getItem('user'))._id}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
    .then(res => res.json())
    .then(result => {
      if (result.post) {
        setPic(result.post);
      }
      setUser(result.user);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);
  

  return (
    <div className='Profile'>
      {/* Profile-box */}
      <div className="profile-box">
        {/* profile-pic */}
        <div className="profile-pic" onClick={changeprofile}>
          <img src={user.Photo? user.Photo : picLink} alt="" />
        </div>
        {/* profile-data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem('user')).userName}</h1>
          {/* profile-info */}
          <div className="profile-info">
          <p>{pic ? pic.length : "0"} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>
<hr/>
      {/* Gallery */}
      <div className="gallery">
        {pic.map((pics)=>{
          return(
            <img key={pics._id} src={pics.photo} onClick={()=>{
              toggleDetails(pics)
            }} className='item' />
          )
        })}
      </div>
      {show &&<PostDetail item={posts} toggleDetails={toggleDetails}/>}
      {changePic && <ProfilePic changeprofile={changeprofile}/>}
    </div>
  )
}
