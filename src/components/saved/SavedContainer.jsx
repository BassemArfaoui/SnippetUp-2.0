import React from 'react'
import './styles/container.css'

function SavedContainer(props) {
  return (
    <div className='data-container d-flex flex-column gap-4 pt-3'>
        {props.children}
    </div>
  )
}

export default SavedContainer