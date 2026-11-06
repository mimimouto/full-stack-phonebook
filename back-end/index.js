const express = require('express') // https://expressjs.com/
const morgan = require('morgan') // https://github.com/expressjs/morgan

const app = express()

const persons = [
	{
	  "id": "1",
	  "name": "Arto Hellas",
	  "number": "040-123456"
	},
	{ 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('post', function (req, res) { // Do NOT log sensitive data in practice
  return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const d = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${d}</p>
  `)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  
  response.status(204).end()
})

app.use(express.json())

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
	return response.status(400).json({error: 'missing name / number'})  
  }
  
  const name_match = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())
  if (name_match) {
	return response.status(400).json({error: 'name must be unique'})  
  }
  
  const person = {
	name: body.name,
	number: body.number,
	id: Math.floor(Math.random() * 10000)
  }
  
  new_persons = persons.concat(person)
  
  response.json(new_persons)
})

// env configured in Render
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)	
})