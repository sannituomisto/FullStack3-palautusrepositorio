const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
      },
      {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }

]

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })


app.get('/info', (req, res) => {
    const count = persons.length
    const timestamp = new Date()
    res.send(`<p>Phonebook has info for ${count} people</p>
        <p>${timestamp}</p>`)
  })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
  })

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  })

app.post('/api/persons', (req, res) => {
    const body = req.body
    const names = persons.map(n => n.name)
    if (!body.name) {
        return res.status(400).json({ 
            error: 'name missing' 
        })
    }
    if (!body.number) {
        return res.status(400).json({ 
            error: 'number missing' 
        })
    }
    if (names.includes(req.body.name)) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const newId = Math.floor(Math.random()*1000)
    const person = {
        id: newId,
        name: body.name,
        number: body.number
      }
    persons = persons.concat(person)
    res.json(person)
  })

  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})