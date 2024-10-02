import React from 'react';
import { useParams } from 'react-router-dom';

function CollectionPosts() {
  // Access the "collection" parameter from the route
  const { collection } = useParams();

  return (
    <div>
      {/* Display the collection parameter in an h1 */}
      <h1>Collection: {collection}</h1>
    </div>
  );
}

export default CollectionPosts;
