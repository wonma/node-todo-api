const expect = require('expect')
const request = require('supertest')

const { Todo } = require('./../models/todo')
const app = require('./../server').app

const todos = [{
    text: 'First test todo'
}, {    
    text: 'Second test todo'
}]

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos)  // insertMany는 array of docs 받아들이고
    }).then(() => {                    // id정보를 담은 object를 리턴한다.
        done()
    })

})

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
                expect(res.body.text).toBe(inputText)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }
                
                Todo.find({text: inputText}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(inputText)
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
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})
