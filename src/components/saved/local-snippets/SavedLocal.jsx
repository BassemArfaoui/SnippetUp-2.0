import React, { useEffect, useRef } from 'react'
import '../styles/saves.css'
import Snippet from './Snippet';

function SavedLocal({ setShowChoice }) {
  const savedLocalRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollThreshold = 40;

  useEffect(() => {
    const handleScroll = () => {
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
    };

    const savedLocalElement = savedLocalRef.current;
    savedLocalElement.addEventListener('scroll', handleScroll);

    return () => {
      savedLocalElement.removeEventListener('scroll', handleScroll);
    };
  }, [setShowChoice]);

  return (
    <div className='local-saves d-flex flex-column gap-3' ref={savedLocalRef}>
      {[...Array(17)].map((_, index) => (
        <Snippet/>
      ))}
      <br/>
    </div>
  )
}

export default SavedLocal
