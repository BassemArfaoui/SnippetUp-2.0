import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Post from '../../parts/Post';
import Spinner from '../../tools/Spinner';
import '../styles/search-result.css';
import { notify } from '../../tools/CustomToaster';

function PostsSearch({ postsSearch, setShowChoice}) {
  const userId = 1;
  const limit = 10;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const lastScrollTop = useRef(0);

  const loadSearchPosts = async (searchTerm, pageNum = 1) => {
    try {
      console.log(`Loading posts for searchTerm: "${searchTerm}" on page: ${pageNum}`);
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/${userId}/search-saved-posts`, {
        params: { keyword: searchTerm, limit, page: pageNum },
      });

      if (res.data.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setSearchResults(prevResults =>
        pageNum === 1 ? res.data : [...prevResults, ...res.data]
      );
      console.log('Fetched results:', res.data);
    } catch (error) {
      notify('Error loading search results')
      console.error('Error loading search results:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (postsSearch) {
      console.log(`Search term changed: "${postsSearch}"`);
      setPage(1);
      setSearchResults([]);
      setHasMore(true);
      loadSearchPosts(postsSearch, 1);
    } else {
      setSearchResults([]);
    }
  }, [postsSearch]);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      console.log(`Loading more posts for page: ${page}`);
      loadSearchPosts(postsSearch, page);
    }
  }, [page]);

  return (
    <div
      className="search-result-container d-flex flex-column gap-4"
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        if (scrollTop > lastScrollTop.current) {
          setShowChoice(false);
        } else if (scrollTop < lastScrollTop.current) {
          setShowChoice(true);
        }

        lastScrollTop.current = scrollTop;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
          loadMorePosts();
        }
      }}
    >
      {loading && page === 1 ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner />
        </div>
      ) : (
        <>
          {searchResults.length > 0 ? (
            searchResults.map(post => (
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
                profilePic={post.poster_profile_pic}
                savedAt={post.saved_at}
                setSearchResults={setSearchResults}
              />
            ))
          ) : (
            <div className='d-flex justify-content-center ' style={{ height: '85vh' }}>
              <p className="text-center text-muted py-5 text-secondary small fw-bold fs-6 text-danger">
                <span className='text-secondary fw-bolder'> No Results for " </span> <span className='text-primary fw-bolder'> {postsSearch}</span><span className='text-secondary'> "</span>
              </p>
            </div>
          )}
          {loading && page > 1 && (
            <div className="d-flex justify-content-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!hasMore && searchResults.length > 0 && (
            <p className="text-center text-muted py-3 text-secondary small fw-bold">
              <span className='fw-bold'>No more results for " </span> <span className='text-primary fw-bolder'> {postsSearch} </span><span>"</span>
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default PostsSearch;
