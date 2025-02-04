import { algoliasearch } from "algoliasearch";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
  Pagination,
  Configure,
} from "react-instantsearch";
import { Modal, Box, IconButton } from "@mui/material";
import "./styles/search-modal.css"
import SpinnerSpan from "../tools/SpinnerSpan";
import { CiSearch } from "react-icons/ci";
import { useInstantSearch } from 'react-instantsearch';
import Snippet from "../saved/local-snippets/Snippet";
import SearchResult from "./SearchResult";




const algoliaId = process.env.REACT_APP_ALGOLIA_APP_ID;
const algoliaSearchKey = process.env.REACT_APP_ALGOLIA_SEARCH_KEY;
const searchClient = algoliasearch(algoliaId, algoliaSearchKey);



function Icon() {
  const { status } = useInstantSearch();
  return (
    <div className="search-icon-cont">
    {  status !=='loading'?
      <CiSearch className="search-icon"/> : <SpinnerSpan spanStyle={{fontSize:'15px', width : '24px',height :'24px'}}/>

    }
    </div>
  )
  
}




function SearchModal({isSearchModalOpen, setIsSearchModalOpen}) {
  function Hit({ hit }) {
    return (
     <SearchResult title={hit.title}  snippet={hit.snippet} language={hit.language} id={hit.objectID} setIsSearchModalOpen={setIsSearchModalOpen}/>
   );
  }
  
  return (
    <Modal
      open={isSearchModalOpen}
      onClose={() => {setIsSearchModalOpen(false)}}
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
          overflowY: "auto",
          width: "70%",
          backgroundColor: "#1E1E1E",
          color: "white",
        }}
      >
        <InstantSearch searchClient={searchClient} indexName="posts" insights>
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
                loadingIndicator: "d-none",
              }}
              loadingIconComponent={({ classNames }) => (
                <div className=" h-100 d-flex justify-content-center align-items-center ">
                  <SpinnerSpan />
                </div>
              )}
            />
          </div>
          <div className="mt-4">
          <Hits hitComponent={Hit} />
          </div>
          {/* <Pagination className="d-flex" /> */}

        </InstantSearch>
      </Box>
    </Modal>
  );
}

export default SearchModal;
