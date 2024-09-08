import React from 'react'
import './styles/Container.css'


function MainPageContainer(props) {
  return (
    <div>
        
        <div class="main-page container-fluid page-content">
            <div class="">
                {props.children}
            </div>
        </div>

    </div>
  )
}

export default MainPageContainer