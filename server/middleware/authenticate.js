const { User } = require('./../models/user')

const authenticate = (req, res, next) => {
    const token = req.header('x-auth')

    User.findByToken(token).then((user) => {
        if (!user) {
            Promise.reject()
        }
        req.user = user
        req.token = token
        next()
    }).catch((e) => {
        res.status(401).send()
    })
    // next 위치는 여기가 아닙니다. 그럼 catch 에러를 한 후 종료가 되야하는데 그렇게 안되지
}

module.exports = {authenticate}