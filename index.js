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

let persons = [
    {
      "name": "Virhe virheinen",
      "number": "missing no",
      "id": 1
    }
  ]
  
app.get('/info', (req, res) => {
  res.send('<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot</p><p>' + Date() + '</p>')
})

app.get('/api/persons', (req, res) => {
  Person
  .find({})
  .then(persons => {
    res.json(persons.map(Person.format))
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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
  /*if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({error: 'tämän niminen henkilö on jo luettelossa'})
  }*/

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

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
})

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)  
  const person = Object.assign({}, req.body)
  if (person.name === undefined || person.name.trim() === "") {
    return res.status(400).json({error: 'name missing'})
  }
  if (person.number === undefined || person.number.trim() === "") {
    return res.status(400).json({error: 'number missing'})
  }
  persons = persons.map(p => {
    if (p.id === id) {
      person.id = id
      return person
    }
    return p
  })
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
