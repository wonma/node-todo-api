const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
    const user = this

    const access = 'auth'
    const token = jwt.sign({_id: user._id.toHexString(), access:access}, 'abc123').toString()
    // token에는 id와 access값이 encoded 되게 됨.
    // 차후에 findOne으로 유저를 fetch해 올 때 기준들로 id, access, token자체 3개를 확인하게 됨.

    user.tokens = user.tokens.concat([{ access, token }])

    return user.save().then(() => { // tokens가 채워진 user obj이 db에 저장됨
        return token
    }) // 결국 이 펑션 전체는 token값을 뱉어내는 Promise를 리턴함
}

UserSchema.methods.removeToken = function (token) {
    const user = this
    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

UserSchema.statics.findByToken = function (token) {

    const User = this
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123')
    } catch (e) {
        return Promise.reject()
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.access': decoded.access,
        'tokens.token': token
    })
}

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject()
        }
        return bcrypt.compare(password, user.password).then((res) => {
            return res ? user : Promise.reject()
        })
    })
}

UserSchema.pre('save', function (next) {
    const user = this
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = {User}