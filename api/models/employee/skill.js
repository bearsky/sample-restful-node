const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    technology: String
});

const Skill = mongoose.model('Skill', skillSchema);

exports.Skill = Skill;
exports.skillSchema = skillSchema;