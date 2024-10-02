import React, { useEffect, useRef } from 'react';
import './styles/filter-result.css';
import Post from '../parts/Post';
import CustomTooltip from '../tools/CustomTooltip';
import { IconButton } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';




function SavedPostsFilter({ filteredPosts, hasMoreFilteredPosts, loadMoreFilteredPosts, cancelFilter ,setFilteredPosts , showChoice , setShowChoice ,filterLoading }) {
  const containerRef = useRef(null);
  const lastScrollTop = useRef(0);

  // Function to handle scroll
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 10 && hasMoreFilteredPosts) {
        loadMoreFilteredPosts();
      }
    }
  };

  useEffect(() => {
    if(showChoice === false)
    {
      setShowChoice(true)
    }},[])

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasMoreFilteredPosts, loadMoreFilteredPosts]);

  return (
    <div className='search-result-container d-flex flex-column gap-3' ref={containerRef}
          onScroll={(e) => {
        const { scrollTop} = e.target;

        if (scrollTop > lastScrollTop.current) {
          setShowChoice(false);
        } else if (scrollTop < lastScrollTop.current) {
          setShowChoice(true);
        }

        lastScrollTop.current = scrollTop;}}

      
        >
      {filteredPosts.length === 0 ? (
        <p className='text-center text-danger mt-5 fw-bolder fs-5'>No Results for those Filters</p>
      ) : (
        filteredPosts.map((post) => (
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
              isLiked={post.is_liked}
              isDisliked={post.is_disliked}
              isSaved={post.is_saved}
              isInterested={post.is_interested}
              githubLink={post.github_link}
              firstname={post.poster_firstname}
              lastname={post.poster_lastname}
              username={post.poster_username}
              savedAt={post.saved_at}
              setFilteredPosts={setFilteredPosts}
            />
        ))
      )}



      {
        filterLoading && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )
      }


      {
        !filterLoading && hasMoreFilteredPosts === false && filteredPosts.length >0  && (
          <p className="text-center text-muted py-3 text-secondary small fw-bold">
            No More Results
          </p>
        )}


      {/* Cancel Filter Button */}
      <div className='cancel-filter-container'>
          <CustomTooltip title='Cancel Filters' placement='right'>
            <IconButton
              variant="contained"
              onClick={cancelFilter}
              aria-label="Toggle notifications"
              className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning"
              style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
            >
              <BlockIcon  fontSize="large" className="text-dark"/>
            </IconButton>
          </CustomTooltip>
      </div>
    </div>
  );
}

export default SavedPostsFilter;
