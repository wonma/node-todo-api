const expect = require('expect')
const request = require('supertest')

const { Todo } = require('./../models/todo')
const app = require('./../server').app

beforeEach((done) => {
    Todo.deleteMany({}).then(() => done())
})

describe('POST /todo', () => {
    it('should create a new todo', (done) => {
        let inputText = 'This is test message'
        
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
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(inputText)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should not create a new todo', (done) => {
        const text = ''
        
        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            })
    })
})
