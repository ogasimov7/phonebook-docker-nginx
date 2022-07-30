import React from 'react'

const Person = (props) => (
    <div>
        <span>{props.name} {props.number}</span>{' '}
        <button onClick={props.goDelete}>Delete</button>
    </div>
)

export default Person