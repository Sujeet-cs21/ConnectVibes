import React,{useEffect,useState} from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'

export default function Home() {

  const navigate = useNavigate();
  const [data, setData] = useState([])

  useEffect(() => {
    
    const token = localStorage.getItem('jwt')
    if(!token){
      navigate('/login')
    }

    // All posts
    fetch('http://localhost:4000/allPosts',{
      headers: {
        'Authorization':'Bearer '+localStorage.getItem('jwt'),
      },
    })
    .then((res)=>res.json())
    .then((result)=>{
      setData(result);
    })
    .catch(err=>{console.log(err)})

  }, []);

  const likePost = (id) => {
    fetch("http://localhost:4000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId:id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  const unlikePost = (id) => {
    fetch("http://localhost:4000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };
  

  return (
    <div className='home'>
      {/* card */}
      {data.map((posts)=>{
        return(
          <div className="card">
        {/* card-header */}
        <div className="card-header">
          <div className="card-pic">
            <img src="https://source.unsplash.com/random" alt="random" />
          </div>
          <h5>{posts.postedBy.userName}</h5>
        </div>
        {/* card-image */}
        <div className="card-image">
          <img src={posts.photo} alt="" />
          </div>
        {/* card-content */}
        <div className="card-content">

        {posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) 
        ? 
            (
              <span className="material-symbols-outlined material-symbols-outlined-red" onClick={() => {unlikePost(posts._id);}}>
                  favorite
                  </span>
            ) : 
            (
              <span className="material-symbols-outlined" onClick={() => {likePost(posts._id);}}>
                favorite
              </span>
            )}
        <p>{posts.likes.length} likes</p>
        <p>{posts.body}</p>
        </div>
        {/* add comment */}
        <div className="add-comment">
          <input type="text" placeholder="Add a comment" />
          <button className='comment'>Post</button>
          </div>
      </div>
        )
      })}
      
    </div>
  )
}
