import React , {useContext} from 'react'
import { Helmet } from 'react-helmet'
import userContext from "../components/contexts/userContext";
import cooking from '../utils/svg/cooking.svg'



function DemandsPage() {

  const {user}= useContext(userContext) ;
  const userId=user.id ;
  return (
    <div>
      <Helmet>
        <title>SnippetUp : Demands</title>
      </Helmet>
      <div className='m-0 p-0 mt-2 text-dark text-center fw-bold mt-5' style={{ fontSize: '25px' }}>
              Demands Section is being cooked ⏳
            </div>
            <div className="d-flex justify-content-center mt-3">
              <p className="fw-bolder text-secondary m-0 pt-0 fs-6 mb-4 text-center" style={{width :'400px'}}>
              Users can request snippets, and the community responds with code, linked posts, or Stack Overflow links. Solutions can be commented, liked or disliked to highlight the best ones. Stay tuned!              </p>
            </div>
            <div className='w-100 d-flex justify-content-center mt-4'>
              <img src={cooking} alt='no data illustration' style={{ width: '150px' }} />
            </div>


      
    </div>
  )
}

export default DemandsPage