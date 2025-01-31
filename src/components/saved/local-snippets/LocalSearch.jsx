import React , {useContext} from 'react'
import '../styles/search-result.css'
import userContext from "../../contexts/userContext";




function LocalSearch(props) {
  const {user}= useContext(userContext) ;
  const userId=user.id ;
  return (
    <div className='search-result-container'>{`local searching for ${props.localSearch} ...`}</div>
  )
}

export default LocalSearch