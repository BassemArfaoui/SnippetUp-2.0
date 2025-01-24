import { useState, useRef } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import "../css/ProfilePage.css";
import { Helmet } from "react-helmet";
import React, { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Post from "../components/parts/Post";
import SpinnerSpan from "../components/tools/SpinnerSpan";
import ReplayIcon from "@mui/icons-material/Replay";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from '@mui/icons-material/Settings';import SolvedDemands from "../components/profile/SolvedDemands";
import { Box, IconButton, Modal } from "@mui/material";
import CustomTooltip from "../components/tools/CustomTooltip";

function ProfilePage() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Posts");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const userId = 1;
  const {username} = useParams()

  // Fetch profile data
  const fetchProfile = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/profile/${username}?uid=${userId}`
    );
    return response.data;
  };

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch : refetchProfile,
    isFetching: isProfileFetching,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: fetchProfile,
    keepPreviousData: false, 
    staleTime: 0, 
    cacheTime: 0, 
    refetchOnWindowFocus: false, 

  });

  const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/published/posts/${username}?uid=${userId}`,
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



  const openSettings = () => {
    setIsSettingsModalOpen(true);
  }


  const closeSettings = () => {
    setIsSettingsModalOpen(false);
  }


  return (
    <>
      <Helmet>
        <title>{`${username}`}</title>
      </Helmet>
      <div ref={containerRef} className="profile-page py-3 pb-2 px-3 ">
        {/* ProfileCard */}
        {isProfileLoading || isProfileFetching ? (
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
              uid={profileData.id}
              username={profileData.username}
              firstname={profileData.firstname}
              lastname={profileData.lastname}
              email={profileData.email}
              createdAt={profileData.created_at}
              profilePicture={profileData.profile_pic}
              subs={profileData.subs_count}
              posts={profileData.posts_count}
              credit={profileData.credit}
              subscribed={profileData.is_subscribed}
            />
          )
        )}

        {/* Shared Posts */}
        {activeTab === "Posts" && !isProfileError && !isProfileLoading && (
          <div className="mb-5">
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
                !isProfileFetching &&
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
                            profilePic={post.poster_profile_pic}
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
          </div>
        )}

        {/* solved demands */}
        {activeTab === "Solves" && <SolvedDemands    />}



        {/* settings button */}
      <CustomTooltip title="Add Snippet" placement="right">
        <IconButton id='settings'
          onClick={openSettings}
          aria-label="Scroll to End"
          className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning"
          style={{ zIndex: 1050, backgroundColor: '#f8f9fa' }}
        >
          <SettingsIcon fontSize="large" className="text-dark" />
        </IconButton>
      </CustomTooltip>


        {/* Settings Modal */}
        <Modal
        open={isSettingsModalOpen}
        onClose={closeSettings}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '16px',
            maxHeight: '90vh',
            overflowY: 'auto',
            width: '80%',
            backgroundColor: '#1E1E1E',
            color: 'white',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeSettings}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'white'
            }}
          >
            <CloseIcon className='fs-2'/>
          </IconButton>

          <h2 id="modal-title" className="snippet-title fw-bold mb-4 text-center">Settings</h2>
         
        </Box>
      </Modal>
      </div>
    </>
  );
}

export default ProfilePage;
