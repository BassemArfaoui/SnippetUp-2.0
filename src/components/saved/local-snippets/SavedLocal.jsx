import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Snippet from './Snippet';
import '../styles/saves.css';
import SpinnerSpan from '../../tools/SpinnerSpan'
import Spinner from '../../tools/Spinner';
import { notify } from '../../tools/CustomToaster';

function SavedLocal({ setShowChoice }) {
  const userId = 1;
  const savedLocalRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollThreshold = 40;




  // Fetch snippets using React Query
  const fetchSnippets = async ({ pageParam = 1 }) => {
    const response = await axios.get(
      `http://localhost:4000/${userId}/snippets`,
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
    error,
  } = useInfiniteQuery({
    queryKey: ["snippets"],
    queryFn: fetchSnippets,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.totalPages > pages.length ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isError && error) {
      notify(`Error loading  Snippets`);
    }
  }, [isError, error]);

  // Handle scrolling to trigger loading more snippets
  useEffect(() => {
    const handleScroll = () => {
      if (!savedLocalRef.current) return; // Check if ref is set
      const scrollTop = savedLocalRef.current.scrollTop;
      const scrollDifference = Math.abs(scrollTop - lastScrollTop.current);

      if (scrollDifference >= scrollThreshold) {
        if (scrollTop > lastScrollTop.current) {
          setShowChoice(false);
        } else {
          setShowChoice(true);
        }
        lastScrollTop.current = scrollTop;
      }

      // Load more snippets when scrolled to bottom
      if (
        savedLocalRef.current.scrollHeight - scrollTop <=
          savedLocalRef.current.clientHeight + 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    const savedLocalElement = savedLocalRef.current;
    // Ensure the ref is valid before adding the event listener
    if (savedLocalElement) {
      savedLocalElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (savedLocalElement) {
        savedLocalElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [setShowChoice, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Loading state
  if (isLoading) {
    return (
      <div style={{height:'85vh'}}>
        <Spinner />
      </div>
    );
  }

  // Error state
  if (isError) {
    return <div  style={{height:'85vh'}} className='fw-bolder text-danger fs-2 d-flex justify-content-center align-items-center'>Couldn't Load Snippets 😿 !</div>;
  }

  return (
    <div className="local-saves d-flex flex-column gap-3" ref={savedLocalRef}>
      {data.pages.map((page) =>
        page.snippets.map((snippet) => (
          <Snippet
            key={snippet.id}
            title={snippet.title}
            content={snippet.content}
            language={snippet.language}
            createdAt={snippet.created_at}
            modifiedAt={snippet.modified_at}
            isPosted={snippet.is_posted}
          />
        ))
      )}
      {/* Spinner for loading next page */}
      {isFetchingNextPage && (
        <div className="d-flex justify-content-center my-3 align-items-center">
          <SpinnerSpan />
        </div>
      )}
      {/* Message when no more snippets are available */}
      {!hasNextPage && (
        <div className="text-center my-3 small fw-bold text-secondary">
          No more snippets available.
        </div>
      )}
    </div>
  );
}

export default SavedLocal;
