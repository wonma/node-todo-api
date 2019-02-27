const mongoose = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.post('/todos',(req, res) => {
    const newTodo = new Todo({
        text: req.body.text
    })

    newTodo.save().then((doc) => {
        console.log(doc)
        res.send(doc)
    }, (e) => {
        console.log(e)
        res.status(400).send(e)
    })
})

app.listen(3000)