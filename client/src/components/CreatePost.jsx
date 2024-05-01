import React, { useState, useEffect } from 'react';
import './CreatePost.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    // Fetch user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (url) {
      // Saving post to mongodb
      fetch('http://localhost:4000/createPost', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          body,
          pic: url
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            notifyA(data.error);
          } else {
            notifyB('Successfully Posted');
            navigate('/');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [url, body, navigate]);

  const postDetails = () => {
    console.log(body, image);

    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'connect-vibes');
    data.append('cloud_name', 'srcloud');
    fetch('https://api.cloudinary.com/v1_1/srcloud/image/upload', {
      method: 'post',
      body: data
    })
      .then(res => res.json())
      .then(data => setUrl(data.url))
      .catch(err => {
        console.log(err);
      });
  };

  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  return (
    <div className='CreatePost'>
      <div className="post-header">
        <h4>Create New Post</h4>
        <button id='post-btn' onClick={postDetails}>Share</button>
      </div>
      <div className="main-div">
        <img id='output' alt="Preview" />
        <input type="file" accept='image/*' onChange={(event) => { loadfile(event); setImage(event.target.files[0]) }} />
      </div>
      {/* details */}
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
            {/* Display user profile picture */}
            <img src={user.Photo? user.Photo : 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'} alt="User" />
          </div>
          {/* Display user name */}
          <h5>{user.userName}</h5>
        </div>
        <textarea value={body} onChange={(e) => { setBody(e.target.value) }} type='text' placeholder='Write a caption...'></textarea>
      </div>
    </div>
  );
}
