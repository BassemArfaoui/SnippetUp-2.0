import React , {useState , useEffect } from 'react'
import profile_pic from '../../imgs/profile_pic.jpg'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaReply } from "react-icons/fa";
import CommentReply from './CommentReply';



function Comment(props) {
    const [commentReact,setCommentReact]=useState('none');
    const [likeCount,setLikeCount]=useState(props.likeCount)
    const [dislikeCount,setDislikeCount]=useState(props.dislikeCount)
    const [showReplies,setShowReplies]=useState(false);
    const [replies, setReplies] = useState([]);
    const repliesCount = replies.length || 45;


    useEffect(()=>{
        if(props.isLiked)
        {
          setCommentReact('like');
        }

        if(props.isDisliked)
        {
          setCommentReact('dislike');
        }
        },[props.isLiked,props.isDisliked])
    
    


    const likeComment = () => {
        if(commentReact==='dislike')
        {
            setDislikeCount((prev)=>prev-1);
        }
        setCommentReact('like');
        setLikeCount((prev)=>prev+1);
    };

    const unlikeComment = () => {
        setCommentReact('none');
        setLikeCount((prev)=>prev-1);
    };

    const dislikeComment = () => {
        if(commentReact==='like')
        {
            setLikeCount((prev)=>prev-1);
        }
        setCommentReact('dislike');
        setDislikeCount((prev)=>prev+1);
    };

    const undislikeComment = () => {
        setCommentReact('none');
        setDislikeCount((prev)=>prev-1);
    };

    const seeReplies = () => {
        setShowReplies(true);
    };

    const hideReplies = () => {
        setShowReplies(false);
    };

  return (
       <div id="comment" className="comment rounded-4 pb-3 pt-3 px-3 fs-5 position-relative " style={{ whiteSpace: "pre-wrap" }}>
          <div className="d-flex align-items-center mb-2" >
            <div className="poster-info d-flex align-items-center gap-2">

              <div className="avatar">
                <img
                  src={profile_pic}
                  alt="user"
                  className="rounded-circle"
                  style={{ width: "45px", height: "45px" }}
                />
              </div>

              <div>
                <div className="text-white fs-4 fw-bolder d-flex align-items-center m-0 p-0">
                  <span className="commentor_name p-0 m-0 text-dark">{props.firstname + ' ' + props.lastname }<span> ({props.time})</span> </span>
                </div>
              </div>

            </div>
          </div>

          <div className='comment-content fs-5 '>
            <div className='comment-content ms-2 mb-2 pe-3 border border-2 border-dark rounded-4 py-2 px-3'>
                {props.content}
            </div>
          </div>

            <span className='reactions d-flex justify-content-start  gap-3 align-items-center px-3 ms-5'>

                <span className='d-flex align-items-center'> 
                    {commentReact==='like' ? 
                    <span onClick={unlikeComment} className='d-flex align-items-center'>
                        <span className='comment-num m-0 p-0 mt-2 me-1 text-primary'>{likeCount}</span>
                         <span  className='text-primary'><ThumbUpAltIcon/></span> 
                    </span>
                        
                      : <span onClick={likeComment} className='d-flex align-items-center'>
                            <span className='comment-num m-0 p-0 mt-2 mb-0 me-1'>{likeCount}</span>
                            <span ><ThumbUpAltIcon/></span>
                        </span>  
                    }
                </span>

                <span className='d-flex align-items-center gap-1'>
                    {commentReact==='dislike' ? 
                    <span onClick={undislikeComment}>
                        <span className='comment-num m-0 p-0 mt-2 me-1 text-danger'>{dislikeCount}</span>
                        <span  className='text-danger'><ThumbDownAltIcon/></span>
                    </span> :
                    <span onClick={dislikeComment}>
                        <span className='comment-num m-0 p-0 mt-2 me-1'>{dislikeCount}</span>
                        <span ><ThumbDownAltIcon/></span>
                    </span>}
                </span>

                <span className='d-flex align-items-center gap-1 '>
                    {!showReplies ?
                    <span onClick={seeReplies}>
                        <span className='comment-num m-0 p-0 mt-1 me-1'>{repliesCount}</span>
                        <span ><BiSolidCommentDetail /></span>
                    </span>
                     : <span onClick={hideReplies}>
                            <span className='comment-num m-0 p-0 mt-1 text-secondary me-1'>{repliesCount}</span>
                            <span className='text-secondary' ><BiSolidCommentDetail /></span>
                        </span> }
                </span>

                <span className=' reply-btn ms-2'><FaReply/></span>
                
            </span>

           {showReplies && <div className='replies d-flex flex-column gap-2 ms-5 mt-3'>
                <CommentReply />
                <CommentReply />
                <CommentReply />
            </div>}
          


        </div>
  )
}

export default Comment