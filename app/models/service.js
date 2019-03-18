let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var ServiceSchema = new Schema({

    pacient_id: { type: String },
    cabinet: { type: String },
    nume: { type: String },
    telefon: { type: String },
    service_inregistrat_pacient: { type: String },
    denumire_aparat: { type: String },
    data_inregistrare: { type: String, default: () => new moment().format('DD/MM/YYYY') },
    data_estimativa: { type: String, default: () => new moment().add(15, 'days').format('DD/MM/YYYY') },
    taxa_urgenta_cabinet: { type: String },
    denumire_aparat: { type: String, required: true },
    serie_aparat: { type: String, required: true },
    defectiune_reclamata: { type: String, required: true },
    constatare_cabinet: { type: String },
    completare_cabinet: { type: String },
    u_stanga: { type: String, required: true },
    u_dreapta: { type: String, required: true },
    garantie: { type: String, required: true },
    cutie: { type: String, required: true },
    baterie: { type: String, required: true },
    mulaj: { type: String, required: true },
    oliva: { type: String, required: true },
    observatii_cabinet: { type: String },
    observatii_pacient: { type: String },
    iesit_cabinet: { type: String },
    intrat_cabinet: { type: String },
    predat_pacient: { type: String },
    nr_comanda_service: { type: Number },
    updated_at: { type: String },


    // //     Laborator Service ----------------------------------------------
    serv_sosit: { type: String },
    serv_plecat: { type: String },
    constatare_service: { type: String },
    operatiuni_efectuate: { type: String },
    piese_inlocuite: { type: String },
    cod_componente: { type: String },
    cost_reparatie: { type: String },
    executant_reparatie: { type: String },
    taxa_constatare: { type: String, default: 'nu' },
    taxa_urgenta: { type: String, default: 'nu' },
    garantie_serv: { type: String },
    observatii_service: { type: String },
    observatii_service_intern: { type: String },
    finalizat_reparatie: { type: String },

    // //     Logistic ----------------------------------------------

    log_sosit: { type: String, },
    log_plecat: { type: String },
    log_preluat: { type: String },
    log_trimis: { type: String },


}).plugin(AutoIncrement, { inc_field: 'nr_comanda_service' });

ServiceSchema.pre('save', function (next) {
    now = new moment().format('DD/MM/YYYY');
    this.updated_at = now;
    next()
});


var Service = mongoose.model('Service', ServiceSchema);
module.exports = Service;

