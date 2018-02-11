const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => { return req.body ? JSON.stringify(req.body) : '' })

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))
  
app.get('/info', (req, res) => {
  Person
  .find({})
  .then(persons => {
    res.send('<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot</p><p>' + Date() + '</p>')
  })
})

app.get('/api/persons', (req, res) => {
  Person
  .find({})
  .then(persons => {
    res.json(persons.map(Person.format))
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person
  .findById(req.params.id)
  .then(Person.format)
  .then(person => {
    res.json(person)
  })
  .catch(error => {
    res.status(404).send({error: 'malformatted id'})
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
  .findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => {
    res.status(404).send({error: 'malformatted id'})
  })
})

app.post('/api/persons', (req, res) => {
  if (req.body.name === undefined || req.body.name.trim() === "") {
    return res.status(400).json({error: 'name missing'})
  }
  if (req.body.number === undefined || req.body.number.trim() === "") {
    return res.status(400).json({error: 'number missing'})
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

  Person
  .find({name: person.name})
  .then(foundPersons => {
    if (foundPersons.length <= 0) {
      person
      .save()
      .then(Person.format)
      .then(savedPerson => {
        res.json(savedPerson)
      })
      .catch(error => {
        console.log(error)
        res.status(404).end()
      })
    } else {
      throw true
    }
  })
  .catch(error => {
    res.status(404).send({error: 'tämän niminen henkilö on jo luettelossa'})
  })
})

app.put('/api/persons/:id', (req, res) => {
  if (req.body.name === undefined || req.body.name.trim() === "") {
    return res.status(400).json({error: 'name missing'})
  }
  if (req.body.number === undefined || req.body.number.trim() === "") {
    return res.status(400).json({error: 'number missing'})
  }
  
  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person
  .findByIdAndUpdate(req.params.id, person, { new: true } )
  .then(Person.format)
  .then(updatedNote => {
    res.json(updatedNote)
  })
  .catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformatted id' })
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
