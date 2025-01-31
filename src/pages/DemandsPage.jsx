import React , {useContext} from 'react'
import { Helmet } from 'react-helmet'
import userContext from "../components/contexts/userContext";



function DemandsPage() {

  const {user}= useContext(userContext) ;
  const userId=user.id ;
  return (
    <div>
      <Helmet>
        <title>SnippetUp : Demands</title>
      </Helmet>
      <div className='mt-5 text-center text-secondary fw-bold mb-5' style={{fontSize:'23px'}}>Demands are coming Soon ⏳</div>
    </div>
  )
}

export default DemandsPage