import React, { useRef, useEffect } from 'react';
import './styles/Feed.css';
import Post from '../parts/Post';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CustomTooltip from '../tools/CustomTooltip';
import { useInfiniteQuery } from '@tanstack/react-query';

function FeedSide({user}) {
  const feedSideRef = useRef(null); 
  const observerRef = useRef(null); 
  const userId = user.id;
  const limit = 10;

  const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/${userId}/posts`, {
      params: { limit, page: pageParam },
    });
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching, 
    refetch : refetchFeed , 
  } = useInfiniteQuery({
    queryKey: ['posts', userId],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.length + 1 : undefined;
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus:false ,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  const scroll = () => {
    if (feedSideRef.current) {
      const { scrollTop, clientHeight } = feedSideRef.current;
      feedSideRef.current.scrollTop = scrollTop + clientHeight / 2;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        scroll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='feed-cont row overflow-x-hidden'>
      <div className="col-lg-12 p-0">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="feed-side d-flex flex-column gap-2" ref={feedSideRef}>
            <div className="pt-3"></div>
              {isFetching && (
                <div className="d-flex justify-content-center my-3 mb-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
              )}
            {data?.pages.map((page, pageIndex) =>
              page.map((post, postIndex) => (
                <Post
                  key={`${post.id}-${pageIndex}-${postIndex}`}
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
                  isLiked={post.isLiked}
                  isDisliked={post.isDisliked}
                  isSaved={post.isSaved}
                  isInterested={post.isInterested}
                  githubLink={post.github_link}
                  firstname={post.poster_firstname}
                  lastname={post.poster_lastname}
                  username={post.poster_username}
                  profilePic={post.poster_profile_pic}
                  refetchFeed={refetchFeed}
                />
              ))
            )}
            <div ref={observerRef} className="d-flex justify-content-center my-3">
              {isFetchingNextPage && (
                <div className="spinner-border text-primary mb-5" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
            {isError && (
              <div className="d-flex justify-content-center">
                <p>Error loading posts. Please try again.</p>
              </div>
            )}
          </div>
        )}
        <CustomTooltip title="Scroll Down" placement="right">
          <IconButton
            onClick={scroll}
            aria-label="Scroll to End"
            className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning"
            style={{ zIndex: 1050, backgroundColor: '#f8f9fa' }}
          >
            <ArrowDownwardIcon fontSize="large" className="text-dark" />
          </IconButton>
        </CustomTooltip>
      </div>

    </div>
  );
}

export default FeedSide;
