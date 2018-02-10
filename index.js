const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    },
    {
      "name": "Mika Mikasson",
      "number": "040-654321",
      "id": 5
    }
  ]

app.get('/info', (req, res) => {
  res.send('<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot</p><p>' + Date() + '</p>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
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
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    persons = persons.filter(p => p.id !== id)
    console.log(persons)
    res.status(204).end()
  } else {
    res.status(404).end()
  }  
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  if (person.name === undefined || person.name.trim() === "") {
    return res.status(400).json({error: 'name missing'})
  }
  if (person.number === undefined || person.number.trim() === "") {
    return res.status(400).json({error: 'number missing'})
  }
  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({error: 'tämän niminen henkilö on jo luettelossa'})
  }

  person.id = Math.floor(Math.random() * 1000000)
  persons = persons.concat(person)
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
