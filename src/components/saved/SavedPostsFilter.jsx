import React, { useEffect, useRef } from 'react';
import './styles/filter-result.css';
import Post from '../parts/Post';

function SavedPostsFilter({ filteredPosts, hasMoreFilteredPosts, loadMoreFilteredPosts, cancelFilter ,setFilteredPosts ,setShowChoice }) {
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
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        if (scrollTop > lastScrollTop.current) {
          setShowChoice(false);
        } else if (scrollTop < lastScrollTop.current) {
          setShowChoice(true);
        }

        lastScrollTop.current = scrollTop;}}

      
        >
      {filteredPosts.length === 0 ? (
        <p>No saved posts found with the current filters.</p>
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

      {hasMoreFilteredPosts && (
        <button onClick={loadMoreFilteredPosts}>Load More</button>
      )}

      {/* Cancel Filter Button */}
      <div className='cancel-filter-container'>
        <button onClick={cancelFilter} className='cancel-filter-button'>
          Cancel Filter
        </button>
      </div>
    </div>
  );
}

export default SavedPostsFilter;
