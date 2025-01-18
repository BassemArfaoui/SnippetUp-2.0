import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/parts/Post';
import '../css/PostPage.css'
import Spinner from '../components/tools/Spinner';
import { Helmet } from 'react-helmet';


function PostPage() {
  const { postId } = useParams(); // get postId from the URL
  const [post, setPost] = useState(null); // state to hold the post data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/post/${postId}`);
        setPost(response.data); 
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching post data');
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]); 

  if (loading) {
    return <div><Spinner/></div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className='post-container px-3 '>
      <Helmet>
        <title>{`SnippetUp : ${post.title}`}</title>
      </Helmet>
      <div className='px-4 my-4 mb-5'>
          {post && (
            <Post
              key={post.id}
              id={post.id}
              title={post.title}
              snippet={post.snippet}
              description={post.description}
              posterId={post.poster_id}
              language={post.language}
              likeCount={post.like_count}
              dislikeCount={post.dislike_count}
              commentCount={post.comment_count}
              shareCount={post.share_count}
              isLiked={false}
              isDisliked={false}
              isSaved={false}
              isInterested={false}
              firstname={post.firstname}
              lastname={post.lastname}
              username={post.username}
              githubLink={post.github_link}
            />
          )}
      </div>
    </div>
  );
}

export default PostPage;
