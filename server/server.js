const config = require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')

const { ObjectId } = require('mongodb')
const { mongoose } = require('./db/mongoose') // 이거 왜 써야하지??
// mongoose.js에서 connection했던 내용들 다 들고와서 오른쪽에서 resolve 됨.
// 비록 mongoose.~~이런식으로 아래에 쓰이지 않았더라도 
// '='의 오른쪽에서 필요한 작업을 모두 execution한 것임.


const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const port = process.env.PORT

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
        res.send({todos})   
    }, (e) => {             
        res.status(400).send(e)
    })  
}) 

app.get('/todos/:id', (req, res) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        return res.status(404).send('id is invalidddddd')
    } 

    Todo.findById(id).then((todo) => {
        if (!todo) {
            res.status(404).send('hmm 404 error, ID not found')
        }
        res.send({todo})
    }).catch((e) => {
        res.status(400).send('Bad request! Invalid ID')
        // possible cause : server disconnection....
    })
})

// res.send({todos})이렇게 {}로 담지 않으면, 후에 res.body.todos밖에 접근 못함
// 미래에 혹시나 다른 prop에 접근 할 수 도 있으므로 오브젝트에 한 번 담아준거임

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        return res.status(404).send('id is invalidddddd')
    }

    Todo.findByIdAndDelete(id).then((todo) => {
        if (!todo) {
            res.status(404).send('hmm 404 error, ID not found')
        }
        res.send({ todo })
    }).catch((e) => {
        res.status(400).send('Bad request! Invalid ID')
        // possible cause : server disconnection....
    })
})

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) {
        return res.status(404).send('id is invalidddddd')
    }

    // pick props from req.body
    const body = _.pick(req.body, ['text', 'completed'])  //안의 prop은 당연히 string으로 써줘야함
    // update body object with 'completedAt' depending on 'completed'
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send('todo not found')
        }
        res.send({todo})
    }).catch((e) => {
        res.status(400).send()
    })
})

app.listen(port, () => {
    console.log('Started Server')
})
module.exports = {app}