import React from 'react'

function SpinnerSpan(props) {
    return (
        <span className="d-flex justify-content-center align-items-center">
            <span className={"spinner-border small "+(props.color ? props.color : 'text-primary')} role="status" style={props.spanStyle} >
                <span className="visually-hidden">Loading...</span>
            </span>
        </span>
      )
    }

export default SpinnerSpan