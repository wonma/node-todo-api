const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const app = express()
app.use(bodyParser.json())

app.post('/todos',(req, res) => {
    const newTodo = new Todo({
        text: req.body.text
    })

    newTodo.save().then((doc) => {
        res.send(doc) // doc은 { }, docs 는 [ ]
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => { // todos는 array임
        res.send({todos})   // 이렇게 { } 한 번 감싸주지 않으면, req.body.todos밖에 접근 못함
    }, (e) => {             // 미래에 혹시나 다른 prop에 접근 할 수 도 있으므로 오브젝트에 한 번 담아준거임
        res.status(400).send(e)
    })  
})


app.listen(3000, () => {
    console.log('Started Server')
})

module.exports = {app}