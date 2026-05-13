const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
app.use(express.static('dist'));

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream:logStream}));
app.use(express.json()); 
app.use(cors());

const notes = [
    {
        "id": "1",
        "name": "Hai Phuong",
        "number": "0123456789"
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

app.get('/api/persons', (req,res) => {
    res.json(notes);
})

app.get('/info', (req,res) => {
    res.send(`<h1>Phonebook has info for ${notes.length} people <br> ${new Date()}</h1>`);
})

app.get('/api/persons/:id', (req,res) => {
    const id = req.params.id;
    const person = notes.find(note => note.id === String(id));
    if(person) {
        res.json(person);
    }
    else {
        res.status(404).end('Person not found');
    }
})

app.post('/api/persons/', (req,res) => {
    const id = String(Math.floor(Math.random() * 1000));
    const name = req.body.name;
    const number = req.body.number;

    if(!name || !number)   {
        return res.status(400).json({err : 'Name and number are required'});
    }

    const existingPerson = notes.find(note => note.name === name);
    if(!existingPerson) {
        const newPerson = {
            "id" : id,
            "name" : name,
            "number" : number
        }
        notes.push(newPerson);
        res.json(newPerson);
    } else {
        res.status(400).json({err : 'Name must be unique'});
    }
})

app.delete('/api/persons/:id' , (req,res) => {
    const id = req.params.id;
    const personIndex = notes.findIndex(note => note.id === String(id));
    if(personIndex !== -1) {
        notes.splice(personIndex, 1);
        res.status(204).end();
    } else {
        res.status(404).end('Person not found');
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})