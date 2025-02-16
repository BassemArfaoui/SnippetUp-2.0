import cooking from '../../utils/svg/cooking.svg'



function SolvedDemands() {
  return (
    <div className='mb-5'>
       <div className='m-0 p-0 mt-2 text-dark text-center fw-bold mt-5' style={{ fontSize: '22px' }}>
            User's solved Demands will be displayed here ⏳
            </div>
            <div className="d-flex justify-content-center mt-3">
              <p className="fw-bolder text-secondary m-0 pt-0 fs-6 mb-4 text-center" style={{width :'400px'}}>
               Demands are coming soon : Users can request snippets, and the community responds with code, linked posts, or Stack Overflow links. Solutions can be commented, liked or disliked to highlight the best ones. Stay tuned!              </p>
            </div>
            <div className='w-100 d-flex justify-content-center mt-4'>
              <img src={cooking} alt='no data illustration' style={{ width: '150px' }} />
            </div>

    </div>
  )
}

export default SolvedDemands