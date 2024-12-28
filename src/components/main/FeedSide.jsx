import React, { useRef, useEffect } from 'react';
import './styles/Feed.css';
import Post from '../parts/Post';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CustomTooltip from '../tools/CustomTooltip';
import { useInfiniteQuery } from '@tanstack/react-query';
import AdsSideBar from '../tools/AdsSideBar';

function FeedSide() {
  const feedSideRef = useRef(null); // Reference to the feed container
  const observerRef = useRef(null); // Reference to the observer for infinite scroll
  const userId = 1;
  const limit = 10;

  // Function to fetch posts with pagination
  const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await axios.get(`http://localhost:4000/${userId}/posts`, {
      params: { limit, page: pageParam },
    });
    return response.data;
  };

  // useInfiniteQuery hook for infinite scrolling
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching, // This flag is true when refetching data
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

  // Set up Intersection Observer to detect when the loading spinner is in view
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

  // Function to handle the manual scroll down button
  const scroll = () => {
    if (feedSideRef.current) {
      const { scrollTop, clientHeight } = feedSideRef.current;
      feedSideRef.current.scrollTop = scrollTop + clientHeight / 2;
    }
  };

  // Keyboard event listener to scroll down
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
            {/* Show a loading overlay on top of the old data while refetching */}
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
                />
              ))
            )}
            {/* Observer-triggered element (Spinner for loading more posts) */}
            <div ref={observerRef} className="d-flex justify-content-center my-3">
              {isFetchingNextPage && (
                <div className="spinner-border text-primary mb-5" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
            {/* Error state */}
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

      <div className='ads-bar col-lg-0 overflow-x-hidden pe-3 pt-1'>
        <AdsSideBar />
      </div>
    </div>
  );
}

export default FeedSide;
