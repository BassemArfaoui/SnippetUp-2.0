import React from 'react'

import api from '../tools/api'





function TestPage() {
  const test = async ()=>
  {
   const response = await api.get('/test')
   console.log(response.data)
  }
  return (
  <div className=' justify-content-center min-vh-100' style={{backgroundColor :'rgb(193, 239, 240)' , paddingBottom : '200px'}}>
        <button onClick={test}>test</button>
    </div>
  )
}

export default TestPage