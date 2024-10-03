const mongoose = require('mongoose')
const Entry = require('./entry')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        required: true,
        unique: true,
        match:[/^[a-zA-Z0-9._]{3,16}$/, 'Username must only contain between 3-16 letters, numbers, dot, underscore, with no spaces']
    },
    name: {
        type: String,
        minLength: 1,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    entries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entry'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entry'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('User', userSchema)