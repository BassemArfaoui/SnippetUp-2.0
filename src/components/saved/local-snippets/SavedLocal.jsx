import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Snippet from './Snippet';
import '../styles/saves.css';
import SpinnerSpan from '../../tools/SpinnerSpan';
import Spinner from '../../tools/Spinner';
import { notify, successNotify } from '../../tools/CustomToaster';
import LoadingSpinner from '../../tools/LoadingSpinner'; // Importing LoadingSpinner

function SavedLocal({ setShowChoice }) {
  const userId = 1;
  const savedLocalRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollThreshold = 40;
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null); // State to track which snippet is being deleted

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

  // Delete mutation
  const deleteSnippet = useMutation({
    mutationFn: async (id) => {
      setDeletingId(id); // Track the ID of the snippet being deleted
      await axios.delete(`http://localhost:4000/${userId}/delete/snippet/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["snippets"]);
      setDeletingId(null); // Reset deleting state after success
      successNotify("Snippet deleted successfully");
    },
    onError: (err) => {
      notify(`Failed to delete snippet`);
      setDeletingId(null); // Reset deleting state after error
    },
  });

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
      notify(`Error loading Snippets`);
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
    if (savedLocalElement) {
      savedLocalElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (savedLocalElement) {
        savedLocalElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [setShowChoice, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div style={{ height: '85vh' }}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{ height: '85vh' }}
        className="fw-bolder text-danger fs-2 d-flex justify-content-center align-items-center"
      >
        Couldn't Load Snippets 😿 !
      </div>
    );
  }

  const hasSnippets = data?.pages?.some((page) => page.snippets.length > 0);

  return (
    <div className="local-saves d-flex flex-column gap-3" ref={savedLocalRef}>
      {!hasSnippets ? (
        <div className="text-center my-3 MT-5  fw-bold text-secondary">
          <span className='mt-5 d-block'> No Snippets ,<br/> Your Snippets will appear here.</span>
        </div>
      ) : (
        <>
          {data.pages.map((page) =>
            page.snippets.map((snippet) => (
              <div key={snippet.id}>
                <Snippet
                  id={snippet.id}
                  title={snippet.title}
                  content={snippet.content}
                  language={snippet.language}
                  createdAt={snippet.created_at}
                  modifiedAt={snippet.modified_at}
                  isPosted={snippet.is_posted}
                  deleteSnippet={deleteSnippet.mutate}
                />
                {/* Show spinner next to the snippet being deleted */}
                {deletingId === snippet.id && <LoadingSpinner bg="bg-primary" />}
              </div>
            ))
          )}

          {isFetchingNextPage && (
            <div className="d-flex justify-content-center my-3 align-items-center">
              <SpinnerSpan />
            </div>
          )}

          {!hasNextPage && hasSnippets && (
            <div className="text-center my-3 small fw-bold text-secondary">
              No more snippets available.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SavedLocal;
