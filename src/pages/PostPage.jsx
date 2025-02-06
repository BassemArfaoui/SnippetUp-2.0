import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Post from '../components/parts/Post';
import '../css/PostPage.css';
import Spinner from '../components/tools/Spinner';
import { Helmet } from 'react-helmet';
import userContext from '../components/contexts/userContext';
import nodata from '../utils/svg/nodata.svg';

const fetchPost = async (postId) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/post/${postId}`);
  return response.data;
};

function PostPage() {
  const { user } = useContext(userContext);
  const { postId } = useParams();
  
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
    retry: false,
  });

  if (isLoading) {
    return <div><Spinner /></div>;
  }

  return (
    <div className='post-container px-3'>
      <Helmet>
        <title>{`SnippetUp : ${post?.title || 'Post'}`}</title>
      </Helmet>
      <div className='px-4 my-4 mb-5'>
        {!isError ? (
          post && (
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
              profilePic={post.profile_pic}
              firstname={post.firstname}
              lastname={post.lastname}
              username={post.username}
              githubLink={post.github_link}
            />
          )
        ) : (
          <div className='pt-5'>
            <div className='m-0 p-0 mt-5 text-danger text-center fw-bold' style={{ fontSize: '20px' }}>
              We Couldn't Load the Requested Post!
            </div>
            <div className="d-flex justify-content-center mt-3">
              <p className="fw-bolder text-secondary m-0 fs-6 mb-4 text-center mb-4" style={{width :'400px'}}>
                this usually happens because of a connection problem  or the post doesn't exist or deleted
              </p>
            </div>
            <div className='w-100 d-flex justify-content-center mt-4'>
              <img src={nodata} alt='no data illustration' style={{ width: '150px' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostPage;
