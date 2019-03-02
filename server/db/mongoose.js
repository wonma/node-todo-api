const mongoose = require('mongoose')

const env = process.env.NODE_ENV || 'development'
let dbName;
if (env === 'test') {
    dbName = 'TodoAppTest'
} else {
    dbName = 'TodoApp'
}

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_ATLAS_URI,
    { dbName: dbName, useNewUrlParser:true })

module.exports = {mongoose}

// // 다음 둘의 차이는?
// module.exports = {
//     mongoose: mongoose
// }
// // 이름이 없는 object로 지정파일명.mongoose로 값에 접근 가능하다.

// module.exports.mongoose = {
//     mongoose: mongoose
// }
// // 이름이 있는 object로 mongoose라는 이름으로 반드시 require해야한다.
// // 