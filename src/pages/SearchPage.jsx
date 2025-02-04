import {algoliasearch }from 'algoliasearch';
import { InstantSearch, SearchBox , Hits , Highlight ,RefinementList , Pagination ,Configure} from 'react-instantsearch';
import "../css/SearchPage.css"
import Snippet from '../components/saved/local-snippets/Snippet';


const algoliaId=process.env.REACT_APP_ALGOLIA_APP_ID 
const algoliaSearchKey = process.env.REACT_APP_ALGOLIA_SEARCH_KEY 
const searchClient = algoliasearch(algoliaId, algoliaSearchKey);

function Hit({ hit }) {
      return (
       <Snippet title={hit.title}  content={hit.snippet} language={hit.language}/>
     );
    }

function SearchPage() {
  return (
    <div className="search-page">
      <InstantSearch searchClient={searchClient} indexName="posts" insights>
        <Configure hitsPerPage={40} />
        <div className='w-100 d-flex justify-content-center py-4'>
          <SearchBox classNames={{
            input : 'search-box'
          }}/>
        </div>
        <RefinementList attribute="language" />
        <Hits hitComponent={Hit} />
        <Pagination className="d-flex" />
      </InstantSearch>
    </div>
  );
}

export default SearchPage