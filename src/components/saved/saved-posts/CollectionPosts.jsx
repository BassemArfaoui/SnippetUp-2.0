  import React, { useEffect, useRef } from 'react';
  import { useParams, Link } from 'react-router-dom';
  import { useInfiniteQuery } from '@tanstack/react-query';
  import axios from 'axios';
  import Spinner from '../../tools/Spinner';
  import '../styles/collections.css';
  import '../styles/saves.css';
  import Post from '../../parts/Post';
  import { IconButton } from '@mui/material';
  import AppsIcon from '@mui/icons-material/Apps';
  import RefreshIcon from '@mui/icons-material/Refresh';
  import CustomTooltip from '../../tools/CustomTooltip';
  import { notify } from '../../tools/CustomToaster';
  import SpinnerSpan from '../../tools/SpinnerSpan';

  function CollectionPosts() {
    const { collection } = useParams();
    const userId = 1;
    const containerRef = useRef(null);

    const fetchCollectionPosts = async ({ pageParam = 1 }) => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/${userId}/collection/posts/${collection}`, {
        params: {
          page: pageParam,
          limit: 10,
        },
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
      error,
      isFetching,
      refetch,
    } = useInfiniteQuery({
      queryKey: ['collectionPosts', collection],
      queryFn: fetchCollectionPosts,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === 10 ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: true,
    });

    useEffect(() => {
      if (isError && error) {
        notify(`Error loading ${collection} collection posts`);
      }
    }, [isError, error]);

    useEffect(() => {
      const handleScroll = () => {
        if (
          containerRef.current &&
          containerRef.current.scrollHeight - containerRef.current.scrollTop <=
          containerRef.current.clientHeight + 100 &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      };

      const containerElement = containerRef.current;
      if (containerElement) {
        containerElement.addEventListener('scroll', handleScroll);
      }

      return () => {
        if (containerElement) {
          containerElement.removeEventListener('scroll', handleScroll);
        }
      };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    function filterPosts(posts, postId) {
      return posts.filter(post => post.id !== postId);
    }
    

    if (isLoading) {
      return <Spinner />;
    }

    if (isError) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '85vh' }}>
          <IconButton
            onClick={() => refetch()}
            aria-label="Refresh"
            className="bg-primary"
            style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
          >
            <RefreshIcon style={{ fontSize: 50 }} className="text-dark" />
          </IconButton>
        </div>
      );
    }

    const hasPosts = data?.pages?.some((page) => page.length > 0);

    return (
      <div className="position-relative">
        <Link to="/saved/posts/collections">
          <CustomTooltip title="Collections list" placement="right">
            <IconButton
              variant="contained"
              aria-label="Toggle notifications"
              className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning"
              style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
            >
              <AppsIcon fontSize="large" className="text-dark" />
            </IconButton>
          </CustomTooltip>
        </Link>

    

        <div className="collections-page" ref={containerRef}>

              {/* Spinner at the top while refetching */}
          {isFetching && (
            <div className="d-flex justify-content-center align-items-center text-primary mt-3 mb-4" >
              <SpinnerSpan />
            </div>
          )}

          {hasPosts && (
            <h1 className="text-start mt-3 mb-4 fs-3 d-block fw-bold text-center">
              <span className="text-primary">{collection}</span> collection posts:
            </h1>
          )}

          <div className="posts-list d-flex flex-column gap-4 mt-4">
            {hasPosts ? (
              data?.pages?.map((page) =>
                page.map((post) => (
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
                    filterPosts={filterPosts}
                  />
                ))
              )
            ) : (
              <div
                className="text-center my-3 mt-4 mt-5 fw-bold text-secondary fs-5 d-flex justify-content-center align-items-center"
                style={{ height: '45vh' }}
              >
                <div>No posts found in <span className="text-primary">{collection}</span> collection.</div>
              </div>
            )}
          </div>

          {isFetchingNextPage && hasPosts && (
            <div className="d-flex justify-content-center my-3">
              <div className="spinner-border text-primary mb-5" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!hasNextPage && hasPosts && (
            <div className="text-center my-3 mt-4 small fw-bold text-secondary">
              No more posts in <span className="text-primary">{collection}</span> collection.
            </div>
          )}
        </div>
      </div>
    );
  }

  export default CollectionPosts;
