import {algoliasearch }from 'algoliasearch';
import { InstantSearch, SearchBox , Hits , Highlight ,RefinementList , Pagination ,Configure} from 'react-instantsearch';
import "../css/SearchPage.css"

const algoliaId=process.env.REACT_APP_ALGOLIA_APP_ID 
const algoliaSearchKey = process.env.REACT_APP_ALGOLIA_SEARCH_KEY 
const searchClient = algoliasearch(algoliaId, algoliaSearchKey);

function Hit({ hit }) {
      return (
       <article>
         <p><Highlight attribute="title" hit={hit} /></p>
         <p><Highlight attribute="language" hit={hit} /></p>
         <code>${hit.snippet}</code>
        </article>
     );
    }

function SearchPage() {
  return (
    <div  className='search-page'>
<InstantSearch searchClient={searchClient} indexName="posts" insights>
      <Configure hitsPerPage={40} />
      <SearchBox className='mt-5'/>
      <Pagination className='d-flex '/>
      <RefinementList attribute="language" />
      <Hits hitComponent={Hit} />
      <Pagination className='d-flex'/>
    </InstantSearch>
    </div>
  )
}

export default SearchPage