import React, { useEffect, useState , useContext } from 'react';
import PostSearchResult from './PostSearchResult';
import userContext from "../contexts/userContext";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CustomTooltip from '../tools/CustomTooltip';



export default function SearchHistory({setIsSearchModalOpen}) {
  const [history, setHistory] = useState([]);
  const {user}= useContext(userContext) ;
  const userId=user.id ;


  const handleRemoveFromHistory = (postId) => {
    const updatedHistory = history.filter(item => item.id !== postId);
    setHistory(updatedHistory); 
  };


  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('PostsSearchHistory')) || {};
    setHistory(storedHistory[userId] || [])


  }, [userId]);

  const clearHistory = (userId) => {
    let historyData = JSON.parse(localStorage.getItem("PostsSearchHistory")) || {};

    if (historyData[userId]) {
      delete historyData[userId];
      localStorage.setItem("PostsSearchHistory", JSON.stringify(historyData));
    }

    setHistory([])

  };

  return (
    <div className="d-flex flex-column gap-0">
      {history.length > 0 && (
        <p
          className="fw-bold m-0 p-0 ps-2 pe-2 mb-3 d-flex justify-content-between"
          style={{ fontSize: "22px" }}
        >
          <span>History : </span><CustomTooltip title='Clear History' placement='top'><span  onClick={()=>{clearHistory(userId)}} style={{cursor : 'pointer'}}> <HighlightOffIcon /></span></CustomTooltip>
        </p>
      )}
      {history.length > 0 ? (
        history.map((item) => (
          <PostSearchResult
            history
            handleRemoveFromHistory={handleRemoveFromHistory}
            key={item.id}
            id={item.id}
            title={item.title}
            language={item.language}
            snippet={item.snippet}
            setIsSearchModalOpen={setIsSearchModalOpen}
          />
        ))
      ) : (
        <div className="h-100 d-flex justify-content-center align-items-center mt-5 text-secondary">
          Start typing to see results
        </div>
      )}
    </div>
  );
}
