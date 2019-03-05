const expect = require('expect')
const request = require('supertest')

const { ObjectID } = require('mongodb')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')
const app = require('./../server').app
const { todos, seedTodos, users, seedUsers } = require('./seed/seed')

beforeEach(seedUsers)
beforeEach(seedTodos)

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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe('POST /users', () => {
    it('should create a new user', (done) => {
        const user = {
            name: 'Shimkung',
            email: 'shimkung@naver.com',
            password: '123456'
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('_id')
                expect(res.body.email).toBe(user.email)
                expect(res.headers).toHaveProperty('x-auth')
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findOne({email: user.email}).then((userInDB) => {
                    expect(userInDB).not.toBeNull()
                    expect(userInDB.password).not.toBe(user.password)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should not create user if request is invalid', (done) => {
        const wrongUser = {
            name: 'Shimkung',
            email: 'shimkungcom',
            password: '12356'
        }
        request(app)
            .post('/users')
            .send(wrongUser)
            .expect(400)
            .end(done)
    })


    it('should not create user if the email alraedy exists', (done) => {
        const wrongUser = {
            name: 'Shimkung',
            email: 'baboda@gmail.com',
            password: '123456'
        }
        request(app)
            .post('/users')
            .send(wrongUser)
            .expect(400)
            .end(done)
    })
})

describe('POST /users/login', () => {  //로그인하는 행위 =  user오브젝트, auth를 받아오기?
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password:users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[1].email)
                expect(res.headers).toHaveProperty('x-auth')
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toMatchObject({access:'auth', token:res.headers['x-auth']})
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 1
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers).not.toHaveProperty('x-auth')
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens).toHaveLength(0)
                    done()
                }).catch((e) => done(e))
            })
    })
})
