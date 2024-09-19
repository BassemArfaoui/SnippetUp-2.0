import React, { useEffect, useRef } from 'react'
import Post from '../parts/Post'
import './styles/saves.css'

function SavedPosts({ setShowChoice }) {
  const savedPostsRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollThreshold = 40;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = savedPostsRef.current.scrollTop;
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

    const savedPostsElement = savedPostsRef.current;
    savedPostsElement.addEventListener('scroll', handleScroll);

    return () => {
      savedPostsElement.removeEventListener('scroll', handleScroll);
    };
  }, [setShowChoice]);

  return (
    <div className='saved-posts d-flex flex-column gap-4 pt-3' ref={savedPostsRef}>
    <Post
      key={`4654556`}     
      id={7000}
      title={'saved page test'}
      snippet={'this a random text'}
      description={'random desc'}
      posterId={1}
      language={'newLang'}
      likeCount={4}
      dislikeCount={0}
      commentCount={8}
      shareCount={4}
      isLiked={true}
      isDisliked={false}
      isSaved={true}
      isInterested={true}
      githubLink={'test.com'}
      firstname={'Bassem'}
      lastname={'Arf'}
      username={'@@@@tet'}
    />
    <Post
      key={`4654557`}     
      id={7001}
      title={'saved page test 2'}
      snippet={'this is another random text'}
      description={'another random desc'}
      posterId={2}
      language={'anotherLang'}
      likeCount={5}
      dislikeCount={1}
      commentCount={10}
      shareCount={3}
      isLiked={false}
      isDisliked={false}
      isSaved={true}
      isInterested={true}
      githubLink={'test2.com'}
      firstname={'John'}
      lastname={'Doe'}
      username={'johndoe'}
    />
    <Post
      key={`4654558`}     
      id={7002}
      title={'saved page test 3'}
      snippet={'yet another random text'}
      description={'yet another random desc'}
      posterId={3}
      language={'thirdLang'}
      likeCount={7}
      dislikeCount={2}
      commentCount={15}
      shareCount={6}
      isLiked={true}
      isDisliked={false}
      isSaved={true}
      isInterested={false}
      githubLink={'test3.com'}
      firstname={'Jane'}
      lastname={'Smith'}
      username={'janesmith'}
    />
    <br/>
  </div>
  )
}

export default SavedPosts
