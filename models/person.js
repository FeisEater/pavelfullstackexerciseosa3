const mongoose = require('mongoose')

const url = 'salaisuus'

mongoose.connect(url)

const PersonSchema = mongoose.Schema({
    name: String,
    number: String    
})

PersonSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', PersonSchema)
  
module.exports = Person
