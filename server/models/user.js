const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// schéma de données User
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 5}
});

// données soient uniques dans la collection MongoDB
userSchema.plugin(uniqueValidator);

// exportation du schéma
module.exports = mongoose.model('User', userSchema);