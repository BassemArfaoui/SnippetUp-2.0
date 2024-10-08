import React, { useEffect, useRef } from 'react'
import '../styles/saves.css'

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
    <div className='local-saves' ref={savedLocalRef}>
      {[...Array(17)].map((_, index) => (
        <h1 key={index} className='text-center'>test</h1>
      ))}
      <br/>
    </div>
  )
}

export default SavedLocal
