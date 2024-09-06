import React, { useState } from 'react';
import profile_pic from '../../imgs/profile_pic.jpg'
import './styles/Post.css'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function Post() {
  //states
  const [isSaved,setIsSaved]=useState(false);
  const [isCopied,setIsCopied]=useState(false);
  const [isIntrested,setIsIntrested]=useState(false);
  // Random numbers for demonstration
  const likeCount = '456M';
  const dislikeCount = 10;
  const commentCount = 30;
  const shareCount = 15;

  //buttons functions
  const saveSnippet=()=>{
    setIsSaved(true);
  }

  const unsaveSnippet=()=>{
    setIsSaved(false);
  }

  const copyCode=()=>{
    setIsCopied(true);
    setTimeout(()=>{setIsCopied(false)},1600)
  }

  const uncopyCode=()=>{
    setIsCopied(false);
  }

  const becomeIntrested=()=>{
    setIsIntrested(true);
  }

  
  const becomeUnintrested=()=>{
    setIsIntrested(false);
  }

  

  return (
    <div className="post rounded-4 p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="avatar">
            <img
              src={profile_pic}
              alt="user picture"
              className="rounded-circle"
              style={{ width: '60px', height: '60px' }}
            />
          </div>
          <div>
            <div className="text-white fs-4 fw-bolder d-flex align-items-center m-0 p-0">
              <span className='p-0 m-0'>Bassem Arfaoui</span> 
             {!isIntrested ?
              <span className='text-light p-0 mb-1 ms-2 intrested-icon' onClick={becomeIntrested}>
                <StarBorderIcon style={{fontSize:'30px'}}/>
              </span> :
              <span className='text-primary p-0 mb-1 ms-2 intrested-icon' onClick={becomeUnintrested}>
                <StarIcon style={{fontSize:'30px'}}/>
              </span> 
              }
            </div>
            <div className="text-secondary fs-5">@arfBassem</div>
          </div>
        </div>
        <div className="px-2 py-1 bg-secondary fs-6 fw-bold text-light rounded">JavaScript</div>
      </div>
      <div className="d-flex flex-column gap-1 align-items-center justify-content-between mb-3">
        <h3 className="snippet-title fw-bold text-center">Snippet Title</h3>
        <div className="buttons align-self-end d-flex gap-3 align-items-center">
          <div class="save-btn">
            {/* save button */}
              {isSaved ? <button className="btn btn-outline-primary post-btn" onClick={unsaveSnippet}><BookmarkAddedIcon className='' style={{ fontSize: '28px' }} /></button>
              : <button className="btn btn-outline-light post-btn" onClick={saveSnippet}><BookmarkAddIcon style={{ fontSize: '28px' }} /></button>}
          </div>
            {/* copy button */}
              {isCopied ? <button className="btn btn-outline-primary post-btn" onClick={uncopyCode}><DoneIcon /></button>
              : <button className="btn btn-outline-light post-btn" onClick={copyCode}><ContentCopyIcon /></button>}
          <button className="btn btn-outline-light post-btn"><FullscreenIcon style={{ fontSize: '34px' }} /></button>
        </div>
      </div>
      <div className="border border-secondary rounded p-3" style={{ height: '200px', overflowY: 'auto' }}>
        <pre className="text-white">
          <code>
            {`function greet(name) {
              console.log(\`Hello, \${name}!\`);
            }

            greet('World');

            function calculateArea(length, width) {
              return length * width;
            }

            const area = calculateArea(10, 20);
            console.log(\`The area is \${area} square units.\`);

            class Person {
              constructor(name, age) {
                this.name = name;
                this.age = age;
              }

              introduce() {
                console.log(\`Hi, my name is \${this.name} and I'm \${this.age} years old.\`);
              }
            }

            const john = new Person('John', 30);
            john.introduce();`}
          </code>
        </pre>
      </div>
      <div className="d-flex justify-content-start align-items-center gap-3 mt-2 pt-3">
        <div className="text-center">
          <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn"><ThumbUpIcon /></button>
          <div className="text-light mt-1">{likeCount}</div>
        </div>
        <div className="text-center">
          <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn"><ThumbDownIcon /></button>
          <div className="text-light mt-1">{dislikeCount}</div>
        </div>
        <div className="text-center">
          <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn"><CommentIcon /></button>
          <div className="text-light mt-1">{commentCount}</div>
        </div>
        <div className="text-center">
          <button className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn"><ShareIcon /></button>
          <div className="text-light mt-1">{shareCount}</div>
        </div>
      </div>
    </div>
  );
}
