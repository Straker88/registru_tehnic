var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');


var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-z]{3,20})+)$/,
        message: 'Numele trebuie sa contina cel putin 3 caractere, maxim 20, nici un caracter special sau numar, trebuie sa contina un spatiu intre nume si prenume.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Numele trebuie sa fie intre {ARGS[0]} si {ARGS[1]} caractere'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Parola trebuie sa contina cel putin o litera mare, o litera mica, 1 numar, 1 carcater special, sa fie de cel putin 8 caractere si nu mai mult de 35 caractere.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Parola trebuie sa fie intre {ARGS[0]} si {ARGS[1]} caractere'
    })
];

var UserSchema = new Schema({
    name: { type: String, required: true, validate: nameValidator },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, validate: passwordValidator, select: false },
    temporarytoken: { type: String, required: true, unique: true },
    resettoken: { type: String, required: false },
    permission: { type: String, required: true, default: 'admin' },
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.plugin(titlize, {
    paths: ['name']
});

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


var User = mongoose.model('User', UserSchema);
module.exports = User;  