const jwt = require('jsonwebtoken')

const user1 = {
    id: 10
}

const token = jwt.sign(user1, 'hehehe')
const result = jwt.verify(token, 'hehehe')

console.log(token)
console.log(result)