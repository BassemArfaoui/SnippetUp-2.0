import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Post from "../parts/Post";
import SpinnerSpan from '../tools/SpinnerSpan';

function SharedPosts({ containerRef }) {
  const userId = 1; // User ID (could be dynamic or from authentication context)
  const lastScrollTop = useRef(0);
  const scrollThreshold = 40;

  const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/published/posts/${userId}`,
      {
        params: {
          page: pageParam,
          limit: 10,
        },
      }
    );
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
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.posts.length === 10 ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isError && error) {
      console.error("Error loading posts:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight;
      const clientHeight = containerRef.current.clientHeight;

      if (
        scrollHeight - scrollTop <= clientHeight + 150 &&
        hasNextPage && 
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    const sharedPostsElement = containerRef.current;
    if (sharedPostsElement) {
      sharedPostsElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (sharedPostsElement) {
        sharedPostsElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading posts!</div>;
  }

  return (
    <div className="d-flex flex-column align-items-stretch gap-3 m-0 mt-2" ref={containerRef}>
      {data?.pages?.length > 0 ? (
        data.pages.map((page) => {
          if (Array.isArray(page.posts)) {
            return page.posts.map((post) => (
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
                isLiked={post.isLiked}
                isDisliked={post.isDisliked}
                isSaved={post.isSaved}
                isInterested={post.isInterested}
                githubLink={post.github_link}
                firstname={post.poster_firstname}
                lastname={post.poster_lastname}
                username={post.poster_username}
              />
            ));
          }
          return null;
        })
      ) : (
        <div>No posts available</div>
      )}

      {isFetchingNextPage && <SpinnerSpan />}
    </div>
  );
}

export default SharedPosts;
