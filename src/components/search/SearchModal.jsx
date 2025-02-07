import React, { useEffect, useRef, useState } from "react";
import { algoliasearch } from "algoliasearch";
import {
  InstantSearch,
  SearchBox,
  PoweredBy,
  useInstantSearch,
  useInfiniteHits,
  Index
} from "react-instantsearch";
import { Modal, Box } from "@mui/material";
import SpinnerSpan from "../tools/SpinnerSpan";
import { CiSearch } from "react-icons/ci";
import PostSearchResult from "./PostSearchResult";
import UserSearchResult from "./UserSearchResult";
import PostSearchHistory from "./PostSearchHistory";
import UserSearchHistory from "./UserSearchHistory";
import "./styles/search-modal.css";

const algoliaId = process.env.REACT_APP_ALGOLIA_APP_ID;
const algoliaSearchKey = process.env.REACT_APP_ALGOLIA_SEARCH_KEY;
const searchClient = algoliasearch(algoliaId, algoliaSearchKey);


function CustomInfiniteHits({ hitComponent: HitComponent, setIsSearchModalOpen }) {
  const { items, isLastPage, showMore } = useInfiniteHits();
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isLastPage) {
              showMore();
            }
          });
        },
        {
          root: null,
          rootMargin: "100px",
          threshold: 0.1,
        }
      );

      observer.observe(sentinelRef.current);
      return () => observer.disconnect();
    }
  }, [isLastPage, showMore]);

  return (
    <div className="ais-InfiniteHits">
      <ul className="ais-InfiniteHits-list">
        {items.map((hit) => (
          <li key={hit.objectID} className="ais-InfiniteHits-item">
            <HitComponent hit={hit} setIsSearchModalOpen={setIsSearchModalOpen} />
          </li>
        ))}
        <li ref={sentinelRef} aria-hidden="true" />
      </ul>
      {!isLastPage && items.length > 0 && (
        <div className="w-100 d-flex justify-content-center">
          <SpinnerSpan spanStyle={{ width: "27px", height: "27px" }} />
        </div>
      )}
    </div>
  );
}


function Icon() {
  const { status } = useInstantSearch();
  return (
    <div className="search-icon-cont">
      {status !== "loading" ? (
        <CiSearch className="search-icon" />
      ) : (
        <SpinnerSpan spanStyle={{ fontSize: "15px", width: "24px", height: "24px" }} />
      )}
    </div>
  );
}


function PostHit({ hit, setIsSearchModalOpen }) {
  return (
    <PostSearchResult
      hit={hit}
      title={hit.title}
      language={hit.language}
      snippet={hit.snippet}
      id={hit.objectID}
      setIsSearchModalOpen={setIsSearchModalOpen}
    />
  );
}


function UserHit({ hit, setIsSearchModalOpen }) {
  return (
    <UserSearchResult
      hit={hit}
      setIsSearchModalOpen={setIsSearchModalOpen}
      fullname={`${hit.firstname} ${hit.lastname}`}
      username={hit.username}
      profile_pic={hit.profile_pic}
      id={hit.objectID}
    />
  );
}


function PostsResults({ setIsSearchModalOpen }) {
  const { uiState } = useInstantSearch();
  console.log(uiState)
  if (!uiState["posts"]?.query && !uiState["posts"]?.query?.trim() && !uiState["users"]?.query && !uiState["users"]?.query?.trim()) {
    return <PostSearchHistory setIsSearchModalOpen={setIsSearchModalOpen} />;
  }
  return <CustomInfiniteHits hitComponent={PostHit} setIsSearchModalOpen={setIsSearchModalOpen} />;
}

function UsersResults({ setIsSearchModalOpen }) {
  const { uiState } = useInstantSearch();
  console.log(uiState)
  if (!uiState["users"]?.query && !uiState["users"]?.query?.trim() && !uiState["posts"]?.query && !uiState["posts"]?.query?.trim()) {
    return <UserSearchHistory setIsSearchModalOpen={setIsSearchModalOpen} />;
  }
  return <CustomInfiniteHits hitComponent={UserHit} setIsSearchModalOpen={setIsSearchModalOpen} />;
}


function SearchModal({ isSearchModalOpen, setIsSearchModalOpen }) {
  const [activeTab, setActiveTab] = useState("posts"); 

  return (
    <Modal
      open={isSearchModalOpen}
      disableAutoFocus
      disableEnforceFocus
      onClose={() => setIsSearchModalOpen(false)}
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
          p: 1,
          borderRadius: "16px",
          height: "90vh",
          width: "70%",
          backgroundColor: "#1E1E1E",
          color: "white",
          display: "flex",
          flexDirection: "column"
        }}
        className="search-modal"
      >
        <InstantSearch
          searchClient={searchClient}
          indexName="posts" 
          insights
          future={{ preserveSharedStateOnUnmount: true }}
        >
          {/* Fixed Search Box */}
          <div className="search-box-container px-md-4">
            <div className="w-100 d-flex gap-2 justify-content-center mt-3">
              <Icon />
              <SearchBox
                autoFocus
                classNames={{
                  root: "search-box",
                  input: "search-box-input ps-3 pe-3",
                  form: "search-box-form",
                  reset: "d-none",
                  submit: "d-none",
                  loadingIndicator: "d-none"
                }}
                loadingIconComponent={() => (
                  <div className="h-100 d-flex justify-content-center align-items-center">
                    <SpinnerSpan />
                  </div>
                )}
              />
            </div>
            <div className="search-tags-containe d-flex justify-content-center mt-3" >
              <button
                className={`fw-bold search-tag ${activeTab === "posts" ? "active" : ""}`}
                onClick={() => setActiveTab("posts")}
                style={{
                  background: activeTab === "posts" ? "#0d6efd" : "#f0f0f0",
                  color: activeTab === "posts" ? "white" : "black",
                  border: "none",
                  padding: "8px 16px",
                  marginRight: "8px",
                  cursor: "pointer",
                  borderRadius: "10px"
                }}
              >
                Posts
              </button>
              {/* <button
                className={` me-2 fw-bold search-tag ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("demands")}
                style={{
                  background: activeTab === "users" ? "#0d6efd" : "#f0f0f0",
                  color: activeTab === "users" ? "white" : "black",
                  border: "none",
                  padding: "8px 16px",
                  cursor: "pointer",
                  borderRadius: "10px"
                }}
              >
                Demands
              </button> */}
              <button
                className={`fw-bold search-tag ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
                style={{
                  background: activeTab === "users" ? "#0d6efd" : "#f0f0f0",
                  color: activeTab === "users" ? "white" : "black",
                  border: "none",
                  padding: "8px 16px",
                  cursor: "pointer",
                  borderRadius: "10px"
                }}
              >
                Users
              </button>



            </div>
          </div>

          {/* Render results based on the active tag */}
          <div className="search-results-container px-md-4" style={{ marginTop: "10px", flex: 1, overflowY: "auto" }}>
            {activeTab === "posts" && (
              <Index indexName="posts">
                <PostsResults setIsSearchModalOpen={setIsSearchModalOpen} />
              </Index>
            )}
            {activeTab === "users" && (
              <Index indexName="users">
                <UsersResults setIsSearchModalOpen={setIsSearchModalOpen} />
              </Index>
            )}
          </div>
        </InstantSearch>
      </Box>
    </Modal>
  );
}

export default SearchModal;
