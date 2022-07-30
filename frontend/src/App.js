import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import './App.css'

const Notification = (props) => {
  if (props.msg === '') {
    return (
      <div className="empty"></div>
    )
  }

  return  (
    <div className="empty">
      {props.type === "success"
        ? <div className="notification success">{props.msg}</div>
        : <div className="notification error">{props.msg}</div>
      }
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState({ msg: '', type: '' })

  // controlled components
  const nameChange = (event) => setNewName(event.target.value)
  const numberChange = (event) => setNewNumber(event.target.value)
  const filterChange = (event) => setFilter(event.target.value)

  // On every render re-evaluating list of numbers
  let displayList = []

  // Initially used a setSearch state that was called in a useEffect dependent
  // on persons and filter. That worked but added alot more complexity at the
  // tradeoff of now having to re-evaluate every render.
  if (persons.length !== 0 && filter.length !== 0) {
    displayList = persons.filter(
      (x) => (x.name.slice(0, filter.length).toUpperCase() === filter.toUpperCase())
    )
  } else if (filter.length === 0) {
    displayList = persons
  }

  useEffect(() => {
    // personService object containing axios methods imported from ./services/persons
    personService
      .getAll()
      .then(x => {
        setPersons(x.data)
      })
  }, [])

  const addToPhonebook = (event) => {
    
    let found = persons.find((x) => x.name.toUpperCase() === newName.toUpperCase());

    event.preventDefault()

    // The input name submitted exists in the phonebook
    if (found) {
      if (window.confirm(`${newName}` +
      " is already added to the phonebook," +
      " replace the old number with a new one?")) {
        let changedNumber = { ...found, number: newNumber }
        personService
        .update(found.id, changedNumber)
        // need to find and replace person in persons with new number
        .then(response => {
          // Was getting a 200 response from the backend for a PUT request on 
          // a nonexistent resource which resulted in uncaught error.
          // changed backend to respond with 404 when the response is null
          // fixing the error
          setPersons(persons.map(x => found.id !== x.id ? x : response.data))
        })
        .catch((error) => {
          // https://stackoverflow.com/a/39153411
          console.log("message: ", error.message)
          // Now we can have a 404 for a deleted user (from the server but not yet rendered) 
          // but also a 400 Validation Error from the server
          // Separate the errors and have appropriate frontend responses
          // Best practice would probably also have some frontend validation
          // before interacting with the server
          if (error.response.status === 404) {
            // 404 not found, remove the person from the current render of phonebook
            setPersons(persons.filter(y => found.id !== y.id))
            // display error message
            setMessage({
              msg: `${found.name}'s records were already deleted from the server`,
              type: "error"
            })
            // clear the message after 5 seconds
            setTimeout(() => 
              setMessage({ msg: '', type: '' }), 5000)
          } else if (error.response.status === 400) {
            // Bad Request
            setMessage({
              msg: error.response.data.error,
              type: "error"
            })
            // clear the message
            setTimeout(() => 
            setMessage({ msg: '', type: '' }), 5000)
          }
        })
      }
    }
    else {
      // create new object with the states of the input fields for name and number
      const newObject = {
        name: newName,
        number: newNumber
      }
      
      personService
      .create(newObject)
      .then(response => {
          // concatenate that new object to the end of the persons array,
          // need to use concat with state here to not manipulate the previous state
          setPersons(persons.concat(response.data))
          // Clear the states which clears the input fields
          setNewName('')
          setNewNumber('')
          // Success message
          setMessage({
            msg: `Added ${response.data.name} to the Phonebook`,
            type: "success"
          })
          // Clear the message after 5 seconds
          setTimeout(() => 
            setMessage({ msg: '', type: '' }), 5000)
      })
      .catch(error => {
        console.log(error.response.data)
        setMessage({
          msg: error.response.data.error,
          type: "error"
        })
        // clear the message
        setTimeout(() => 
          setMessage({ msg: '', type: '' }), 5000)
      })
    }
  }

  // func expression takes id param, send delete request with id to server
  // then sync setPersons state to filter out the deleted id
  const DeleteFromPhonebook = (x) => {
    // get name using id
    const nameDelete = (persons.find((z) => z.id === x)).name
    // confirm message
    if (window.confirm(`Delete ${nameDelete}?`)) {
      personService
      .goDelete(x)
      .then(() => setPersons(persons.filter(y => x !== y.id)))
    }
  }

  return (
    <div>
      <Notification type={message.type} msg={message.msg} />

      <h1>My Phonebook</h1>

      <Filter onChange={filterChange} value={filter} />
      
      <h3>Add new contact</h3>

      <PersonForm 
        onSubmit={addToPhonebook}
        nameChange={nameChange}
        numberChange={numberChange}
        nameValue={newName}
        numberValue={newNumber}
      />

      <h3>Contacts</h3>

      <Persons list={displayList} goDelete={DeleteFromPhonebook} />
    </div>
  )
}

export default App