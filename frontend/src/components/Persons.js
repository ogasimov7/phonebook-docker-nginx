import React from 'react'
import Person from './Person'

const Persons = (props) => (
    props.list.map((x) => 
    <Person 
        key={x.name} 
        name={x.name} 
        number={x.number}
        goDelete={() => props.goDelete(x.id)}
    />)
)

export default Persons