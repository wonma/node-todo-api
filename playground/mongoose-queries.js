const mongoose = require('./../server/db/mongoose')
const { ObjectId } = require('mongodb')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// 참고로 여기서 
// const { Todo } 하는 것과 const Todo 하는 것은 완전히 다름.

const id = '6c77e03dc184623f6346c2ed'

if (!ObjectId.isValid(id)) {
    console.log('The id is invalid.')
}

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('Id not found')
    }
    console.log(todo)
}).catch((e) => {
    console.log(e)
})