import React from 'react'
import './styles/search-result.css'



function LocalSearch(props) {
  return (
    <div className='search-result-container'>{`local searching for ${props.localSearch} ...`}</div>
  )
}

export default LocalSearch