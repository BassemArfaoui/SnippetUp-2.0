import React, { useState, useContext } from "react";
import CodeHighlighter from "../tools/CodeHighliter";
import { IconButton, Modal, Box } from "@mui/material";
import "./styles/search-result.css";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CustomTooltip from "../tools/CustomTooltip";
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { notify, successNotify } from "../tools/CustomToaster";
import { MdOutlineOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import userContext from "../contexts/userContext";
import { Highlight } from 'react-instantsearch';



function SearchResult({history ,  hit , title, language, snippet, id, setIsSearchModalOpen ,  handleRemoveFromHistory}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFullScreen, setisFullScreen] = useState(false);
  const { user } = useContext(userContext);
  const userId = user.id;
  const navigate = useNavigate();

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setIsCopied(true);
      successNotify("Snippet Copied");
      setTimeout(() => {
        setIsCopied(false);
      }, 1600);
      saveToHistory();
    } catch (err) {
      console.log(err);
      notify("Couldn't Copy");
    }
  };

  const navigateToPost = () => {
    setIsSearchModalOpen(false);
    navigate(`/post/${id}`);
    saveToHistory();
  };

  const saveToHistory = () => {
    const currentTimestamp = Date.now();
    const newPostData = {
      id,
      title,
      language,
      snippet,
      timestamp: currentTimestamp,
    };

    let historyData = JSON.parse(localStorage.getItem("searchHistory")) || {};

    if (!Array.isArray(historyData[userId])) {
      historyData[userId] = [];
    }

    let userHistory = historyData[userId];

    const existingIndex = userHistory.findIndex((item) => item.id === id);
    if (existingIndex !== -1) {
      userHistory.splice(existingIndex, 1);
    }

    userHistory.push(newPostData);

    userHistory.sort((a, b) => b.timestamp - a.timestamp);

    if (userHistory.length > 15) {
      userHistory = userHistory.slice(0, 15);
    }

    historyData[userId] = userHistory;
    localStorage.setItem("searchHistory", JSON.stringify(historyData));
  };

  const deleteFromHistory = (postId) => {
    let historyData = JSON.parse(localStorage.getItem("searchHistory")) || {};

    if (Array.isArray(historyData[userId])) {
      let userHistory = historyData[userId];

      userHistory = userHistory.filter((item) => item.id !== postId);

      historyData[userId] = userHistory;
      localStorage.setItem("searchHistory", JSON.stringify(historyData));
      handleRemoveFromHistory(postId)
    }
  };



  return (
    <div className="post rounded-4 p-4 position-relative mb-3 pt-3 pb-0 position-relative">
      <div className="d-flex align-items-center mb-3 justify-content-center">
        <div
          id="snippet-title"
          className="d-flex flex-column gap-1 align-items-center justify-content-center"
        >
          <h3 className="hit-title fw-bold text-center m-0 p-0">
            {!history ? (
              <Highlight
                attribute="title"
                hit={hit}
                classNames={{ Highlighted: "bg-danger" }}
              />
            ) : (
              title
            )}
          </h3>
        </div>
      </div>

      <div
        id="code-block"
        className="border border-secondary rounded p-2 ps-3"
        style={{ height: "100px", overflowY: "auto" }}
      >
        <pre className="text-white " style={{ fontSize: "17px" }}>
          <code>
            {
              <div className="w-100 d-flex justify-content-end p-2">
                <div
                  id="language-btn"
                  className="search-result-lang d-inline-flex align-items-center justify-content-between ms-2 px-2 py-1 bg-secondary  fw-bold text-light rounded"
                >
                  {!history ? (
                    <Highlight attribute="language" hit={hit} />
                  ) : (
                    language
                  )}
                </div>
              </div>
            }
            <CodeHighlighter codeSnippet={snippet} />
          </code>
        </pre>
      </div>

      <div className="d-flex justify-content-end align-items-center w-100 mt-1 mb-2">
        <div className="buttons justify-content-end d-flex gap-2 align-items-center me-2">
          <span id="copy-btn">
            {isCopied ? (
              <span
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <DoneIcon style={{ fontSize: "24px" }} />
              </span>
            ) : (
              <CustomTooltip title="Copy Snippet" placement="top">
                <span
                  className="d-flex align-items-center "
                  onClick={copyCode}
                  style={{ cursor: "pointer" }}
                >
                  <ContentCopyIcon style={{ fontSize: "19px" }} />
                </span>
              </CustomTooltip>
            )}
          </span>

          <CustomTooltip title="Full Screen" placement="top">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                setisFullScreen(true);
                saveToHistory();
              }}
            >
              <FullscreenIcon style={{ fontSize: "28px" }} />
            </span>
          </CustomTooltip>

          <CustomTooltip title="Go to Post" placement="top">
            <span
              style={{ cursor: "pointer" }}
              className="mb-1"
              onClick={() => {
                navigateToPost(id);
              }}
            >
              <MdOutlineOpenInNew style={{ fontSize: "23px" }} />
            </span>
          </CustomTooltip>
        </div>
      </div>

      {history && (
        <CustomTooltip title="Remove from history" placement="top">
          <span
            className="position-absolute end-0 top-0 m-0 p-0 me-2"
            onClick={() => {
              deleteFromHistory(id);
            }}
          >
            <CloseIcon style={{ fontSize: "18px", cursor: "pointer" }} />
          </span>
        </CustomTooltip>
      )}

      {/* Fullscreen Modal */}
      <Modal
        open={isFullScreen}
        onClose={() => {
          setisFullScreen(false);
        }}
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
            maxHeight: "80vh",
            overflowY: "auto",
            width: "95%",
            maxWidth: "800px",
            backgroundColor: "#1E1E1E",
            color: "white",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => {
              setisFullScreen(false);
            }}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "white",
            }}
          >
            <CloseIcon style={{ fontSize: "23px" }} />
          </IconButton>
          <h2 id="modal-title" className="hit-title fw-bold mb-4 text-center">
            {title}
          </h2>
          <pre id="modal-description" style={{ whiteSpace: "pre-wrap" }}>
            <code style={{ fontSize: "17px" }}>
              <CodeHighlighter codeSnippet={snippet} />
            </code>
          </pre>
        </Box>
      </Modal>
    </div>
  );
}

export default SearchResult;
