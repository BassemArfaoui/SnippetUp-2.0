import React, { useState, useEffect, useCallback } from 'react';
import profile_pic from '../../imgs/profile_pic.jpg';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { BiSolidCommentDetail } from 'react-icons/bi';
import { FaReply } from 'react-icons/fa';
import CommentReply from './CommentReply';
import axios from 'axios';
import { CircularProgress, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { notify } from '../tools/CustomToaster';

function Comment(props) {
    const [commentReact, setCommentReact] = useState('none');
    const [likeCount, setLikeCount] = useState(props.likeCount);
    const [dislikeCount, setDislikeCount] = useState(props.dislikeCount);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [repliesCount, setRepliesCount] = useState(0);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [hasMoreReplies, setHasMoreReplies] = useState(true);
    const [repliesPage, setRepliesPage] = useState(1);
    const limit = 3; 
    const userId = 1;

    useEffect(() => {
        if (props.isLiked) {
            setCommentReact('like');
        } else if (props.isDisliked) {
            setCommentReact('dislike');
        }
    }, [props.isLiked, props.isDisliked]);

    useEffect(() => {
        const updateRepliesTotal = async () => 
        {
            try 
            {
                const response = await axios.get(`http://localhost:4000/comments/${props.id}/repliesCount`);
                setRepliesCount(response.data.totalReplies);
            }
            catch(err)
            {
                notify('Error updating replies total')
            }
        }

        updateRepliesTotal();
        fetchReplies();
    }, []);

    const fetchReplies = useCallback(async () => {
        if (loadingReplies) return;

        setLoadingReplies(true);
        try {
            const response = await axios.get(`http://localhost:4000/comments/${props.id}/replies`, {
                params: {
                    limit: limit,
                    offset: (repliesPage - 1) * limit
                }
            });

            if (response.data.replies.length < limit) {
                setHasMoreReplies(false);
            }

            setReplies(prevReplies => [...prevReplies, ...response.data.replies]);
            setRepliesPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error('Error fetching replies:', error);
        } finally {
            setLoadingReplies(false);
        }
    }, [loadingReplies, repliesPage, props.id]);


    
    const seeReplies = () => {
        
        if (repliesCount > 0 ) {
            setShowReplies(true);
        }
      
    };

    const hideReplies = () => {
        setShowReplies(false);
    };

    const likeComment = async () => {
        try {
            if (commentReact === 'dislike') {
                await undislikeComment();
            }
            await axios.get(`http://localhost:4000/likeComment/${userId}/${props.id}`);
            setCommentReact('like');
            setLikeCount(prev => prev + 1);
        } catch (err) {
            console.error("Couldn't like the comment", err);
        }
    };

    const unlikeComment = async () => {
        try {
            await axios.get(`http://localhost:4000/unlikeComment/${userId}/${props.id}`);
            setCommentReact('none');
            setLikeCount(prev => prev - 1);
        } catch (err) {
            console.error("Couldn't unlike the comment", err);
        }
    };

    const dislikeComment = async () => {
        try {
            if (commentReact === 'like') {
                await unlikeComment();
            }
            await axios.get(`http://localhost:4000/dislikeComment/${userId}/${props.id}`);
            setCommentReact('dislike');
            setDislikeCount(prev => prev + 1);
        } catch (err) {
            console.error("Couldn't dislike the comment", err);
        }
    };

    const undislikeComment = async () => {
        try {
            await axios.get(`http://localhost:4000/undislikeComment/${userId}/${props.id}`);
            setCommentReact('none');
            setDislikeCount(prev => prev - 1);
        } catch (err) {
            console.error("Couldn't undislike the comment", err);
        }
    };

    const timeSince = (time) => {
        const now = new Date();
        const timeDiff = now - new Date(time);

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        }
    };

    const handleReplyClick =() =>
    {
        props.updateCommentToReply
        ({
            commentId: props.id,
            commentorName : props.firstname + ' ' + props.lastname
        })
    }

    return (
        <div id="comment" className="comment rounded-4 pb-3 pt-3 px-3 fs-5 position-relative" style={{ whiteSpace: 'pre-wrap' }}>
            <div className="d-flex align-items-center mb-2">
                <div className="poster-info d-flex align-items-center gap-2">
                    <div className="avatar">
                        <img
                            src={profile_pic}
                            alt="user"
                            className="rounded-circle"
                            style={{ width: '45px', height: '45px' }}
                        />
                    </div>
                    <div>
                        <div className="text-white fs-4 fw-bolder d-flex align-items-center m-0 p-0">
                            <span className="commentor_name p-0 m-0 text-dark">{props.firstname + ' ' + props.lastname}<span className='text-secondary small'> ({props.time})</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='comment-content fs-5'>
                <div className='comment-content ms-2 mb-2 pe-3 border border-2 border-dark rounded-4 py-2 px-3'>
                    {props.content}
                </div>
            </div>

            <span className='reactions d-flex justify-content-start gap-3 align-items-center px-3 ms-5'>
                <span className='d-flex align-items-center'>
                    {commentReact === 'like' ?
                        <span onClick={unlikeComment} className='d-flex align-items-center'>
                            <span className='comment-num m-0 p-0 mt-2 me-1 text-primary'>{likeCount}</span>
                            <span className='text-primary'><ThumbUpAltIcon /></span>
                        </span>
                        :
                        <span onClick={likeComment} className='d-flex align-items-center'>
                            <span className='comment-num m-0 p-0 mt-2 mb-0 me-1'>{likeCount}</span>
                            <span><ThumbUpAltIcon /></span>
                        </span>
                    }
                </span>

                <span className='d-flex align-items-center gap-1'>
                    {commentReact === 'dislike' ?
                        <span onClick={undislikeComment}>
                            <span className='comment-num m-0 p-0 mt-2 me-1 text-danger'>{dislikeCount}</span>
                            <span className='text-danger'><ThumbDownAltIcon /></span>
                        </span>
                        :
                        <span onClick={dislikeComment}>
                            <span className='comment-num m-0 p-0 mt-2 me-1'>{dislikeCount}</span>
                            <span><ThumbDownAltIcon /></span>
                        </span>
                    }
                </span>

                <span className='d-flex align-items-center gap-1'>
                    {!showReplies ?
                        <span onClick={seeReplies}>
                            <span className='comment-num m-0 p-0 mt-1 me-1'>{repliesCount}</span>
                            <span><BiSolidCommentDetail /></span>
                        </span>
                        :
                        <span onClick={hideReplies}>
                            <span className='comment-num m-0 p-0 mt-1 me-1 text-secondary'>{repliesCount}</span>
                            <span className='text-secondary'><BiSolidCommentDetail /></span>
                        </span>
                    }
                </span>

                <span className='reply-btn ms-2' onClick={handleReplyClick}><FaReply /></span>
            </span>

            {showReplies && (
                <div className='replies d-flex flex-column gap-2 ms-5 mt-3'>
                    {replies.map((reply,index) => (
                        <CommentReply
                            key={reply.id}
                            id={reply.id}
                            fullname={reply.firstname + ' ' + reply.lastname}
                            content={reply.content}
                            time={reply.commented_at}
                            likeCount={reply.like_count}
                            dislikeCount={reply.dislike_count}
                            isLiked={reply.liked}
                            isDisliked={reply.disliked}
                            timeSince={timeSince(reply.commented_at)}
                        />
                    ))}

                    {loadingReplies && (
                        <div className="d-flex justify-content-center my-3">
                            <CircularProgress color="primary" />
                        </div>
                    )}

                    {!hasMoreReplies && !loadingReplies && (
                        <div className="d-flex justify-content-center my-3 fw-bold small">
                            <p className='small text-secondary '>No more replies</p>
                        </div>
                    )}

                    {hasMoreReplies && !loadingReplies && (
                        <div className="d-flex justify-content-center my-3">
                            <IconButton onClick={fetchReplies} aria-label="Load More">
                                <ExpandMoreIcon className='text-primary' style={{ fontSize: '62px' }} />
                            </IconButton>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Comment;
