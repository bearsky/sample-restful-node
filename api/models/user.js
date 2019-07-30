const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 8
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);