const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
