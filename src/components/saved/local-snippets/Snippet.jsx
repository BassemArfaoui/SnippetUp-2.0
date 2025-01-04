import React, { useState, useEffect, useRef } from "react";
import CustomTooltip from "../../tools/CustomTooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal, Box, IconButton } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CodeHighlighter from "../../tools/CodeHighliter";
import { notify, successNotify } from "../../tools/CustomToaster";
import SpinnerSpan from "../../tools/SpinnerSpan";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../../tools/styles/driver.css";

function Snippet(props) {
  const userId = 1;

  const navigate = useNavigate()

  const [editData, setEditData] = useState({
    title: props.title,
    content: props.content,
    language: props.language,
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isFullScreen, setisFullScreen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOptionalDataModalOpen, setIsOptionalDataModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInfosOpen, setIsInfosOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [optionalData, setOptionalData] = useState({
    description: "",
    gitHubLink: "",
  });

  // Ref for options holder
  const optionsRef = useRef(null);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(props.content);
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

  const openFullScreen = () => {
    setisFullScreen(true);
  };

  const closeFullScreen = () => {
    setisFullScreen(false);
  };

  const openOptions = () => {
    setShowOptions(true);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const openEditModal = () => {
    closeOptions();
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditData((prevData) => ({
      title: props.title,
      content: props.content,
      language: props.language,
    }));
    setIsEditModalOpen(false);
  };

  const openConfirmModal = () => {
    closeOptions();
    setIsConfirmModalOpen(true);
  };

  const openInfosModal = () => {
    closeOptions();
    setIsInfosOpen(true);
  };

  const closeInfosModal = () => {
    setIsInfosOpen(false);
  };

  const openOptionDataModal = () => {
    setIsOptionalDataModalOpen(true);
  };

  const closeOptionDataModal = () => {
    setIsOptionalDataModalOpen(false);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const deleteSnippet = async () => {
    closeConfirmModal();
    try {
      await props.deleteSnippet(props.id);
    } catch (err) {
      console.log(err.message);
    }
  };

  const editSnippet = async () => {
    if (
      editData.title.trim() &&
      editData.content.trim() &&
      editData.language.trim()
    ) {

        setIsEditModalOpen(false);
        try {
          await props.editSnippet({ id: props.id, updatedSnippet: editData });
        } catch (err) {
          console.error(err.message);
        }
    } else {
      notify("Please Fill all the Fields");
    }
  };

  const postSnippet = async () => {
    closeOptionDataModal();
    setIsPosting(true);

    try {
      await axios.post(
        `http://localhost:4000/${userId}/add/post/${props.id}`,
        {
          title: props.title,
          content: props.content,
          language: props.language,
          description: optionalData.description,
          gitHubLink: optionalData.gitHubLink,
        }
      );

      setIsPosting("success");
      setOptionalData({
        description: "",
        gitHubLink: "",
      });
      navigate('/profile')
      successNotify("post uploaded successfully");
    } catch (err) {
      notify("Couldn't post the Snippet");
      setIsPosting(false);
      console.log(err.message);
    }
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

    return `${day} ${month} ${year}  at  ${hours}:${minutes}`;
  };

  
  function startGuide()
  {

    const steps = [
      { element: '#snippet-title', popover: { title: 'Snippet Title', description: 'This section displays the title of the code snippet for quick identification.' }},
      { element: '#code-block', popover: { title: 'Code Snippet', description: 'View the full code snippet here with syntax highlighting for better readability.' }},
      { element: '#language-btn', popover: { title: 'Programming Language', description: 'Displays the programming language or framework used in this snippet.' }},
      { element: '#snippet-options', popover: { title: 'Snippet Management', description: 'Easily manage your snippet with options to edit, delete, or view more detailed informations.' }},
      { element: '#copy-btn', popover: { title: 'Copy Code', description: 'Copy the snippet to your clipboard for immediate use in your projects.' }},
      { element: '#fullscreen-btn', popover: { title: 'Full-Screen View', description: 'Expand the snippet to full screen for an enhanced, distraction-free viewing experience.' }},
      { element: '#post-snippet', popover: { title: 'Share Snippet', description: 'Post this snippet to the community to help others and share your knowledge.' }},
      { element: '#add-snippet', popover: { title: 'Create New Snippet', description: 'Add a new snippet to your collection for future use and easy access at any time.' }},
    ];
    

  
    //driver
    const driverObj = driver({
      showProgress: true,
      steps: steps
    });

    driverObj.drive();
  }

  useEffect(() => {
    if (props.isPosted) {
      setIsPosting("success");
    }
  }, [props.isPosted]);

  // Handle click outside of options div
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up event listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);



  
  return (
    <div className="post rounded-4 p-4 position-relative">
      {/* Snippet Title and Buttons */}
      <div id="snippet-title" className="d-flex flex-column gap-1 align-items-center justify-content-between mb-3">
        <h3 className="snippet-title fw-bold text-center">{props.title}</h3>
      </div>

      {/* Code Block */}
      <div id="code-block"
        className="border border-secondary rounded p-3"
        style={{ height: "200px", overflowY: "auto" }}
      >
        <pre className="text-white " style={{ fontSize: "17px" }}>
          <code>
            <CodeHighlighter codeSnippet={props.content} />
          </code>
        </pre>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div id="language-btn" className=" d-inline-flex align-items-center justify-content-between ms-2 px-2 py-1 bg-secondary fs-6 fw-bold text-light rounded">
          {props.language}
        </div>

        <div className="buttons justify-content-end d-flex gap-3 align-items-center me-2">
          {/* Action Buttons */}
          <div className="options-holder position-relative" ref={optionsRef}>
            <span id="snippet-options" className="m-0 p-0">
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

            {showOptions && (
              <div
                className="d-inline-flex justify-content-center align-items-center gap-3 position-absolute bottom-100 mb-3 start-50 bg-primary p-2 rounded-3"
                style={{ transform: "translateX(-50%)" }}
              >
                <CustomTooltip title="Snippet Infos" placement="top">
                  <button
                    className="btn btn-outline-light post-btn"
                    onClick={openInfosModal}
                  >
                    <InfoIcon style={{ fontSize: "22px" }} />
                  </button>
                </CustomTooltip>

                <CustomTooltip title="Edit Snippet" placement="top">
                  <button
                    className="btn btn-outline-light post-btn"
                    onClick={openEditModal}
                  >
                    <EditIcon style={{ fontSize: "21px" }} />
                  </button>
                </CustomTooltip>

                <CustomTooltip title="Delete Snippet" placement="top">
                  <button
                    className="btn text-light post-btn"
                    onClick={openConfirmModal}
                    style={{ backgroundColor: "#eb4334" }}
                  >
                    <DeleteIcon style={{ fontSize: "22px" }} />
                  </button>
                </CustomTooltip>
              </div>
            )}
          </div>

          <span id="copy-btn">
            {isCopied ? (
              <button className="btn btn-outline-primary post-btn">
                <DoneIcon style={{ fontSize: "22px" }}/>
              </button>
            ) : (
              <CustomTooltip title="Copy Snippet" placement="top">
                <button
                  className="btn btn-outline-light post-btn"
                  onClick={copyCode}
                >
                  <ContentCopyIcon style={{ fontSize: "20px" }} />
                </button>
              </CustomTooltip>
            )}
          </span>

          <CustomTooltip title="Full Screen" placement="top">
            <button
              id="fullscreen-btn"
              className="btn btn-outline-light post-btn"
              onClick={openFullScreen}
            >
              <FullscreenIcon style={{ fontSize: "26px" }} />
            </button>
          </CustomTooltip>

          <CustomTooltip
            title={
              !isPosting
                ? "post"
                : isPosting === true
                ? "posting ..."
                : "posted"
            }
            placement="top"
          >
            {
              <span id="post-snippet" className="btn btn-outline-primary post-btn">
                {!isPosting ? (
                  <button
                    className="btn btn-outline-primary post-btn"
                    onClick={openOptionDataModal}
                  >
                    <ArrowUpwardIcon style={{ fontSize: "26px" }} />
                  </button>
                ) : (
                  <>
                    {isPosting === true ? (
                      <button className="btn btn-outline-primary post-btn p-2">
                        <SpinnerSpan
                          color="text-light"
                          spanStyle={{ width: "22px", height: "22px" }}
                        />
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-primary post-btn"
                        onClick={() => {
                          notify("Snippet already posted");
                        }}
                      >
                        <DoneRoundedIcon style={{ fontSize: "22px" }}/>
                      </button>
                    )}
                  </>
                )}
              </span>
            }
          </CustomTooltip>
        </div>
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
            {props.title}
          </h2>
          <pre id="modal-description" style={{ whiteSpace: "pre-wrap" }}>
            <code style={{ fontSize: "19px" }}>
              <CodeHighlighter codeSnippet={props.content} />
            </code>
          </pre>
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
            width: "90%",
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

          <h2
            id="modal-title"
            className="snippet-title fw-bold mb-4 text-center"
          >
            Edit Snippet
          </h2>
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
                  />
                  <input
                    className="filter-input form-control bg-transparent"
                    placeholder="Language"
                    name="language"
                    value={editData.language}
                    onChange={handleEditChange}
                    spellCheck="false"
                  />
                </div>
                <textarea
                  className="filter-input form-control bg-transparent"
                  placeholder="Content"
                  name="content"
                  onChange={handleEditChange}
                  value={editData.content}
                  style={{ height: "250px" }}
                  spellCheck="false"
                ></textarea>
              </div>
            </form>
            <div className="d-flex justify-content-center mt-5">
              <CustomTooltip title="Edit Snippet" placement="top">
                <IconButton
                  className="mx-4 mt-0 bg-warning"
                  style={{ backgroundColor: "#f8f9fa" }}
                  onClick={editSnippet}
                >
                  <DoneRoundedIcon
                    fontSize="large"
                    className="text-dark fw-bolder"
                  />
                </IconButton>
              </CustomTooltip>
            </div>
          </div>
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
          >
            <CloseIcon className="fs-2" />
          </IconButton>

          <h3 id="modal-title" className="fw-bold mb-4 mt-4 text-center fs-4">
            Are you sure you want to Delete this Snippet ?
          </h3>

          <div className="d-flex gap-3  justify-content-center align-items-center mt-4">
            <button
              className="btn border-2 rounded-4  border-secondary text-secondary fs-5 lh-base small"
              onClick={closeConfirmModal}
            >
              Cancel
            </button>

            <button
              className=" btn border-2 border-danger text-danger fw-bold fs-5 lh-base rounded-4"
              onClick={deleteSnippet}
            >
              Delete
            </button>
          </div>
        </Box>
      </Modal>

      {/* info modal */}
      <Modal
        open={isInfosOpen}
        onClose={closeInfosModal}
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
            paddingTop: "20px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeInfosModal}
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
            id="modal-title"
            className="fw-bold mb-4 mt-3 text-center text-warning fs-2"
          >
            <span className="text-warning"> Infos :</span>
          </h3>

          <div className="d-flex flex-column gap-1">
            <div className="fs-5 fw-bold">
              <span className="text-primary">Title :</span> {props.title}
            </div>
            <div className="fs-5 fw-bold">
              <span className="text-primary">Language :</span> {props.language}
            </div>
            <div className="fs-5 fw-bold">
              <span className="text-primary">Status :</span>{" "}
              {props.isPosted || isPosting === "success" ? "Posted" : "Local"}
            </div>
            <div className="fs-5 fw-bold">
              <span className="text-primary">Created at :</span>{" "}
              {formatTimestamp(props.createdAt)}{" "}
            </div>
            {props.createdAt !== props.modifiedAt && (
              <div className="fs-5 fw-bold">
                <span className="text-primary">Modified at : </span>
                {formatTimestamp(props.modifiedAt)}{" "}
              </div>
            )}
          </div>
        </Box>
      </Modal>

      {/* Optional Data modal */}
      <Modal
        open={isOptionalDataModalOpen}
        onClose={closeOptionDataModal}
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
            onClick={closeOptionDataModal}
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
            Add Extra Infos{" "}
            <span className="small" style={{ color: "rgb(153, 143, 143)" }}>
              (Optional)
            </span>
          </h2>
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

                <div className="mt-2 mb-0">
                  <span
                    className="fw-bold ms-2"
                    style={{ color: "rgb(153, 143, 143)", fontSize: "21px" }}
                  >
                    Description :
                  </span>
                </div>

                <textarea
                  className="filter-input form-control bg-transparent mt-0"
                  onChange={handleOptionalDataChange}
                  value={optionalData.description}
                  name="description"
                  style={{ height: "250px" }}
                  spellCheck="false"
                ></textarea>
              </div>
            </form>
            <div className="d-flex justify-content-center mt-5">
              <CustomTooltip title="Post" placement="top">
                <IconButton
                  className="mx-4 mt-0 bg-warning"
                  style={{ backgroundColor: "#f8f9fa" }}
                  onClick={postSnippet}
                >
                  <DoneRoundedIcon
                    fontSize="large"
                    className="text-dark fw-bolder"
                  />
                </IconButton>
              </CustomTooltip>
            </div>
          </div>
        </Box>
      </Modal>


      
      <CustomTooltip title='Explain' placement='right'>
        <span onClick={startGuide}  className="text-light rounded-5 d-flex justify-content-center align-items-center fw-light border-light position-absolute top-0 end-0 me-2 mt-2" style={{fontSize:'10px',cursor:'pointer',aspectRatio:'1',padding:'1pt',border:'0.5pt solid gray',opacity:'0.65'}}>
              <QuestionMarkIcon  fontSize='50px'/>
        </span>
      </CustomTooltip>
    </div>
  );
}

export default Snippet;
