import React, { lazy, Suspense, useState, useEffect,  useRef , useContext } from "react";
import InfoTooltip from "../tools/InfoTooltip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./styles/Post.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTooltip from "../tools/CustomTooltip";
import { successNotify, notify } from "../tools/CustomToaster";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CodeHighlighter from "../tools/CodeHighliter";
import { FaFacebook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaLink } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import api from "../tools/api";
import SpinnerSpan from "../tools/SpinnerSpan";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../tools/styles/driver.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation , Link } from "react-router-dom";
import userContext from "../contexts/userContext";


const CommentSection = lazy(() => import("./CommentSection"));

export default function Post(props) {
  const {user}= useContext(userContext) ;
  const userId=user.id ;
  const profile_pic = props.profilePic ;

  const location = useLocation();
  const optionsRef = useRef(null)
  

  //bool states
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isInterested, setisInterested] = useState(false);
  const [isFullScreen, setisFullScreen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [subLoading, setSubLoading] = useState(false);



  //post states
  const [snippetCode, setSnippetCode] = useState(props.snippet);
  const [snippetTitle, setSnippetTitle] = useState(props.title);
  const [snippetDescription, setSnippetDescription] = useState(
    props.description
  );
  const [language, setLanguage] = useState(props.language);
  const [gitHubLink, setGitHubLink] = useState(props.githubLink);
  const [collection, setCollection] = useState("");

  //data states
  const [editData, setEditData] = useState({
    title: snippetTitle,
    content: snippetCode,
    language: language,
  });
  const [optionalData, setOptionalData] = useState({
    description: snippetDescription,
    gitHubLink: gitHubLink,
  });
  const [stage, setStage] = useState(1);


  //reactions counts
  const [react, setReact] = useState("none");
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [dislikeCount, setDislikeCount] = useState(props.dislikeCount);
  const [commentCount, setCommentCount] = useState(props.commentCount);
  const [shareCount, setShareCount] = useState(props.shareCount);



  useEffect(() => {
    if (props.isLiked) {
      setReact("like");
    } else if (props.isDisliked) {
      setReact("dislike");
    }

    if (props.isSaved) {
      setIsSaved(true);
    }

    if (props.isInterested) {
      setisInterested(true);
    }
  }, [props.isLiked, props.isDisliked, props.isSaved, props.isInterested]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);



  const incrementCommentCount = () => {
    setCommentCount((prev) => parseInt(prev) + 1);
  };

  const openOptions = () => {
    setShowOptions(true);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOptionalDataChange = (e) => {
    const { name, value } = e.target;
    setOptionalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit =async () =>
  {
    if(editData.title.trim() && editData.content.trim() && editData.language.trim())
    {
      try{
        setEditLoading(true)
        await api.put(`/edit-post/${props.id}`,{...editData, ...optionalData})

           setSnippetCode(editData.content)
           setSnippetTitle(editData.title)
           setSnippetDescription(optionalData.description)
           setLanguage(editData.language)
          setGitHubLink(optionalData.gitHubLink)
           
  

        setStage(1)
        setEditLoading(false)
        closeOptions()
        closeEditModal();

        successNotify('Post Updated Successfully')
      }
      catch(err)
      {
        notify('Something Went Wrong')
        setEditLoading(false)
        setStage(1)
      }
    }else{
      notify('All fields are required')
    }
  }

  const nextStage = () => {
    if (
      editData.title.trim() &&
      editData.content.trim() &&
      editData.language.trim()
    ) {
      setStage(2);
    } else {
      notify("All fields are required");
    }
  };

  const openConfirmModal = () => {
    closeOptions();
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const deletePost = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(
        `/delete-post/${props.id}`
      );
      if (props.refetchPosts && props.refetchProfile) {
        await props.refetchPosts();
        await props.refetchProfile();}
        
      if (location.pathname === "/") {
        await props.refetchFeed();
      }

      if (props.refetchcollectionPosts) {
        await props.refetchcollectionPosts();
      }

      if (props.setSavedPosts) {
        props.setSavedPosts((prev) => {
          return prev.filter((post) => post.id !== props.id);
        });
      }
      if (props.setSearchResults) {
        props.setSearchResults((prev) => {
          return prev.filter((post) => post.id !== props.id);
        });
      }

      if (props.setFilteredPosts) {
        props.setFilteredPosts((prev) => {
          return prev.filter((post) => post.id !== props.id);
        });
      }
      setDeleteLoading(false);
      setIsConfirmModalOpen(false);
      successNotify("Post Deleted Successfully");
    } catch (err) {
      setDeleteLoading(false);
      console.log(err)
      notify("Couldn't Delete the Post");
    }
  };

  const addComment = async (content, is_reply, reply_to_id) => {
    try {
      const data = {
        userId: userId,
        postId: props.id,
        content: content,
        isReply: is_reply,
        replyToId: reply_to_id,
      };
      await api.post(`/add-comment`, data);
    } catch (err) {
      console.log(err);
      notify("Couldn't Add the Comment");
    }
  };

  const skipCollection = async () => {
    try {
      setIsSaving(true);
      await api.get(
        `/save/${props.id}`
      );
      setIsSaving(false);
      setIsSaved(true);
      successNotify("Snippet Saved");
    } catch (err) {
      setIsSaving(false);
      notify("Couldn't save the Snippet");
    }
  };

  const unsaveSnippet = async () => {
    try {
      setIsUnsaving(true);
      await api.get(
        `/unsave/${props.id}`
      );
      setIsUnsaving(false);
      setIsSaved(false);

      if (props.refetchcollectionPosts) {
        await props.refetchcollectionPosts();
      }

      if (props.setSavedPosts) {
        props.setSavedPosts((prev) => {
          return prev.filter((post) => post.id !== props.id);
        });
      }
      if (props.setSearchResults) {
        props.setSearchResults((prev) => {
          return prev.filter((post) => post.id !== props.id);
        });
      }

      if (props.setFilteredPosts) {
        props.setFilteredPosts((prev) => {
          return prev.filter((post) => post.id !== props.id);
        });
      }

      successNotify("Snippet Unsaved");
    } catch (err) {
      setIsUnsaving(false);
      notify("Couldn't unsave the Snippet");
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippetCode);
      setIsCopied(true);
      successNotify("Snippet Copied");
      setTimeout(() => {
        setIsCopied(false);
      }, 1600);
    } catch (err) {
      console.log(err);
      notify("Couldn't Copy");
    }
  };

  const subscribe = async () => {
    try {
      setSubLoading(true);
      await api.get(
        `/sub/${props.posterId}`
      );
      setSubLoading(false);
      setisInterested(true);
      successNotify(
        `You are now Subscribed to ${
          props.firstname + " " + props.lastname
        }`
      );
    } catch (err) {
      notify(`Couldn't subscribe`);
    }
  };

  const unsubscribe = async () => {
    try {
      setSubLoading(true);
      await api.get(
        `/unsub/${props.posterId}`
      );
      setSubLoading(false);
      setisInterested(false);
      successNotify(
        `No Longer Subscribed to  ${
          props.firstname + " " + props.lastname
        }`
      );
    } catch (err) {
      notify(`Couldn't unsubscribe`);
    }
  };

  const likeSnippet = async () => {
    try {
      if (react === "dislike") {
        await undislikeSnippet();
      }
       await api.get(
        `/like/${props.id}`
      );
      setReact("like");
      setLikeCount((prev) => parseInt(prev) + 1);
    } catch (err) {
      notify("Couldn't like the Post");
    }
  };

  const unlikeSnippet = async () => {
    try {
       await api.get(
        `/unlike/${props.id}`
      );
      setReact("none");
      setLikeCount((prev) => parseInt(prev) - 1);
    } catch (err) {
      notify("Couldn't unlike the Post");
    }
  };

  const dislikeSnippet = async () => {
    try {
      if (react === "like") {
        await unlikeSnippet();
      }

      await api.get(
        `/dislike/${props.id}`
      );

      setReact("dislike");
      setDislikeCount((prev) => parseInt(prev) + 1);
    } catch (err) {
      notify("Couldn't dislike the Post");
    }
  };

  const undislikeSnippet = async () => {
    try {
      await api.get(
        `/undislike/${props.id}`
      );

      setReact("none");
      setDislikeCount((prev) => parseInt(prev) - 1);
    } catch (err) {
      notify("Couldn't undislike the Post");
    }
  };

  const openFullScreen = () => {
    setisFullScreen(true);
  };

  const closeFullScreen = () => {
    setisFullScreen(false);
  };

  const openDescription = () => {
    setIsDescriptionOpen(true);
  };

  const closeDescription = () => {
    setIsDescriptionOpen(false);
  };

  const openComments = () => {
    setIsCommentsOpen(true);
  };

  const closeComments = () => {
    setIsCommentsOpen(false);
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const copyLink = (link) => {
    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(link);
        successNotify("Link copied to clipboard");
      } catch (err) {
        console.error("Couldn't copy the Link");
        console.log(err);
      }
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      successNotify("Link copied to clipboard");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const closeCollectionModal = () => {
    skipCollection();
    setIsCollectionModalOpen(false);
  };

  const openCollectionModal = () => {
    setIsCollectionModalOpen(true);
  };

  const collectionChanged = (e) => {
    setCollection(e.target.value);
  };

  const saveToCollection = async (e) => {
    e.preventDefault();
    if (collection) {
      try {
        setIsCollectionModalOpen(false);
        setIsSaving(true);
        await api.get(
          `/save/${props.id}?collection=${collection}`
        );
        setIsSaving(false);
        setIsSaved(true);
        setCollection("");

        successNotify("Snippet Saved");
      } catch (err) {
        setIsSaving(false);
        notify("Couldn't save the Snippet");
      }
    } else {
      notify("Can't Add an Empty Collection");
    }
  };

  function startGuide() {
    const steps = [
      {
        element: "#interested-btn",
        popover: {
          title: "Follow Content",
          description:
            "subscribe to this author to see more of their posts in your feed.",
        },
      },
      {
        element: "#language-btn",
        popover: {
          title: "Programming Language",
          description:
            "Displays the programming language or framework used in the snippet.",
        },
      },
      {
        element: "#snippet-title",
        popover: {
          title: "Post Title",
          description: "This section displays the title of the code snippet.",
        },
      },
      {
        element: "#fullscreen-btn",
        popover: {
          title: "Enter Full Screen",
          description:
            "Expand the snippet to full screen for an enhanced viewing experience.",
        },
      },
      {
        element: "#copy-btn",
        popover: {
          title: "Copy Code",
          description:
            "Quickly copy the code to your clipboard for immediate use.",
        },
      },
      {
        element: "#save-btn",
        popover: {
          title: "Save Snippet",
          description: "Bookmark this snippet to easily access it later.",
        },
      },
      {
        element: "#desc-btn",
        popover: {
          title: "Code Description",
          description:
            "A brief explanation of the code, including its purpose and required dependencies.",
        },
      },
      {
        element: "#code-block",
        popover: {
          title: "Code Snippet",
          description:
            "The full code snippet is displayed here with syntax highlighting for clarity.",
        },
      },
      {
        element: "#like-btn",
        popover: {
          title: "Like This Post",
          description:
            "Found this post helpful? Show your appreciation by liking it.",
        },
      },
      {
        element: "#dislike-btn",
        popover: {
          title: "Dislike This Post",
          description:
            "If this post has issues or doesn't work as expected, flag it by disliking.",
        },
      },
      {
        element: "#comment-btn",
        popover: {
          title: "Leave a Comment",
          description:
            "Have feedback or questions? Share your thoughts in the comments section.",
        },
      },
      {
        element: "#share-btn",
        popover: {
          title: "Share This Post",
          description:
            "Think this post might benefit others? Share it with your network.",
        },
      },
    ];

    if (gitHubLink) {
      steps.push({
        element: "#gitub-btn",
        popover: {
          title: "Github Repository",
          description:
            "View the associated GitHub repository for additional resources and information.",
        },
      });
    }

    if (props.savedAt) {
      steps.push({
        element: "#saved-at",
        popover: {
          title: "Saved At",
          description: "Displays the exact time you saved this Post",
        },
      });
    }

    //driver
    const driverObj = driver({
      showProgress: true,
      steps: steps,
    });

    driverObj.drive();
  }

  return (
    <div className="position-relative">
      <div className="post rounded-4 p-4">
        {/* Post Header */}
        <div className="d-flex align-items-center justify-content-between mb-0">
          <div className="d-flex align-items-center gap-3">
            <Link
              to={`/${props.username}`}
              className="text-decoration-none text-dark"
            >
              <div className="avatar">
                <img
                  src={profile_pic}
                  alt="user"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </Link>
            <div>
              <div className="text-white fs-5 fw-bolder d-flex align-items-center m-0 p-0">
                <Link
                  to={`/${props.username}`}
                  className="text-decoration-none text-light"
                >
                  <span className="p-0 m-0">
                    {props.firstname + " " + props.lastname}
                  </span>
                </Link>
                {props.posterId !== userId && !props.refetchProfile && (
                  <span id="interested-btn" className="ms-3 mb-1">
                    {!subLoading ? (
                      !isInterested ? (
                        <span
                          className="text-light p-0 mb-1  intrested-icon"
                          onClick={subscribe}
                        >
                          <CustomTooltip title="Subscribe" placement="top">
                            <StarBorderIcon style={{ fontSize: "26px" }} />
                          </CustomTooltip>
                        </span>
                      ) : (
                        <span
                          className="text-primary p-0 mb-1 intrested-icon"
                          onClick={unsubscribe}
                        >
                          <CustomTooltip title="Unsubscribe" placement="top">
                            <StarIcon style={{ fontSize: "26px" }} />
                          </CustomTooltip>
                        </span>
                      )
                    ) : (
                      <span className="text-light ">
                        <SpinnerSpan
                          color="text-primary"
                          spanStyle={{ width: "20px", height: "20px" }}
                        />
                      </span>
                    )}
                  </span>
                )}
              </div>
              <Link to={`/${props.username}`} className="text-decoration-none">
                <div className="text-secondary fs-6">@{props.username}</div>
              </Link>
            </div>
          </div>
          <div
            id="language-btn"
            className="px-2 py-1 bg-secondary fs-6 fw-bold text-light rounded"
          >
            {language}
          </div>
        </div>

        {/* Snippet Title and Buttons */}
        <div className="d-flex flex-column gap-1 align-items-center justify-content-between mb-3">
          <h3
            id="snippet-title"
            className="snippet-title fw-bold text-center fs-6"
          >
            {snippetTitle}
          </h3>
          <div className="buttons align-self-end d-flex gap-3 align-items-center">
            {/*github proj link*/}
            {gitHubLink && (
              <CustomTooltip title="See Related Repo" placement="top">
                <a
                  id="gitub-btn"
                  target="_blank"
                  href={gitHubLink}
                  className="btn btn-outline-light post-btn"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon style={{ fontSize: "22px" }} />
                </a>
              </CustomTooltip>
            )}

            {/* Description Button */}
            <CustomTooltip title="Description" placement="top">
              <button
                id="desc-btn"
                className="btn btn-outline-light post-btn"
                onClick={openDescription}
              >
                <LightbulbIcon style={{ fontSize: "22px" }} />
              </button>
            </CustomTooltip>

            {/* Save, Copy, and Fullscreen Buttons */}
            <span id="save-btn">
              {isSaved ? (
                !isUnsaving ? (
                  <button
                    className="btn btn-outline-primary post-btn"
                    onClick={unsaveSnippet}
                  >
                    <BookmarkAddedIcon style={{ fontSize: "22px" }} />
                  </button>
                ) : (
                  <CustomTooltip title="Unsaving..." placement="top">
                    <button className="btn btn-outline-light post-btn">
                      <SpinnerSpan
                        color="text-primary"
                        spanStyle={{ width: "22px", height: "22px" }}
                      />
                    </button>
                  </CustomTooltip>
                )
              ) : !isSaving ? (
                <CustomTooltip title="Save Snippet" placement="top">
                  <button
                    className="btn btn-outline-light post-btn"
                    onClick={openCollectionModal}
                  >
                    <BookmarkAddIcon style={{ fontSize: "22px" }} />
                  </button>
                </CustomTooltip>
              ) : (
                <CustomTooltip title="Saving..." placement="top">
                  <button className="btn btn-outline-light post-btn">
                    <SpinnerSpan
                      color="text-primary"
                      spanStyle={{ width: "22px", height: "22px" }}
                    />
                  </button>
                </CustomTooltip>
              )}
            </span>

            {/* copy */}
            <span id="copy-btn">
              {isCopied ? (
                <button className="btn btn-outline-primary post-btn">
                  <DoneIcon style={{ fontSize: "22px" }} />
                </button>
              ) : (
                <CustomTooltip title="Copy Snippet" placement="top">
                  <button
                    className="btn btn-outline-light post-btn"
                    onClick={copyCode}
                  >
                    <ContentCopyIcon style={{ fontSize: "22px" }} />
                  </button>
                </CustomTooltip>
              )}
            </span>

            <span id="fullscreen-btn">
              <CustomTooltip title="Full Screen" placement="top">
                <button
                  className="btn btn-outline-light post-btn"
                  onClick={openFullScreen}
                >
                  <FullscreenIcon style={{ fontSize: "29px" }} />
                </button>
              </CustomTooltip>
            </span>

            {/* options */}
            <div className="options-holder position-relative" ref={optionsRef}>
              {userId === props.posterId && (
                <span id="post-options" className="m-0 p-0">
                  {!showOptions ? (
                    <button
                      className="btn btn-outline-light post-btn"
                      onClick={openOptions}
                    >
                      <MoreVertIcon style={{ fontSize: "22px" }} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary post-btn"
                      onClick={closeOptions}
                    >
                      <MoreVertIcon style={{ fontSize: "22px" }} />
                    </button>
                  )}
                </span>
              )}
              {showOptions && (
                <div
                  className="d-inline-flex justify-content-center  align-items-center gap-2 px-2 position-absolute bottom-100 mb-3 start-50 bg-primary p-2 rounded-3"
                  style={{ transform: "translateX(-50%)" }}
                >
                  <CustomTooltip title="Edit Post" placement="top">
                    <button
                      className="btn btn-outline-light post-btn"
                      onClick={openEditModal}
                    >
                      <EditIcon style={{ fontSize: "21px" }} />
                    </button>
                  </CustomTooltip>

                  <CustomTooltip title="Delete Post" placement="top">
                    <button
                      className="btn text-light post-btn"
                      style={{ backgroundColor: "#eb4334" }}
                      onClick={openConfirmModal}
                    >
                      <DeleteIcon style={{ fontSize: "22px" }} />
                    </button>
                  </CustomTooltip>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div
          id="code-block"
          className="border border-secondary rounded p-3"
          style={{ height: "180px", overflowY: "auto" }}
        >
          <pre className="text-white " style={{ fontSize: "17px" }}>
            <code>
              <CodeHighlighter codeSnippet={snippetCode} />
            </code>
          </pre>
        </div>

        {/* Fullscreen Modal */}
        <Modal
          open={isFullScreen}
          onClose={closeFullScreen}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "90%",
              backgroundColor: "#1E1E1E",
              color: "white",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={closeFullScreen}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "white",
              }}
            >
              <CloseIcon className="fs-2" />
            </IconButton>
            <h2
              id="modal-title"
              className="snippet-title fw-bold mb-4 text-center"
            >
              {snippetTitle}
            </h2>
            <pre id="modal-description" style={{ whiteSpace: "pre-wrap" }}>
              <code style={{ fontSize: "20px" }}>
                <CodeHighlighter codeSnippet={snippetCode} />
              </code>
            </pre>
          </Box>
        </Modal>

        {/* Description Modal */}
        <Modal
          open={isDescriptionOpen}
          onClose={closeDescription}
          aria-labelledby="description-modal-title"
          aria-describedby="description-modal-content"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "50%",
              backgroundColor: "#1E1E1E",
              color: "white",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={closeDescription}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "white",
              }}
            >
              <CloseIcon className="fs-2" />
            </IconButton>
            <h3
              id="description-modal-title"
              className="fw-bold mb-5 text-center text-warning"
            >
              {snippetTitle}
            </h3>
            <div
              id="description-modal-content "
              className="fs-5 text-start mt-4"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {snippetDescription ? (
                snippetDescription
              ) : (
                <div className="text-center text-secondary mt-2 text-6 small w-100">
                  No Description Added
                </div>
              )}
            </div>
          </Box>
        </Modal>

        {/* Share Modal */}
        <Modal
          open={isShareModalOpen}
          onClose={closeShareModal}
          aria-labelledby="description-modal-title"
          aria-describedby="description-modal-content"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "50%",
              backgroundColor: "#1E1E1E",
              color: "white",
              border: "2px solid darkgray",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={closeShareModal}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "white",
              }}
            >
              <CloseIcon className="fs-2" />
            </IconButton>
            <h3
              id="share-modal-title"
              className="fw-bold mb-4 text-center text-warning px-3 fs-4"
            >
              Share this Post with :
            </h3>
            <div
              id="share-modal-content "
              className="fs-5  mt-4 d-flex justify-content-center gap-3 flex-wrap"
            >
              <span
                className="share-option bg-primary"
                style={{ fontSize: "30px" }}
              >
                <FaFacebook />
              </span>
              <span
                className="share-option"
                style={{ fontSize: "30px", backgroundColor: "#25D366" }}
              >
                <IoLogoWhatsapp />
              </span>
              <span
                className="share-option instagram-option"
                style={{ fontSize: "30px" }}
              >
                <FaInstagram />
              </span>
              <span
                className="share-option x-option"
                style={{ fontSize: "26px" }}
              >
                {" "}
                <FaXTwitter />
              </span>
              <span
                className="share-option bg-danger"
                style={{ fontSize: "25px" }}
                onClick={() => {
                  copyLink(
                    `${process.env.REACT_APP_DOMAIN_NAME}/post/${props.id}`
                  );
                }}
              >
                <FaLink />
              </span>
            </div>
          </Box>
        </Modal>

        {/* collection modal  */}
        <Modal
          open={isCollectionModalOpen}
          onClose={closeCollectionModal}
          aria-labelledby="description-modal-title"
          aria-describedby="description-modal-content"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "50%",
              backgroundColor: "#1E1E1E",
              color: "white",
              border: "2px solid darkgray",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={closeCollectionModal}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "white",
              }}
            >
              <CloseIcon className="fs-2" />
            </IconButton>
            <h3
              id="share-modal-title"
              className="fw-bold mb-4 text-center text-warning px-3"
            >
              Add to a Collection :
            </h3>
            <form action="" onSubmit={saveToCollection}>
              <div className="w-100 d-flex justify-content-center align-items-center mt-4 mb-3">
                <input
                  type="text"
                  placeholder="Collection"
                  className="collection-input form-control rounded-3 fw-bold text-primary fs-5 text-center"
                  style={{ height: "50px", width: "300px" }}
                  value={collection}
                  onChange={collectionChanged}
                  autoFocus
                  autoCorrect="off"
                />
              </div>
              <div className="d-flex gap-3  justify-content-center align-items-center mt-4">
                <button
                  className=" btn border-2 border-primary text-primary fw-bold fs-6 lh-base rounded-4"
                  type="submit"
                >
                  Add
                </button>
                <button
                  className="btn border-2 rounded-4  border-secondary text-secondary fs-6 lh-base small"
                  onClick={closeCollectionModal}
                >
                  Skip
                </button>
              </div>
            </form>

            <div className="d-flex justify-content-center align-items-center">
              <IconButton
                aria-label="close"
                onClick={closeCollectionModal}
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "white",
                }}
              >
                <CloseIcon className="fs-2" />
              </IconButton>
            </div>
          </Box>
        </Modal>

        {/* edit modal */}
        <Modal
          open={isEditModalOpen}
          onClose={closeEditModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "75%",
              backgroundColor: "#1E1E1E",
              color: "white",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={closeEditModal}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "white",
              }}
            >
              <CloseIcon className="fs-2" />
            </IconButton>

            {stage === 1 ? (
              <h2 id="modal-title" className="fw-bold mb-4 fs-3 text-center">
                Editing the Post
              </h2>
            ) : (
              <h2
                id="modal-title"
                className="fw-bold text-light fs-3 mb-4 text-center"
              >
                Edit the Extra Infos
              </h2>
            )}

            {stage === 1 ? (
              <div className="filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3 px-4">
                <form action="" method="POST" className="w-100">
                  <div className="d-flex flex-column gap-3 ">
                    <div className="d-flex flex-column flex-md-row gap-3">
                      <input
                        className="filter-input form-control bg-transparent"
                        placeholder="Title"
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        spellCheck="false"
                        autoComplete="off"
                      />
                      <input
                        className="filter-input form-control bg-transparent"
                        placeholder="Language"
                        name="language"
                        value={editData.language}
                        spellCheck="false"
                        onChange={handleEditChange}
                      />
                    </div>
                    <textarea
                      className="centered-placeholder filter-input form-control bg-transparent"
                      placeholder="Content"
                      name="content"
                      onChange={handleEditChange}
                      value={editData.content}
                      style={{ height: "200px" }}
                      autoComplete="off"
                      spellCheck="false"
                    ></textarea>
                  </div>
                </form>
              </div>
            ) : (
              <div className="filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3 px-4">
                <form action="" method="POST" className="w-100 mt-2">
                  <div className="d-flex flex-column gap-3 ">
                    <input
                      className="filter-input form-control bg-transparent w-100"
                      placeholder="Github Link"
                      name="gitHubLink"
                      value={optionalData.gitHubLink}
                      onChange={handleOptionalDataChange}
                      spellCheck="false"
                    />

                    <div className="mt-0 mb-0">
                      <span
                        className="fw-bold ms-2"
                        style={{
                          color: "rgb(153, 143, 143)",
                          fontSize: "21px",
                        }}
                      >
                        Description :
                      </span>
                    </div>

                    <textarea
                      className="filter-input form-control bg-transparent mt-0"
                      onChange={handleOptionalDataChange}
                      value={optionalData.description}
                      name="description"
                      style={{ height: "200px" }}
                      spellCheck="false"
                    ></textarea>
                  </div>
                </form>
              </div>
            )}

            {stage === 1 ? (
              <div className="d-flex justify-content-center mt-5">
                <CustomTooltip title="Next Stage" placement="top">
                  <IconButton
                    className="mx-4 mt-0 bg-warning"
                    style={{ backgroundColor: "#f8f9fa" }}
                    onClick={nextStage}
                  >
                    <ArrowForwardIcon
                      fontSize="large"
                      className="text-dark fw-bolder"
                    />
                  </IconButton>
                </CustomTooltip>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-center mt-5 gap-3">
                  <CustomTooltip title="Previous Stage" placement="top">
                    <IconButton
                      className="mx-2 mt-0 bg-muted"
                      style={{ backgroundColor: "#f8f9fa" }}
                      onClick={() => {
                        if (!editLoading) setStage(1);
                      }}
                    >
                      <ArrowBackIcon
                        fontSize="large"
                        className="text-dark fw-bolder"
                      />
                    </IconButton>
                  </CustomTooltip>

                  <CustomTooltip title="Publish" placement="top">
                    {!editLoading ? (
                      <IconButton
                        className="mx-2 mt-0 bg-warning"
                        style={{ backgroundColor: "#f8f9fa" }}
                        onClick={handleEditSubmit}

                      >
                        <DoneRoundedIcon
                          fontSize="large"
                          className="text-dark fw-bolder"
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        className="mx-2 mt-0 bg-warning"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <SpinnerSpan />
                      </IconButton>
                    )}
                  </CustomTooltip>
                </div>
              </>
            )}
          </Box>
        </Modal>

        {/* delete confirmtion modal */}
        <Modal
          open={isConfirmModalOpen}
          onClose={closeConfirmModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "16px",
              maxHeight: "95vh",
              overflowY: "auto",
              width: "clamp(400px , 100% , 500px)",
              backgroundColor: "#1E1E1E",
              color: "white",
              border: "2px solid darkgray",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={closeConfirmModal}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "white",
              }}
              disabled={deleteLoading}
            >
              <CloseIcon className="fs-2" />
            </IconButton>

            <h3 id="modal-title" className="fw-bold mb-4 mt-4 text-center fs-5">
              Are you sure you want to Delete this post ?
            </h3>

            <div className="d-flex gap-3  justify-content-center align-items-center mt-4">
              <button
                className="btn border-2 rounded-4 fw-bold border-secondary text-secondary fs-6 lh-base small"
                onClick={closeConfirmModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                className=" btn border-2 border-danger text-danger fw-bold fs-6 lh-base rounded-4"
                onClick={deletePost}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <SpinnerSpan
                    color="text-danger"
                    spanStyle={{ width: "22px", height: "22px" }}
                  />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </Box>
        </Modal>

        {/* Reactions */}
        <div className="d-flex justify-content-start align-items-center gap-3 mt-2 pt-2">
          <div id="like-btn" className="text-center">
            {react === "like" ? (
              <button
                className="btn btn-primary p-2 px-3 fw-bolder fs-5 like-btn"
                onClick={unlikeSnippet}
              >
                <ThumbUpIcon style={{ fontSize: "20px" }} />
              </button>
            ) : (
              <button
                className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn"
                onClick={likeSnippet}
              >
                <ThumbUpIcon style={{ fontSize: "20px" }} />
              </button>
            )}
            <div className="text-light mt-1">{likeCount}</div>
          </div>
          <div id="dislike-btn" className="text-center">
            {react === "dislike" ? (
              <button
                className="btn btn-danger p-2 px-3 fw-bolder fs-5 like-btn"
                onClick={undislikeSnippet}
              >
                <ThumbDownIcon style={{ fontSize: "20px" }} />
              </button>
            ) : (
              <button
                className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn"
                onClick={dislikeSnippet}
              >
                <ThumbDownIcon style={{ fontSize: "20px" }} />
              </button>
            )}
            <div className="text-light mt-1">{dislikeCount}</div>
          </div>
          <div id="comment-btn" className="text-center">
            <button
              className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn"
              onClick={openComments}
            >
              <CommentIcon style={{ fontSize: "20px" }} />
            </button>
            <div className="text-light mt-1">{commentCount}</div>
          </div>
          <div id="share-btn" className="text-center">
            <button
              className="btn btn-light p-2 px-3 fw-bolder fs-5 like-btn"
              onClick={openShareModal}
            >
              <ShareIcon style={{ fontSize: "20px" }} />
            </button>
            <div className="text-light mt-1">{shareCount}</div>
          </div>
        </div>

        {/* Comments Section */}
        <Suspense>
          <Modal
            open={isCommentsOpen}
            onClose={closeComments}
            aria-labelledby="description-modal-title"
            aria-describedby="description-modal-content"
          >
            <div>
              <CommentSection
                closeComments={closeComments}
                postId={props.id}
                postTitle={snippetTitle}
                addComment={addComment}
                incrementCommentCount={incrementCommentCount}
              />
            </div>
          </Modal>
        </Suspense>
      </div>

      {/* saved at */}
      <span className="position-absolute bottom-0 end-0 d-flex gap-0 align-items-center me-2 mb-2">
        {props.savedAt && (
          <InfoTooltip
            title={
              <div style={{ whiteSpace: "pre-line" }}>
                {`Saved at :
              ${formatTimestamp(props.savedAt)}`}
              </div>
            }
            placement="top"
          >
            <span id="saved-at" className="saved-at text-light rounded-5 fs-4">
              <AccessTimeIcon fontSize="50px" />
            </span>
          </InfoTooltip>
        )}
      </span>

      {/* explain */}
      <CustomTooltip title="Explain" placement="right">
        <span
          onClick={startGuide}
          className="text-light rounded-5 d-flex justify-content-center align-items-center fw-light border-light position-absolute top-0 end-0 me-2 mt-2"
          style={{
            fontSize: "10px",
            cursor: "pointer",
            aspectRatio: "1",
            padding: "1pt",
            border: "0.5pt solid gray",
            opacity: "0.65",
          }}
        >
          <QuestionMarkIcon fontSize="50px" />
        </span>
      </CustomTooltip>
    </div>
  );
}
