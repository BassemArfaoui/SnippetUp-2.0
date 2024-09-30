import { Link } from 'react-router-dom'
import './styles/collections.css'
import CustomTooltip from '../tools/CustomTooltip'
import { IconButton } from '@mui/material'

function SavedPostsCollections(props) {
  return (
    <div className='collections-page'>
        <div>SavedPostsCollections</div>
       


        <div className='cancel-filter-container'>
        <Link to='/saved' className='d-flex justify-content-center align-items-center'>
          <CustomTooltip title='Close Collections' placement='right'>
            <IconButton
              variant="contained"
              aria-label="Toggle notifications"
              className="position-fixed bottom-0 start-0 m-3 mx-4 bg-warning"
              style={{ zIndex: 1050, backgroundColor: "#f8f9fa" }}
            >
               test    
            </IconButton>
          </CustomTooltip>
          </Link>
      </div>

    </div>
  )
}

export default SavedPostsCollections