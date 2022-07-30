const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./mongo/models/person')

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', function(req) {
  return JSON.stringify(req.body, null, 2)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons)
    })
})
app.get('/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person){
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      let totalPeople = persons.length
      res.send(`<p>This phonebook has ${totalPeople} people</p> <p>${new Date()}</p>`)
    })
})

app.post('/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(newEntry => {
      res.json(newEntry)
    })
    .catch(error => next(error))
})

app.delete('/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(res.status(204).end())
    .catch(error => next(error))
})

app.put('/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then(updatedNumber => {
      if (updatedNumber) res.json(updatedNumber)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {

  console.error(error.message)

  if (error.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  else if (error.name === 'ValidationError') return res.status(400).send({ error: error.message })
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))