let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
var titlize = require('mongoose-title-case');

const PacientSchema = new Schema({

    cabinet: { type: String, required: true },
    nume: { type: String, required: true },
    telefon: { type: String, required: true },
    data_inregistrare: { type: String, default: () => new moment().format('DD/MM/YYYY') },
    varsta: { type: Number },
    adresa: { type: String },
    sex: { type: String },
    updated_at: { type: String },
    cnp: { type: String },
    data_nastere: { type: String }

});

PacientSchema.pre('save', function (next) {
    now = new moment().format('DD/MM/YYYY');
    this.updated_at = now;
    next()
});

PacientSchema.plugin(titlize, {
    paths: ['nume']
});



var Pacient = mongoose.model('Pacient', PacientSchema);
module.exports = Pacient;

