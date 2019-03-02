const expect = require('expect')
const request = require('supertest')

const { ObjectID } = require('mongodb')
const { Todo } = require('./../models/todo')
const app = require('./../server').app


const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {    
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    // completedAt: 123 // 이래도 되나?
}]

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos)  // insertMany는 array of docs 받아들이고
    }).then(() => {                    // id정보를 담은 object를 리턴한다.
        done()
    })

})

// POST /todo만 있었을 때 썼던 beforeEach
// beforeEach((done) => {
//     Todo.deleteMany({}).then(() => done())
// }) 

describe('POST /todo', () => {
    it('should create a new todo', (done) => {
        let inputText = 'This is a test message'
        
        request(app)
            .post('/todos')
            .send({text: inputText})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(inputText) // Line A
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }
                
                Todo.find({text: inputText}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(inputText) // Line B
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should not create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {  // res.body는 array임
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('should get todo of matched id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
            })
            .end(done)
    })

    it('should receive 404 error with invalid id', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done)
    })

    it('should receive 404 error with no data found', (done) => {
        const newTodoID = new ObjectID
        request(app)
            .get(`/todos/${newTodoID.toHexString()}`)
            .expect(404)
            .end(done)
    })

})

describe('DELETE /todos/:id', () => {
    it('should delete todo of matched id', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }
                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                    expect(todo).not.toBeTruthy()
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should receive 404 error with invalid id', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done)
    })

    it('should receive 404 error with no data found', (done) => {
        const newTodoID = new ObjectID
        request(app)
            .delete(`/todos/${newTodoID.toHexString()}`)
            .expect(404)
            .end(done)
    })

})



describe('PATCH /todos/:id', () => {
    it('should update todo of matched id', (done) => {
        // const hexId = todos[0]._id.toHexString() 해도 되었음
        // const text = 'Change to this' 이렇게 해도 되었음
        const body = {
            text: 'Change to this',
            completed: true
        }
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text)
                expect(res.body.todo.completed).toBeTruthy()
                expect(res.body.todo.completedAt).not.toBeNaN() // 숫자타입임을 이렇게 체크하네
            })
            .end(done)
    })

    it('should have false and null for completed for a todo of matched id', (done) => {
        const body = {
            text: 'I want to live as I am',
            completed: false // 유저가 넣는 정보는 이 두개일 것임
        }                    // completedAt을 넣으면 안되는게, 그것은 유저가 넣는 정보가 아니기 때문
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text)
                expect(res.body.todo.completed).toBeFalsy()
                expect(res.body.todo.completedAt).toBeNull()
            })
            .end(done)
    })
})