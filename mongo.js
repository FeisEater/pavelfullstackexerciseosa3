const mongoose = require('mongoose')

const url = 'salaisuus'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const person = new Person({
  name: process.argv[2],
  number: process.argv[3]
})

person
  .save()
  .then(response => {
    console.log('lisätään henkilö ' + person.name + ' numero ' + person.number + ' luetteloon')
    mongoose.connection.close()
  })
