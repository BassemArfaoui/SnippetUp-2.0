import React, { useEffect, useRef } from "react";
import {algoliasearch} from "algoliasearch";
import {
  InstantSearch,
  SearchBox,
  PoweredBy,
  useInstantSearch,
  useInfiniteHits,
  Highlight
} from "react-instantsearch";
import { Modal, Box } from "@mui/material";
import "./styles/search-modal.css";
import SpinnerSpan from "../tools/SpinnerSpan";
import { CiSearch } from "react-icons/ci";
import SearchResult from "./SearchResult";
import SearchHistory from "./SearchHistory";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const algoliaId = process.env.REACT_APP_ALGOLIA_APP_ID;
const algoliaSearchKey = process.env.REACT_APP_ALGOLIA_SEARCH_KEY;
const searchClient = algoliasearch(algoliaId, algoliaSearchKey);

function CustomInfiniteHits({ hitComponent: HitComponent, setIsSearchModalOpen }) {
  const { items, isLastPage, showMore, isLoading } = useInfiniteHits();
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
          rootMargin: "300px", 
          threshold: 0.1,
        }
      );

      observer.observe(sentinelRef.current);
      return () => {
        observer.disconnect();
      };
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

function Result({ Hit, setIsSearchModalOpen }) {
  const { uiState } = useInstantSearch();
  return (
    <>
    {(
        uiState.posts.query ? (
        <CustomInfiniteHits hitComponent={Hit} setIsSearchModalOpen={setIsSearchModalOpen} />
      ) : (
        <SearchHistory setIsSearchModalOpen={setIsSearchModalOpen} />
      )
      )}
    </>
  );
}

function SearchModal({ isSearchModalOpen, setIsSearchModalOpen }) {
  function Hit({ hit, setIsSearchModalOpen }) {
    return (
      <SearchResult
        hit={hit}
        title={hit.title}
        language={hit.language}
        snippet={hit.snippet}
        id={hit.objectID}
        setIsSearchModalOpen={setIsSearchModalOpen}
      />
    );
  }

  return (
    <Modal
      open={isSearchModalOpen}
      disableAutoFocus // Disables auto-focus on the modal
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
            <div className="d-flex justify-content-end me-3 mt-2">
              <PoweredBy style={{ width: "120px" }} theme="dark" classNames={{ link: "text-dark" }} />
            </div>
          </div>

          <div className="search-results-container px-md-4">
            <Result Hit={Hit} setIsSearchModalOpen={setIsSearchModalOpen} />
          </div>
        </InstantSearch>
      </Box>
    </Modal>
  );
}

export default SearchModal;
