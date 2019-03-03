const env = process.env.NODE_ENV || 'development'
console.log('env *****', env)

if (env === 'test') {
    process.env.PORT = 3000
    process.env.MONGODB_ATLAS_URI = 'mongodb://127.0.0.1:27017/TodoAppTest'
} else if (env === 'development') {
    process.env.PORT = 3000
    process.env.MONGODB_ATLAS_URI = 'mongodb://localhost:27017/TodoApp'
}
// 'production' 환경은 위의 조건을 지나치게 된다. 즉 atlas에서 주어지는 값을 받아오게 된다.
