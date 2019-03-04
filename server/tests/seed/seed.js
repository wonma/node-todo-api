const { ObjectID } = require('mongodb')
const { Todo } = require('./../../models/todo')
const { User } = require('./../../models/user')
const jwt = require('jsonwebtoken')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [{
    _id: userOneId,
    name: 'Babo',
    email: 'baboda@gmail.com',
    password: '123456',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    name: 'Luna',
    email: 'luna@gmail.com',
    password: '123456'
}]

const seedUsers = (done) => {
    User.deleteMany({}).then(() => {
        return User.insertMany(users)  
    }).then(() => {                   
        done()
    })
}

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    // completedAt: 123 // 이래도 되나?
}]

const seedTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos)  // insertMany는 array of docs 받아들이고
    }).then(() => {                    // id정보를 담은 object를 리턴한다.
        done()
    })
}

module.exports = { todos, seedTodos, users, seedUsers }