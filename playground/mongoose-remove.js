const mongoose = require('./../server/db/mongoose')
const { ObjectId } = require('mongodb')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// Todo.deleteMany().then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const id = '5c792dc70ad7c64e0734a9af'


Todo.findOneAndDelete().then((doc) => {
    console.log(doc)
}).catch((e) => {
    console.log(e)
})

// Todo.findByIdAndDelete

// const newTodo = new Todo({
//     text: 'haha'
// })

// newTodo.save().then((doc) => {
//     console.log(doc)
// })
