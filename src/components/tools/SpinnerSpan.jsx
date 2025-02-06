import React from 'react'

function SpinnerSpan({spanStyle , color}) {
    return (
        <span className="d-flex justify-content-center align-items-center">
            <span className={"spinner-border small "+(color ? color : 'text-primary')} role="status" style={spanStyle} >
                <span className="visually-hidden">Loading...</span>
            </span>
        </span>
      )
    }

export default SpinnerSpan