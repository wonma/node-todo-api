const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_ATLAS_URI ||'mongodb://localhost:27017/TodoApp',
    { dbName: 'todos', userNewUrlParser:true })

module.exports.mongoose = {mongoose}

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