import React from 'react'
import './styles/Container.css'


function MainPageContainer(props) {
  return (
    <div>
        
        <div class="container-fluid page-content">
            <div class="row min-vh-100">
                {props.children}
            </div>
        </div>

    </div>
  )
}

export default MainPageContainer