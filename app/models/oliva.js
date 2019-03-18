let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
const AutoIncrement = require('mongoose-sequence')(mongoose);


var OlivaSchema = new Schema({

    cabinet: { type: String },
    nume: { type: String },
    telefon: { type: String },
    oliva_inregistrat_pacient: { type: String },
    data_inregistrare: { type: String, default: () => new moment().format('DD/MM/YYYY') },
    data_estimativa: {
        type: String, default: () => new moment().add(6, 'days').format('DD/MM/YYYY')
    },
    model_aparat: { type: String },
    ureche_protezata: { type: String },
    material_oliva: { type: String },
    tip_oliva: { type: String },
    vent_oliva: { type: String },
    pret_final: { type: Number },
    avans: { type: Number },
    data_avans: { type: String },
    rest_plata: { type: Number },
    observatii_oliva: { type: String },
    serie_oliva: { type: String },
    pacient_id: { type: String },
    predat_pacient: { type: String },
    oliva_taxa_urgenta: { type: String },
    iesit_cabinet: { type: String },
    intrat_cabinet: { type: String },
    completare_cabinet: { type: String },
    nr_comanda_oliva: { type: Number },

    // //     Logistic ----------------------------------------------
    log_sosit: { type: String, },
    log_plecat: { type: String },
    log_preluat: { type: String },
    log_trimis: { type: String },

    // //     Laborator Plastie ----------------------------------------------

    plastie_sosit: { type: String, },
    finalizat_oliva: { type: String, },
    plastie_plecat: { type: String, },
    observatii_plastie: { type: String, },
    executant_oliva: { type: String },


}).plugin(AutoIncrement, { inc_field: 'nr_comanda_oliva' });


var Oliva = mongoose.model('Oliva', OlivaSchema);
module.exports = Oliva;

