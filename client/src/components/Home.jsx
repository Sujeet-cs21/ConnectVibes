import React,{useEffect,useState} from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import { Link } from 'react-router-dom'

export default function Home() {

  var picLink = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'

  const navigate = useNavigate();
  const [data, setData] = useState([])
  const [comment, setComment] = useState('')
  const [show, setShow] = useState(false)
  const [item, setItem] = useState([])

  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

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

  //to show-hide comments
  const toggleComment = (posts) => {
    if(show){
      setShow(false)
    }
    else{
      setShow(true)
      setItem(posts)
    }
  }

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
  
  // make-comment
  const makeComment = (text, id) => {
    fetch("http://localhost:4000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId:id,
        text:text,
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
        setComment('')
        notifyB("Commented Successfully")
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
            <img src={posts.postedBy.Photo? posts.postedBy.Photo : picLink} alt="random" />
          </div>
          <h5>
            <Link to={`/profile/${posts.postedBy._id}`}>
              {posts.postedBy.userName}
            </Link>
          </h5>
        </div>
        {/* card-image */}
        <div className="card-image">
          <img src={posts.photo} alt="" />
          </div>
          <div className="caption">
            <p>{posts.body}</p>
          </div>
        {/* card-content */}
        <div className="card-content">
          <div className="likes">
            {posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) 
            ? 
            (<span style={{color:"red"}} className="material-symbols-outlined material-symbols-outlined-red" onClick={() => {unlikePost(posts._id);}}>
              favorite
              </span>)
              : 
            (<span className="material-symbols-outlined" onClick={() => {likePost(posts._id);}}>
              favorite
              </span>)
            }
            <p>{posts.likes.length} likes</p>
          </div>

        <p style={{fontWeight:"bold",cursor:'pointer'}} onClick={()=>{toggleComment(posts)}}>view all comments</p>
        </div>
        {/* add comment */}
        <div className="add-comment">
          <input type="text" placeholder="Add a comment" value={comment} onChange={(e)=>{setComment(e.target.value)}} />
          <button className='comment' onClick={()=>{makeComment(comment,posts._id)}}>Comment</button>
        </div>
      </div>
        )
      })}

      {/* show comments */}
      {show && (
      <div className="showComment">
        <div className="container">
          <div className="postPic">
            <img src={item.photo} alt="" />
          </div>
          <div className="details">
            {/* card-header */}
            <div className="card-header" style={{borderBottom:"1px solid #000029"}}>
              <div className="card-pic">
                <img src={item.postedBy.Photo? item.postedBy.Photo : picLink} alt="" />
              </div>
              <h5>{item.postedBy.userName}</h5>
            </div>
            {/* comment-section */}
            <div className="comment-section " style={{borderBottom:"1px solid #000029"}}>
              {
                item.comments.map((cmnt)=>{
                  return(
                    <p className="com">
                      <span className='commentBy' style={{fontWeight:"bolder"}}>{cmnt.postedBy.userName}{": "} </span>
                      <span className="commentText">{cmnt.comment}</span>
                    </p>
                  )
                })
              }

              <div className="card-content">
                <div className="caption">
                  <p>{item.body}</p>
                </div>
                <p>{item.likes.length} likes</p>
              </div>

              <div className="add-comment">
                <input type="text" placeholder="Add a comment" value={comment} onChange={(e)=>{setComment(e.target.value)}} />
                <button className='comment' onClick={()=>{makeComment(comment,item._id); toggleComment()}}>Post</button>
              </div>
            </div>
          </div>
        </div>
        <div className="close-comment" onClick={()=>toggleComment()}>
          <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
        </div>
      </div>)
      }
      
    </div>
  )}