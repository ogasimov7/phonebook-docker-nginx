const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

console.log('connecting to ', process.env.MONGODB_URI)

if (process.env.MONGODB_URI && !mongoose.connection.readyState) { // readyState 0 when disconnected
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('connected to MongoDB'))
    .catch((error) => console.log('error connecting to MongoDB: ', error.message))
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        return /^([.,/ -]*\d[.,/ -]*){8,}$/.test(v)
      },
      message: 'Number must contain at least 8 digits, number can only contain digits and the  "-.,/" characters'
    },
    minlength: 8
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)