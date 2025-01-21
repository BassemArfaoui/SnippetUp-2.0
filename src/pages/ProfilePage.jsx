import { useState, useRef } from "react";
import ProfileBody from "../components/profile/ProfileBody";
import ProfileCard from "../components/profile/ProfileCard";
import "../css/ProfilePage.css";
import { Helmet } from "react-helmet";
import React, { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Post from "../components/parts/Post";
import SpinnerSpan from "../components/tools/SpinnerSpan";
import MoreInfos from "../components/profile/MoreInfos";
import ReplayIcon from "@mui/icons-material/Replay";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";

function ProfilePage() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Posts");
  const userId = 1;

  // Fetch profile data
  const fetchProfile = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/profile/${userId}`
    );
    return response.data;
  };

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch : refetchProfile,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: fetchProfile,
  });

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
    refetch : refetchPosts,
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

  return (
    <>
      <Helmet>
        <title>SnippetUp : Profile</title>
      </Helmet>
      <div ref={containerRef} className="profile-page py-3 pb-2 px-3 ">
        {/* ProfileCard */}
        {isProfileLoading ? (
          <ProfileSkeleton />
        ) : isProfileError ? (
          <div>
            <p className="fw-bolder text-danger fs-5 mt-5 text-center mb-4">
              Couldn't load the profile
            </p>
            <div className="d-flex justify-content-center">
              <button
                onClick={() => refetchProfile()}
                className="btn btn-primary rounded-5 d-flex align-items-center justify-content-center p-3"
                style={{ width: "40px", height: "40px" }}
              >
                <ReplayIcon />
              </button>
            </div>
          </div>
        ) : (
          profileData && (
            <ProfileCard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              username={profileData.username}
              firstname={profileData.firstname}
              lastname={profileData.lastname}
              email={profileData.email}
              createdAt={profileData.created_at}
              profilePicture={profileData.profile_pic}
              subs={profileData.subs_count}
              posts={profileData.posts_count}
              credit={profileData.credit}
            />
          )
        )}

        {/* Shared Posts */}
        <div className="mb-5">
          {activeTab === "Posts" && !isProfileError && !isProfileLoading &&  (
            <div className="d-flex flex-column align-items-stretch gap-3 m-0 mt-3 px-1">
              {/* Loading State */}
              {isLoading && (
                <div className="d-flex justify-content-center align-items-center my-5">
                  <SpinnerSpan />
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="text-center text-danger my-5 d-flex flex-column justify-content-center">
                  <p className="fw-bolder text-danger fs-5">
                    Couldn't load the posts
                  </p>
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={() => refetchPosts()}
                      className="btn btn-primary rounded-5 d-flex align-items-center justify-content-center p-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <ReplayIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Posts */}
              {!isLoading &&
                !isError && 
                (data?.pages?.length > 0 &&
                data.pages.some((page) => page.posts.length > 0) ? (
                  data.pages.map((page) =>
                    Array.isArray(page.posts)
                      ? page.posts.map((post) => (
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
                            refetchPosts={refetchPosts}
                            refetchProfile={refetchProfile}
                          />
                        ))
                      : null
                  )
                ) : (
                  <p className="fw-bolder text-secondary fs-5 my-5 text-center">
                    No Posts Yet !
                  </p>
                ))}

              {/* Fetching More State */}
              {isFetchingNextPage && (
                <div className="d-flex justify-content-center my-3">
                  <SpinnerSpan />
                </div>
              )}
            </div>
          )}
        </div>

        {/* More Infos */}
        {activeTab === "Infos" && <MoreInfos />}
      </div>
    </>
  );
}

export default ProfilePage;
