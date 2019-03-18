let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var IteSchema = new Schema({

    cabinet: { type: String },
    nume: { type: String },
    telefon: { type: String },
    ite_inregistrat_pacient: { type: String },
    data_inregistrare: { type: String, default: () => new moment().format('DD/MM/YYYY') },
    data_estimativa: {
        type: String, default: () => new moment().add(6, 'days').format('DD/MM/YYYY')
    },
    model_aparat: { type: String },
    ureche_protezata: { type: String },
    carcasa_ite: { type: String },
    culoare_carcasa: { type: String },
    buton_programe: { type: String },
    potentiometru_volum: { type: String },
    vent_ite: { type: String },
    pret_lista: { type: String },
    pret_final: { type: Number },
    avans: { type: Number },
    data_avans: { type: String },
    rest_plata: { type: Number },
    observatii_ite: { type: String },
    serie_ite: { type: String },
    pacient_id: { type: String },
    predat_pacient: { type: String },
    ite_taxa_urgenta: { type: String },
    iesit_cabinet: { type: String },
    intrat_cabinet: { type: String },
    completare_cabinet: { type: String },
    nr_comanda_ite: { type: Number },

    // //     Logistic ----------------------------------------------
    log_sosit: { type: String, },
    log_plecat: { type: String },
    log_preluat: { type: String },
    log_trimis: { type: String },


    // //     Laborator Asamblare ----------------------------------------------

    asamblare_sosit: { type: String, },
    finalizat_ite: { type: String, },
    asamblare_plecat: { type: String, },
    observatii_asamblare: { type: String, },
    executant_ite: { type: String },


}).plugin(AutoIncrement, { inc_field: 'nr_comanda_ite' });

var Ite = mongoose.model('Ite', IteSchema);
module.exports = Ite;

