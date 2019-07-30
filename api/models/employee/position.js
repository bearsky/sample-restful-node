const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const Position = mongoose.model('Position', positionSchema);

exports.Position = Position;
exports.positionSchema = positionSchema;