import React , {useState} from 'react'
import '../css/SavedPage.css'
import SavedChoice from '../components/saved/SavedChoice'
import SavedPosts from '../components/saved/SavedPosts';
import SavedLocal from '../components/saved/SavedLocal';
import PostsSearch from '../components/saved/PostsSearch';
import LocalSearch from '../components/saved/LocalSearch';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Box, IconButton } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CustomTooltip from '../components/tools/CustomTooltip';
import SpinnerSpan from '../components/tools/SpinnerSpan'




function SavedPage() {
  
  const [showChoice,setShowChoice]=useState(true);
  const [choice,setChoice]=useState('posts');
  const [isSearching,setIsSearching]=useState('none');
  const [postsSearch , setPostsSearch]=useState('');
  const [localSearch, setLocalSearch]=useState('');

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterContent, setFilterContent] = useState('');
  const [filterLoading,setFilterloading]=useState(false);



  const handleFilterClose = () => {
    setFilterLanguage('');
    setFilterTitle('');
    setFilterContent('');
    setFilterModalOpen(false);
  };


  const handleFilterOpen = () => {
    setFilterModalOpen(true);

  };


  const applyFilters = () => {
    setFilterloading(true);
   };
 
  

  return (



    <div className='saved-page'> 
        {showChoice &&
         <SavedChoice choice={choice} setChoice={setChoice} setIsSearching={setIsSearching} localSearch={localSearch} postsSearch={postsSearch} setLocalSearch={setLocalSearch} setPostsSearch={setPostsSearch} />
        }
           
        {
          isSearching === 'none' ?
          <>{
            choice==='posts' ? <SavedPosts setShowChoice={setShowChoice} handleFilterOpen={handleFilterOpen} handleFilterClose={handleFilterClose} />
            : <SavedLocal  setShowChoice={setShowChoice}/>
            } </> :
           <>
            {
              isSearching==='posts' ? <PostsSearch postsSearch={postsSearch} setShowChoice={setShowChoice}/>
              : <LocalSearch localSearch={localSearch} />
            }
           </>
        }


        <Modal
        open={filterModalOpen}
        onClose={handleFilterClose}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
      >
        <Box
          sx={{
            backgroundColor: '#333',
            width: '60%',
            height: '60vh',
            paddingX: '70px',
            paddingY: '20px',
            overflowY: 'auto',
            borderRadius: '20px',
            color: '#fff', 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', 
            position: 'relative'
          }}
        >
  

            <IconButton
              aria-label="close"
              onClick={handleFilterClose}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: 'white'
              }}
            >
              <CloseIcon className='fs-2'/>
            </IconButton>

        <h2 id="filter-modal-title" className='text-center mb-4 mt-2 fw-bold text-warning'>Filter Saved Posts</h2>

        <div className="filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3">
          <form action="" method='POST'>
            <div className='d-flex flex-column gap-3'>
                <div className='d-flex flex-column flex-md-row gap-3'>
                  <input
                    className='filter-input form-control'
                    placeholder='Title'
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                  />
                  <input
                    value={filterLanguage}
                    className='filter-input form-control'
                    placeholder='Language'
                    onChange={(e) => setFilterLanguage(e.target.value)}
                  />
                </div>
              <textarea
                className='filter-input form-control'
                value={filterContent}
                placeholder='Content'
                onChange={(e) => setFilterContent(e.target.value)}
              ></textarea>
            </div>
          </form>


          <div className="d-flex justify-content-center mt-5">
            <CustomTooltip title='Apply Filters' placement='top'>
              <IconButton
                aria-label="Scroll to End"
                className="mx-4 mt-0 bg-warning" 
                style={{ backgroundColor: '#f8f9fa' }} >

               {!filterLoading ? 
               <DoneRoundedIcon fontSize="large" className="text-dark fw-bolder" onClick={applyFilters}/> : 
               <SpinnerSpan/>
               }

              </IconButton>
            </CustomTooltip>
          </div>
        </div>

        </Box>
      </Modal>
    </div>
  )
}

export default SavedPage