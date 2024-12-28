import React from 'react'

function Ad({param}) {
  return (
    <div className='w-100 px-1'>
        <div className="card w-100 border-2">
            <div className="card-body">
                <h5 className="card-title">Ad</h5>
                <p className="card-text">{param}</p>
            </div>
        </div>
    </div>
  )
}

export default Ad