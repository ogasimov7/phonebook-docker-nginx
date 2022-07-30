import React from 'react'

const Filter = (props) => (
    <div>
        <span>
            Search:{' '}
            <input onChange={props.onChange} value={props.value} />
        </span>
    </div>
)

export default Filter