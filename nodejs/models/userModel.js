const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:   {type: String, required: true, unique: true},
    password:   {type: String, required: true},
    role:       {type: String, required: true},
    name:       {type: String, required: true},
    surname:    {type: String, required: true,},
    email:      {type: String, required: true, unique: true},
});

UserSchema.pre('save', 
    async function(next) {
        const user = this;
        if (!user.isModified('password')) return next();
        
        //const salt = process.env.BCRYPT_SALT ? process.env.BCRYPT_SALT : 10;
        let hash = bcrypt.hashSync(this.password, 10);
        this.password = hash;

        next();
    }
);

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

const UserModel = mongoose.model('user', UserSchema, 'user');

module.exports = UserModel;