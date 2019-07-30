const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {departmentSchema} = require('./department');
const {positionSchema} = require('./position');
const {skillSchema} = require('./skill');

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    department: {
        type: departmentSchema,
        required: true
    },
    position: {
        type: positionSchema,
        required: true
    },
    skills: [skillSchema]
});

module.exports = mongoose.model('Employee', employeeSchema);