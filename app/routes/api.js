var User = require('../models/user');
var Pacient = require('../models/pacient');
var Service = require('../models/service');
var Recarcasare = require('../models/recarcasare');
var Oliva = require('../models/oliva');
var Ite = require('../models/ite');
var jwt = require('jsonwebtoken');
var secret = 'clarfontehnic';
var moment = require('moment');
var passport = require('passport');
var _ = require('underscore');
require('log-timestamp');

module.exports = function (router) {



    // User Reg. Route
    // -------------------------------------------------------------------------------------------------

    router.post('/users', function (req, res) {
        var user = new User();

        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.temporarytoken = jwt.sign({ username: user.username }, secret);

        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.name == null || req.body.name == '') {
            res.json({ success: false, message: 'Campurile username si parola sunt obligatorii' });

        } else {
            user.save(function (err) {
                if (err) {

                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else if (err) {
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'Username deja exista' });
                            }
                        } else {
                            res.json({ succes: false, message: err });
                        }
                    }
                } else {
                    res.json({ success: true, message: 'Utilizator Adaugat!' });
                }
            });
        }
    });

    // User Login Route ----------------------------------------------

    router.post('/authenticate', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) { return (err); }
            if (!user) {
                return res.redirect('/login');
            }
            req.logIn(user, function (err) {
                if (err) { return (err); }
                if (!user) {
                    res.json({ success: false, message: 'Nu s-a putut autentifica utilizatorul' });
                }
                User.findOne({ username: req.user.username }).select('username password').exec(function (err, userLogged) {
                    if (!userLogged) {
                        res.json({ success: false, message: 'Nu s-a putut autentifica utilizatorul' });
                    }
                    var validPassword = userLogged.validPassword(req.body.password);
                    if (!validPassword) {
                        res.json({ success: false, message: 'Parola introdusa nu este corecta' });
                    }
                    else {
                        res.send({ success: true, message: 'Utilizator autentificat', token: token, username: user.username, permission: user.permission });
                    }
                });
            });
        })
            (req, res, next);
    });

    router.post('/me', function (req, res) {
        res.send(req.user);
    });

    router.get('/permission', function (req, res) {
        //req.session.passport.user
        var utilizator = req.user
        res.send({ success: true, permission: utilizator.permission, usernamePermission: utilizator.username });
    });


    // Pacient Reg. Route 
    // -------------------------------------------------------------------------------------------------

    router.post('/pacienti', function (req, res) {
        Pacient.find({ cnp: req.body.cnp }).select('_id cabinet').exec(function (err, pacient_existent) {
            if (err) throw err;
            if (!pacient_existent) {
            }
            else if (pacient_existent.length > 0) {

                res.json({ message: 'Pacient deja inregistrat in cabinetul' + ' ' + pacient_existent[0].cabinet, pacient_existent: pacient_existent[0] });
            }

            else {
                var pacient = new Pacient();
                pacient.cabinet = req.user.username;
                pacient.nume = req.body.nume;
                pacient.telefon = req.body.telefon;
                pacient.data_inregistrare = new moment().format('DD/MM/YYYY');
                pacient.adresa = req.body.adresa;
                pacient.cnp = req.body.cnp;

                function getAge(dateString) {
                    var today = new Date();
                    var birthDate = new Date(dateString);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return age;
                }

                if (pacient.cnp == null) {
                    pacient.cnp = '';
                } else {

                    if (pacient.cnp.toString()[0] == 1) {
                        pacient.sex = 'M';
                        var x = 19 + pacient.cnp.toString()[1] + pacient.cnp.toString()[2]
                        var y = pacient.cnp.toString()[3] + pacient.cnp.toString()[4]
                        var z = pacient.cnp.toString()[5] + pacient.cnp.toString()[6]
                        var n = x + '/' + y + '/' + z;
                        pacient.data_nastere = x + '/' + y + '/' + z
                        pacient.varsta = getAge(n);
                    }

                    else if (pacient.cnp.toString()[0] == 2) {
                        pacient.sex = 'F';
                        var x = 19 + pacient.cnp.toString()[1] + pacient.cnp.toString()[2]
                        var y = pacient.cnp.toString()[3] + pacient.cnp.toString()[4]
                        var z = pacient.cnp.toString()[5] + pacient.cnp.toString()[6]
                        var n = x + '/' + y + '/' + z;
                        pacient.data_nastere = x + '/' + y + '/' + z
                        pacient.varsta = getAge(n);
                    }

                    else if (pacient.cnp.toString()[0] == 5) {
                        pacient.sex = 'M';
                        var x = 20 + pacient.cnp.toString()[1] + pacient.cnp.toString()[2]
                        var y = pacient.cnp.toString()[3] + pacient.cnp.toString()[4]
                        var z = pacient.cnp.toString()[5] + pacient.cnp.toString()[6]
                        var n = x + '/' + y + '/' + z;
                        pacient.data_nastere = x + '/' + y + '/' + z
                        pacient.varsta = getAge(n);
                    }

                    else if (pacient.cnp.toString()[0] == 6) {
                        pacient.sex = 'F';
                        var x = 20 + pacient.cnp.toString()[1] + pacient.cnp.toString()[2]
                        var y = pacient.cnp.toString()[3] + pacient.cnp.toString()[4]
                        var z = pacient.cnp.toString()[5] + pacient.cnp.toString()[6]
                        var n = x + '/' + y + '/' + z;
                        pacient.data_nastere = x + '/' + y + '/' + z
                        pacient.varsta = getAge(n);
                    }
                }


                if (req.body.nume == null || req.body.nume == '') {
                    res.json({ success: false, message: 'Completeaza Numele' });
                }
                else if (req.body.telefon == null || req.body.telefon == '') {
                    res.json({ success: false, message: 'Completeaza Telefon' });
                }
                else if (req.body.cnp == null || req.body.cnp == '') {
                    res.json({ success: false, message: 'Completeaza CNP' });
                }
                else if (pacient.cnp.length < 13) {
                    res.json({ success: false, message: 'CNP nu contine 13 caractere' });
                }
                else if (isNaN(pacient.varsta)) {
                    res.json({ success: false, message: 'CNP Invalid' });
                }
                else if (req.body.adresa == null || req.body.adresa == '') {
                    res.json({ success: false, message: 'Completeaza Adresa' });
                }

                else {
                    pacient.save(function (err) {

                        if (err) {
                            res.json({ succes: false, message: err });
                        } else {

                            res.json({ success: true, message: 'Pacient adaugat cu succes. Se redirectioneaza catre profilul pacientului...', pacient: pacient._id });
                        }

                    });
                }


            }
        });


    });


    // Service Reg. Route 
    // -------------------------------------------------------------------------------------------------

    router.post('/service', function (req, res) {
        Service.findOne({}, {}, { sort: { 'nr_comanda_service': -1 } }, function (err, comanda_service) {

            if (err) throw err;
            else {
                var service = new Service();
                service.pacient_id = req.body.service_pacient_id;
                service.cabinet = req.user.username;
                service.nume = req.body.nume;
                service.telefon = req.body.telefon;
                service.service_inregistrat_pacient = req.body.service_inregistrat_pacient;
                service.denumire_aparat = req.body.denumire_aparat;
                service.serie_aparat = req.body.serie_aparat;
                service.defectiune_reclamata = req.body.defectiune_reclamata;
                service.constatare_cabinet = req.body.constatare_cabinet;
                service.completare_cabinet = '-';
                service.u_stanga = req.body.u_stanga;
                service.u_dreapta = req.body.u_dreapta;
                service.garantie = req.body.garantie;
                service.cutie = req.body.cutie;
                service.baterie = req.body.baterie;
                service.mulaj = req.body.mulaj;
                service.oliva = req.body.oliva;
                service.observatii_cabinet = req.body.observatii_cabinet;
                service.observatii_pacient = req.body.observatii_pacient;
                service.iesit_cabinet = '-';
                service.intrat_cabinet = '-';
                service.predat_pacient = '-';
                service.taxa_urgenta_cabinet = req.body.taxa_urgenta_cabinet;


                service.log_sosit = '-';
                service.log_plecat = '-';
                service.log_preluat = '-';
                service.log_trimis = '-';


                service.serv_sosit = '-';
                service.serv_plecat = '-';
                service.finalizat_reparatie = '-';
                service.executant_reparatie = '-';
                service.piese_inlocuite = '-';
                service.cod_componente = '-';
                service.garantie_serv = req.body.garantie_serv;
                service.observatii_service = req.body.observatii_service;
                service.observatii_service_intern = '-';
                service.constatare_service = '-';
                service.operatiuni_efectuate = '-';
                service.cost_reparatie = '-';
                service.observatii_service = '-';
                service.garantie_serv = '-';

                if (req.body.denumire_aparat == null || req.body.denumire_aparat == '') {
                    res.json({ success: false, message: 'Completeaza Denumire Aparat' });
                }

                else if (req.body.serie_aparat == null || req.body.serie_aparat == '') {
                    res.json({ success: false, message: 'Completeaza Serie Aparat' });
                }

                else if (req.body.defectiune_reclamata == null || req.body.defectiune_reclamata == '') {
                    res.json({ success: false, message: 'Completeaza Defectiune Reclamata' });
                }

                else if (req.body.constatare_cabinet == null || req.body.constatare_cabinet == '') {
                    res.json({ success: false, message: 'Completeaza Constatare Cabinet' });
                }

                else if (req.body.u_stanga == null || req.body.u_stanga == '') {
                    res.json({ success: false, message: 'Alege optiune Urechea Stanga' });
                }

                else if (req.body.u_dreapta == null || req.body.u_dreapta == '') {
                    res.json({ success: false, message: 'Alege optiune Urechea Dreapta' });
                }

                else if (req.body.garantie == null || req.body.garantie == '') {
                    res.json({ success: false, message: 'Alege optiune Garantie' });
                }

                else if (req.body.cutie == null || req.body.cutie == '') {
                    res.json({ success: false, message: 'Alege optiune Cutie' });
                }

                else if (req.body.baterie == null || req.body.baterie == '') {
                    res.json({ success: false, message: 'Alege optiune Baterie' });
                }

                else if (req.body.mulaj == null || req.body.mulaj == '') {
                    res.json({ success: false, message: 'Alege optiune Mulaj' });
                }

                else if (req.body.oliva == null || req.body.oliva == '') {
                    res.json({ success: false, message: 'Alege optiune Oliva' });
                }

                else {

                    service.save(function (err) {
                        if (err) {
                            res.json({ succes: false, message: err });
                        } else {
                            res.json({ success: true, message: 'Service adaugat cu succes.', comanda_service: comanda_service.nr_comanda_service });
                        }
                    });

                }
            }

        });
    });


    // Recarcasare Reg. Route 
    // -------------------------------------------------------------------------------------------------

    router.post('/recarcasare', function (req, res) {
        Recarcasare.findOne({}, {}, { sort: { 'nr_comanda_recarcasare': -1 } }, function (err, comanda_recarcasare) {
            if (err) throw err;
            else {
                var recarcasare = new Recarcasare();
                recarcasare.pacient_id = req.body.recarcasare_pacient_id;
                recarcasare.cabinet = req.user.username;
                recarcasare.nume = req.body.nume;
                recarcasare.telefon = req.body.telefon;
                recarcasare.recarcasare_inregistrat_pacient = req.body.recarcasare_inregistrat_pacient;
                recarcasare.denumire_aparat = req.body.denumire_aparat;
                recarcasare.serie_aparat = req.body.serie_aparat;
                recarcasare.defectiune_reclamata = req.body.defectiune_reclamata;
                recarcasare.constatare_cabinet = req.body.constatare_cabinet;
                recarcasare.completare_cabinet = '-';
                recarcasare.u_stanga = req.body.u_stanga;
                recarcasare.u_dreapta = req.body.u_dreapta;
                recarcasare.garantie = req.body.garantie;
                recarcasare.cutie = req.body.cutie;
                recarcasare.baterie = req.body.baterie;
                recarcasare.mulaj = req.body.mulaj;
                recarcasare.observatii_cabinet = req.body.observatii_cabinet;
                recarcasare.observatii_pacient = req.body.observatii_pacient;
                recarcasare.iesit_cabinet = '-';
                recarcasare.intrat_cabinet = '-';
                recarcasare.predat_pacient = '-';
                recarcasare.taxa_urgenta_cabinet = req.body.taxa_urgenta_cabinet;


                recarcasare.log_sosit = '-';
                recarcasare.log_plecat = '-';
                recarcasare.log_preluat = '-';
                recarcasare.log_trimis = '-';

                recarcasare.asamblare_sosit = '-';
                recarcasare.asamblare_plecat = '-';
                recarcasare.finalizat_recarcasare = '-';
                recarcasare.executant_recarcasare = '-';
                recarcasare.executant_reparatie = '-';
                recarcasare.piese_inlocuite = '-';
                recarcasare.cod_componente = '-';
                recarcasare.garantie_asamblare = req.body.garantie_asamblare;
                recarcasare.observatii_asamblare = req.body.observatii_asamblare;
                recarcasare.observatii_recarcasare_intern = '-';
                recarcasare.constatare_asamblare = '-';
                recarcasare.operatiuni_efectuate = '-';
                recarcasare.cost_recarcasare = '-';
                recarcasare.observatii_asamblare = '-';
                recarcasare.garantie_asamblare = '-';

                if (req.body.denumire_aparat == null || req.body.denumire_aparat == '') {
                    res.json({ success: false, message: 'Completeaza Denumire Aparat' });
                }

                else if (req.body.serie_aparat == null || req.body.serie_aparat == '') {
                    res.json({ success: false, message: 'Completeaza Serie Aparat' });
                }

                else if (req.body.defectiune_reclamata == null || req.body.defectiune_reclamata == '') {
                    res.json({ success: false, message: 'Completeaza Defectiune Reclamata' });
                }

                else if (req.body.constatare_cabinet == null || req.body.constatare_cabinet == '') {
                    res.json({ success: false, message: 'Completeaza Constatare Cabinet' });
                }
                else if (req.body.u_stanga == null || req.body.u_stanga == '') {
                    res.json({ success: false, message: 'Alege optiune Urechea Stanga' });
                }

                else if (req.body.u_dreapta == null || req.body.u_dreapta == '') {
                    res.json({ success: false, message: 'Alege optiune Urechea Dreapta' });
                }
                else if (req.body.garantie == null || req.body.garantie == '') {
                    res.json({ success: false, message: 'Alege optiune Garantie' });
                }

                else if (req.body.cutie == null || req.body.cutie == '') {
                    res.json({ success: false, message: 'Alege optiune Cutie' });
                }

                else if (req.body.baterie == null || req.body.baterie == '') {
                    res.json({ success: false, message: 'Alege optiune Baterie' });
                }

                else if (req.body.mulaj == null || req.body.mulaj == '') {
                    res.json({ success: false, message: 'Alege optiune Mulaj' });
                }

                else {

                    recarcasare.save(function (err) {
                        if (err) {
                            res.json({ succes: false, message: err });
                        } else {
                            res.json({ success: true, message: 'Recarcasare adaugata cu succes.', comanda_recarcasare: comanda_recarcasare.nr_comanda_recarcasare });
                        }
                    });

                }
            }

        });
    });



    // Oliva Reg. Route 
    // -------------------------------------------------------------------------------------------------

    router.post('/oliva', function (req, res) {
        Oliva.findOne({}, {}, { sort: { 'nr_comanda_oliva': -1 } }, function (err, comanda_oliva) {
            if (err) throw err;
            else {
                var oliva = new Oliva();
                oliva.cabinet = req.user.username;
                oliva.pacient_id = req.body.oliva_pacient_id;
                oliva.nume = req.body.nume;
                oliva.telefon = req.body.telefon;
                oliva.oliva_inregistrat_pacient = req.body.oliva_inregistrat_pacient;
                oliva.model_aparat = req.body.model_aparat;
                oliva.ureche_protezata = req.body.ureche_protezata;
                oliva.material_oliva = req.body.material_oliva;
                oliva.tip_oliva = req.body.tip_oliva;
                oliva.vent_oliva = req.body.vent_oliva;
                oliva.pret_final = req.body.pret_final;
                oliva.avans = req.body.avans;
                oliva.data_avans = new moment().format('DD/MM/YYYY');
                oliva.rest_plata = req.body.rest_plata;
                oliva.observatii_oliva = req.body.observatii_oliva;
                oliva.oliva_taxa_urgenta = req.body.oliva_taxa_urgenta;
                oliva.predat_pacient = '-';
                oliva.iesit_cabinet = '-';
                oliva.intrat_cabinet = '-';
                oliva.completare_cabinet = '-';

                oliva.log_sosit = '-';
                oliva.log_plecat = '-';
                oliva.log_preluat = '-';
                oliva.log_trimis = '-';


                oliva.plastie_sosit = '-';
                oliva.plastie_plecat = '-';
                oliva.finalizat_oliva = '-';
                oliva.observatii_plastie = '-';
                oliva.executant_oliva = '-';


                if (req.body.ureche_protezata == "Bilateral") {

                    var serie = comanda_oliva.serie_oliva;
                    if (serie.includes("-")) {

                        oliva.serie_oliva = parseInt(comanda_oliva.serie_oliva) + 2 + "-" + (parseInt(comanda_oliva.serie_oliva) + 3)
                    }
                    else {
                        oliva.serie_oliva = parseInt(comanda_oliva.serie_oliva) + 1 + "-" + (parseInt(comanda_oliva.serie_oliva) + 2)
                    }

                } else {

                    var serie = comanda_oliva.serie_oliva;
                    if (serie.includes("-")) {
                        oliva.serie_oliva = parseInt(comanda_oliva.serie_oliva) + 2;
                    } else {
                        oliva.serie_oliva = parseInt(comanda_oliva.serie_oliva) + 1;
                    }

                }

                if (req.body.model_aparat == null || req.body.model_aparat == '') {
                    res.json({ success: false, message: 'Completeaza Model Aparat' });
                }

                else if (req.body.ureche_protezata == null || req.body.ureche_protezata == '') {
                    res.json({ success: false, message: 'Completeaza Ureche Protezata' });
                }

                else if (req.body.material_oliva == null || req.body.material_oliva == '') {
                    res.json({ success: false, message: 'Completeaza Material Oliva' });
                }

                else if (req.body.tip_oliva == null || req.body.tip_oliva == '') {
                    res.json({ success: false, message: 'Completeaza Tip Oliva' });
                }

                else if (req.body.vent_oliva == null || req.body.vent_oliva == '') {
                    res.json({ success: false, message: 'Completeaza Vent' });
                }

                else if (req.body.pret_final == null || req.body.pret_final == '') {
                    res.json({ success: false, message: 'Completeaza Pret Final' });
                }


                else {

                    oliva.save(function (err) {
                        if (err) {
                            res.json({ succes: false, message: err });
                        } else {
                            res.json({ success: true, message: 'Comanda Oliva adaugata cu succes.', comanda_oliva: comanda_oliva });
                        }
                    });

                }
            }

        });

    });

    // ITE Reg. Route 
    // -------------------------------------------------------------------------------------------------

    router.post('/ite', function (req, res) {
        Ite.findOne({}, {}, { sort: { 'nr_comanda_ite': -1 } }, function (err, comanda_ite) {
            if (err) throw err;
            else {
                var ite = new Ite();
                ite.cabinet = req.user.username;
                ite.pacient_id = req.body.ite_pacient_id;
                ite.nume = req.body.nume;
                ite.telefon = req.body.telefon;
                ite.ite_inregistrat_pacient = req.body.ite_inregistrat_pacient;
                ite.model_aparat = req.body.model_aparat;
                ite.ureche_protezata = req.body.ureche_protezata;
                ite.carcasa_ite = req.body.carcasa_ite;
                ite.culoare_carcasa = req.body.culoare_carcasa;
                ite.buton_programe = req.body.buton_programe;
                ite.potentiometru_volum = req.body.potentiometru_volum;
                ite.vent_ite = req.body.vent_ite;
                ite.pret_lista = req.body.pret_lista;
                ite.pret_final = req.body.pret_final;
                ite.avans = req.body.avans;
                ite.data_avans = new moment().format('DD/MM/YYYY');
                ite.rest_plata = req.body.rest_plata;
                ite.observatii_ite = req.body.observatii_ite;
                ite.ite_taxa_urgenta = req.body.ite_taxa_urgenta;
                ite.predat_pacient = '-';
                ite.iesit_cabinet = '-';
                ite.intrat_cabinet = '-';
                ite.completare_cabinet = '-';


                ite.log_sosit = '-';
                ite.log_plecat = '-';
                ite.log_preluat = '-';
                ite.log_trimis = '-';
                ite.observatii_ite_logistic = '-';

                ite.asamblare_sosit = '-';
                ite.asamblare_plecat = '-';
                ite.finalizat_ite = '-';
                ite.observatii_plastie = '-';
                ite.executant_ite = '-';



                if (req.body.ureche_protezata == "Bilateral") {

                    var serie = comanda_ite.serie_ite;
                    if (serie.includes("-")) {

                        ite.serie_ite = parseInt(comanda_ite.serie_ite) + 2 + "-" + (parseInt(comanda_ite.serie_ite) + 3)
                    }
                    else {
                        ite.serie_ite = parseInt(comanda_ite.serie_ite) + 1 + "-" + (parseInt(comanda_ite.serie_ite) + 2)
                    }

                } else {

                    var serie = comanda_ite.serie_ite;
                    if (serie.includes("-")) {
                        ite.serie_ite = parseInt(comanda_ite.serie_ite) + 2;
                    } else {
                        ite.serie_ite = parseInt(comanda_ite.serie_ite) + 1;
                    }

                }
                if (req.body.model_aparat == null || req.body.model_aparat == '') {
                    res.json({ success: false, message: 'Completeaza Model Aparat' });
                }

                else if (req.body.ureche_protezata == null || req.body.ureche_protezata == '') {
                    res.json({ success: false, message: 'Alege Ureche Protezata' });
                }

                else if (req.body.carcasa_ite == null || req.body.carcasa_ite == '') {
                    res.json({ success: false, message: 'Alege Carcasa ITE' });
                }

                else if (req.body.buton_programe == null || req.body.buton_programe == '') {
                    res.json({ success: false, message: 'Alege Optiune Buton Programe' });
                }

                else if (req.body.potentiometru_volum == null || req.body.potentiometru_volum == '') {
                    res.json({ success: false, message: 'Alege Optiune Potentiometru Volum' });
                }

                else if (req.body.vent_ite == null || req.body.vent_ite == '') {
                    res.json({ success: false, message: 'Completeaza Vent' });
                }


                else {

                    ite.save(function (err) {
                        if (err) {
                            res.json({ succes: false, message: err });
                        } else {
                            res.json({ success: true, message: 'Comanda ITE adaugata cu succes.', comanda_ite: comanda_ite });
                        }
                    });

                }
            }

        });
    });


    router.put('/api/management/:user', function (req, res, next) {
        var token = req.headers['x-access-token'] || req.session.token;

        User.findById(req.params._id, function (err, user) {
            if (err) {
                res.send(err);
            } else if (user.token != token) {
                res.json({ sucess: false, message: 'User not same as authenticated user.' });
            } else {

                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;

                user.save(function (err) {
                    if (err) res.send(err);

                    res.json({ message: 'User updated.' });
                });
            }
        });
    });

    //Renew Token ----------------------------------------------
    router.get('/renewToken/:username', function (req, res) {
        User.findOne({ username: req.params.username }).select().exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                var newToken = jwt.sign({ username: user.username, name: user.name }, secret);
                res.json({ success: true, token: newToken });
            }
        });
    });


    function getUsers() {
        return new Promise((resolve) => {
            User.find({ permission: 'user' }).select('username').exec(function (err, user) {
                return resolve(user)
            })
        });
    }
    function getTehnicUsers() {
        return new Promise((resolve) => {
            User.find({}).select('username permission').exec(function (err, user) {
                return resolve(user)
            })
        });
    }

    function getServices() {
        return new Promise((resolve) => {
            Service.find({}).select('data_inregistrare cabinet finalizat_reparatie executant_reparatie u_stanga u_dreapta').exec(function (err, service) {
                return resolve(service)

            })
        });
    }
    function getRecarcasari() {
        return new Promise((resolve) => {
            Recarcasare.find({}).select('data_inregistrare cabinet finalizat_recarcasare executant_recarcasare u_stanga u_dreapta').exec(function (err, recarcasare) {
                return resolve(recarcasare)

            })
        });
    }
    function getOlive() {
        return new Promise((resolve) => {
            Oliva.find({}).select('data_inregistrare cabinet material_oliva finalizat_oliva executant_oliva ureche_protezata').exec(function (err, oliva) {
                return resolve(oliva)

            })
        });
    }
    function getIte() {
        return new Promise((resolve) => {
            Ite.find({}).select('data_inregistrare cabinet finalizat_ite executant_ite ureche_protezata').exec(function (err, ite) {
                return resolve(ite)

            })
        });
    }

    router.get('/raportareTehnic', function (req, res) {
        const data_luna = req.query.dataFiltru;

        getTehnicUsers().then(users => {
            getIte().then(ite => {
                getRecarcasari().then(recarcasari => {
                    getOlive().then(olive => {
                        getServices().then(services => {
                            let comenzi = []
                            users.map(user => {

                                var serv = services.filter(services => {
                                    return user.username === services.executant_reparatie
                                })
                                var oliv = olive.filter(olive => {
                                    return user.username === olive.executant_oliva
                                })
                                var rec = recarcasari.filter(recarcasari => {
                                    return user.username === recarcasari.executant_recarcasare
                                })
                                var it = ite.filter(ite => {
                                    return user.username === ite.executant_ite
                                })


                                comenzi.push({ serv, oliv, rec, it })
                            })

                            let raport = []
                            let raportRec = []
                            let raportITE = []

                            comenzi.map(item => {
                                newService = item.serv
                                newOliva = item.oliv
                                newRecarcasare = item.rec
                                newIte = item.it

                                if (newService.length > 0) {
                                    const executant = newService[0].executant_reparatie

                                    let data_Comanda = []
                                    newService.map(i => {
                                        var input = i.data_inregistrare;
                                        var stanga = i.u_stanga;
                                        var dreapta = i.u_dreapta;

                                        var fields = input.split('/');

                                        var luna = fields[1];
                                        if (luna === data_luna) {
                                            data_Comanda.push({ luna, stanga, dreapta })
                                        }

                                    })
                                    let counter_service = 0;
                                    for (var i = 0; i < data_Comanda.length; ++i) {
                                        if (data_Comanda[i].stanga == "da" && data_Comanda[i].dreapta == "da")
                                            counter_service += 2;
                                        else {
                                            counter_service++;
                                        }
                                    }
                                    raport.push({ executant, counter_service })
                                }
                                if (newOliva.length > 0) {
                                    const executant = newOliva[0].executant_oliva
                                    let data_Comanda = []
                                    newOliva.map(i => {
                                        var input = i.data_inregistrare;
                                        var protezat = i.ureche_protezata
                                        var fields = input.split('/');

                                        var luna = fields[1];
                                        if (luna === data_luna) {
                                            data_Comanda.push({ luna, protezat })
                                        }

                                    })
                                    let counter_oliva = 0;
                                    for (var i = 0; i < data_Comanda.length; ++i) {
                                        if (data_Comanda[i].protezat == "Bilateral")
                                            counter_oliva += 2;
                                        else {
                                            counter_oliva++;
                                        }
                                    } raport.push({ executant, counter_oliva })
                                }
                                if (newRecarcasare.length > 0) {
                                    const executant = newRecarcasare[0].executant_recarcasare

                                    let data_Comanda = []
                                    newRecarcasare.map(i => {
                                        var input = i.data_inregistrare;
                                        var stanga = i.u_stanga;
                                        var dreapta = i.u_dreapta;

                                        var fields = input.split('/');

                                        var luna = fields[1];
                                        if (luna === data_luna) {
                                            data_Comanda.push({ luna, stanga, dreapta })
                                        }

                                    })
                                    let counter_recarcasare = 0;
                                    for (var i = 0; i < data_Comanda.length; ++i) {
                                        if (data_Comanda[i].stanga == "da" && data_Comanda[i].dreapta == "da")
                                            counter_recarcasare += 2;
                                        else {
                                            counter_recarcasare++;
                                        }
                                    }
                                    raportRec.push({ executant, counter_recarcasare })
                                }
                                if (newIte.length > 0) {
                                    const executant = newIte[0].executant_ite

                                    let data_Comanda = []
                                    newIte.map(i => {
                                        var input = i.data_inregistrare;
                                        var protezat = i.ureche_protezata

                                        var fields = input.split('/');

                                        var luna = fields[1];
                                        if (luna === data_luna) {
                                            data_Comanda.push({ luna, protezat })
                                        }

                                    })
                                    let counter_ite = 0;
                                    for (var i = 0; i < data_Comanda.length; ++i) {
                                        if (data_Comanda[i].protezat == "Bilateral")
                                            counter_ite += 2;
                                        else {
                                            counter_ite++;
                                        }
                                    }
                                    raportITE.push({ executant, counter_ite })
                                }

                            })

                            let raportAsamblare = _.map(raportITE, function (obj) {
                                return _.assign(obj, _.find(raportRec, { executant: obj.executant }));
                            });


                            var raportFinal = raportAsamblare.concat(raport);

                            res.json(raportFinal)
                        })
                    })
                })
            })
        })
    });

    router.get('/raportareCabinete', function (req, res) {
        const data_luna = req.query.dataFiltru;

        getOlive().then(olive => {
            getIte().then(ite => {
                getRecarcasari().then(recarcasari => {
                    getServices().then(services => {
                        getUsers()
                            .then(users => {
                                let comenzi = []

                                users.map(user => {

                                    var serv = services.filter(services => {
                                        return user.username === services.cabinet
                                    })
                                    var rec = recarcasari.filter(recarcasari => {
                                        return user.username === recarcasari.cabinet
                                    })
                                    var oliv = olive.filter(olive => {
                                        return user.username === olive.cabinet
                                    })
                                    var it = ite.filter(ite => {
                                        return user.username === ite.cabinet
                                    })


                                    comenzi.push({ serv, rec, oliv, it })
                                })

                                let raportSer = []
                                let raportRec = []
                                let raportOliv = []
                                let raportIte = []

                                comenzi.map(item => {
                                    newService = item.serv
                                    newRecarcasare = item.rec
                                    newOliva = item.oliv
                                    newIte = item.it
                                    if (newService.length > 0) {
                                        const cabinet = newService[0].cabinet

                                        let data_Comanda = []
                                        newService.map(i => {
                                            var input = i.data_inregistrare;
                                            var stanga = i.u_stanga;
                                            var dreapta = i.u_dreapta;

                                            var fields = input.split('/');

                                            var luna = fields[1];
                                            if (luna === data_luna) {
                                                data_Comanda.push({ luna, stanga, dreapta })
                                            }

                                        })

                                        let counterServ = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].stanga == "da" && data_Comanda[i].dreapta == "da")
                                                counterServ += 2;
                                            else {
                                                counterServ++;
                                            }
                                        }


                                        let counterServBilateral = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].stanga == "da" && data_Comanda[i].dreapta == "da")
                                                counterServBilateral++
                                        }

                                        raportSer.push({ cabinet, counterServ, counterServBilateral })
                                    }
                                    if (newRecarcasare.length > 0) {
                                        const cabinet = newRecarcasare[0].cabinet
                                        let data_Comanda = []
                                        newRecarcasare.map(i => {
                                            var input = i.data_inregistrare;
                                            var stanga = i.u_stanga;
                                            var dreapta = i.u_dreapta;

                                            var fields = input.split('/');

                                            var luna = fields[1];
                                            if (luna === data_luna) {
                                                data_Comanda.push({ luna, stanga, dreapta })
                                            }

                                        })
                                        let counterRec = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].stanga == "da" && data_Comanda[i].dreapta == "da")
                                                counterRec += 2;
                                            else {
                                                counterRec++;
                                            }
                                        }
                                        let counterRecBilateral = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].stanga == "da" && data_Comanda[i].dreapta == "da")
                                                counterRecBilateral++
                                        }
                                        raportRec.push({ cabinet, counterRec, counterRecBilateral })
                                    }
                                    if (newOliva.length > 0) {
                                        const cabinet = newOliva[0].cabinet

                                        let data_Comanda = []
                                        newOliva.map(i => {
                                            var input = i.data_inregistrare;
                                            var mat_oliva = i.material_oliva
                                            var protezat = i.ureche_protezata

                                            var fields = input.split('/');

                                            var luna = fields[1];
                                            if (luna === data_luna) {
                                                data_Comanda.push({ luna, mat_oliva, protezat })
                                            }

                                        })
                                        let counterDura = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].mat_oliva == "Dura" && data_Comanda[i].protezat == "Bilateral")
                                                counterDura += 2;
                                            else if (data_Comanda[i].mat_oliva == "Dura") {
                                                counterDura++;
                                            }
                                        }
                                        let counterElastica = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].mat_oliva == "Elastica" && data_Comanda[i].protezat == "Bilateral")
                                                counterElastica += 2;
                                            else if (data_Comanda[i].mat_oliva == "Elastica") {
                                                counterElastica++;
                                            }
                                        }
                                        let counterOliv = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].protezat == "Bilateral")
                                                counterOliv += 2;
                                            else {
                                                counterOliv++;
                                            }
                                        }
                                        let counterOlivaBilateral = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].protezat == "Bilateral")
                                                counterOlivaBilateral++;
                                        }
                                        raportOliv.push({ cabinet, counterOliv, counterOlivaBilateral, counterElastica, counterDura })
                                    }
                                    if (newIte.length > 0) {
                                        const cabinet = newIte[0].cabinet
                                        let data_Comanda = []
                                        newIte.map(i => {
                                            var input = i.data_inregistrare;
                                            var protezat = i.ureche_protezata;
                                            var fields = input.split('/');

                                            var luna = fields[1];
                                            if (luna === data_luna) {
                                                data_Comanda.push({ luna, protezat })
                                            }

                                        })
                                        let counterIte = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].protezat == "Bilateral")
                                                counterIte += 2;
                                            else {
                                                counterIte++;
                                            }
                                        }
                                        let counterIteBilateral = 0;
                                        for (var i = 0; i < data_Comanda.length; ++i) {
                                            if (data_Comanda[i].protezat == "Bilateral")
                                                counterIteBilateral++;
                                        }


                                        raportIte.push({ cabinet, counterIte, counterIteBilateral })
                                    }
                                })
                                let raport1 = _.map(raportSer, function (obj) {
                                    return _.assign(obj, _.find(raportRec, { cabinet: obj.cabinet }));
                                });
                                let raport2 = _.map(raport1, function (obj) {
                                    return _.assign(obj, _.find(raportOliv, { cabinet: obj.cabinet }));
                                });
                                let raportFinal = _.map(raport2, function (obj) {
                                    return _.assign(obj, _.find(raportIte, { cabinet: obj.cabinet }));
                                });
                                res.json(raportFinal)
                            })
                    })
                })
            })
        })

    });


    //Users ----------------------------------------------
    router.get('/management', function (req, res) {
        User.find({}, function (err, users) {
            if (err) throw err;
            User.findOne({ username: req.user.username }, function (err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: 'Nu s-a gasit Utilizator' });
                } else {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator' || mainUser.permission === 'user') {
                        if (!users) {
                            res.json({ success: false, message: 'Users not found' });
                        } else {
                            res.json({ success: true, users: users, permission: mainUser.permission, currentUser: mainUser });
                        }
                    } else {
                        res.json({ success: false, message: 'Permisiuni Insuficiente' });
                    }
                }
            });
        });
    });

    router.get('/profilCabinet/:username', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {
                Pacient.find({ "cabinet": mainUser.username }).select('data_inregistrare nume denumire_aparat defectiune_reclamata iesit_cabinet finalizat_reparatie intrat_cabinet predat_pacient').exec(function (err, pacienti) {
                    if (err) throw err;
                    if (!pacienti) {
                        res.json({ success: false, message: 'Nu s-au gasit pacienti' });
                    } else {
                        res.json({ success: true, pacienti: pacienti });

                    }

                });
            }
        });
    });

    router.get('/registruServiceCabinet/:username', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {
                Service.find({ "cabinet": mainUser.username }).select('nr_comanda_service data_inregistrare service_inregistrat_pacient denumire_aparat defectiune_reclamata iesit_cabinet serv_sosit serv_plecat predat_pacient').exec(function (err, service) {
                    if (err) throw err;
                    if (!service) {
                        res.json({ success: false, message: 'Nu s-au gasit service-uri' });
                    } else {
                        res.json({ success: true, service: service });

                    }

                });
            }
        });
    });

    router.get('/registruRecarcasariCabinet/:username', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {
                Recarcasare.find({ "cabinet": mainUser.username }).select('nr_comanda_recarcasare data_inregistrare recarcasare_inregistrat_pacient denumire_aparat defectiune_reclamata iesit_cabinet asamblare_sosit asamblare_plecat predat_pacient').exec(function (err, recarcasare) {
                    if (err) throw err;
                    if (!recarcasare) {
                        res.json({ success: false, message: 'Nu s-au gasit recarcasari' });
                    } else {
                        res.json({ success: true, recarcasare: recarcasare });
                    }

                });
            }
        });
    });

    router.get('/registruOliveCabinet/:username', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {
                Oliva.find({ "cabinet": mainUser.username }).select('nr_comanda_oliva serie_oliva data_inregistrare oliva_inregistrat_pacient material_oliva tip_oliva iesit_cabinet plastie_sosit plastie_plecat predat_pacient').exec(function (err, olive) {
                    if (err) throw err;
                    if (!olive) {
                        res.json({ success: false, message: 'Nu s-au gasit olive' });
                    } else {
                        res.json({ success: true, olive: olive });
                    }

                });
            }
        });
    });

    router.get('/registruIteCabinet/:username', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {
                Ite.find({ "cabinet": mainUser.username }).select('nr_comanda_ite serie_ite data_inregistrare ite_inregistrat_pacient model_aparat carcasa_ite iesit_cabinet asamblare_sosit asamblare_plecat predat_pacient').exec(function (err, ite) {
                    if (err) throw err;
                    if (!ite) {
                        res.json({ success: false, message: 'Nu s-au gasit comenzi ITE' });
                    } else {
                        res.json({ success: true, ite: ite });
                    }

                });
            }
        });
    });


    router.get('/registruPiese', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'service') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Service.find({ "piese_inlocuite": { "$regex": '[a-zA-Z\\s\'\"/^\d+$/]+', "$options": "i" }, "finalizat_reparatie": { "$regex": '[a-zA-Z\\s\'\"/^\d+$/]+', "$options": "i", } }).select('finalizat_reparatie cabinet piese_inlocuite cod_componente nr_comanda_service').exec(function (err, service) {
                    if (err) throw err;
                    if (!service) {
                        res.json({ success: false, message: 'Nu s-au gasit service-uri' });
                    } else {
                        res.json({ success: true, service: service });
                    }

                });
            }
        });
    });

    router.get('/registruLogistic_service', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'colete') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Service.find({}).select('nr_comanda_service cabinet data_inregistrare log_sosit log_plecat log_preluat log_trimis service_inregistrat_pacient denumire_aparat').exec(function (err, service) {
                    if (err) throw err;
                    if (!service) {
                        res.json({ success: false, message: 'Nu s-au gasit service-uri' });
                    } else {
                        res.json({ success: true, service: service });
                    }

                });
            }
        });

    });

    router.get('/registruLogistic_recarcasari', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'colete') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {
                Recarcasare.find({}).select('nr_comanda_recarcasare cabinet data_inregistrare log_sosit log_plecat log_preluat log_trimis recarcasare_inregistrat_pacient denumire_aparat').exec(function (err, recarcasare) {
                    if (err) throw err;
                    if (!recarcasare) {
                        res.json({ success: false, message: 'Nu s-au gasit recarcasari' });
                    } else {
                        res.json({ success: true, recarcasare: recarcasare });
                    }

                });
            }
        });
    });

    router.get('/registruLogistic_olive', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'colete') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Oliva.find({}).select('nr_comanda_oliva serie_oliva cabinet data_inregistrare oliva_inregistrat_pacient log_sosit log_plecat log_preluat log_trimis material_oliva').exec(function (err, oliva) {
                    if (err) throw err;
                    if (!oliva) {
                        res.json({ success: false, message: 'Nu s-au gasit comenzi olive' });
                    } else {
                        res.json({ success: true, oliva: oliva });
                    }

                });
            }
        });
    });

    router.get('/registruLogistic_ite', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'colete') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Ite.find({}).select('nr_comanda_ite serie_ite cabinet data_inregistrare log_sosit log_plecat log_preluat log_trimis ite_inregistrat_pacient model_aparat').exec(function (err, ite) {
                    if (err) throw err;
                    if (!ite) {
                        res.json({ success: false, message: 'Nu s-au gasit comenzi ITE' });
                    } else {
                        res.json({ success: true, ite: ite });
                    }

                });
            }
        });
    });

    router.get('/profilPacient/:id', function (req, res) {
        var pacID = req.params.id;
        var username = req.user.username;

        Pacient.findByIdAndUpdate({ _id: pacID }).select('_id nume data_nastere').exec(function (err, pacient) {
            if (err) throw err;
            function getAge(dateString) {
                var today = new Date();
                var birthDate = new Date(dateString);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            }
            pacient.varsta = getAge(pacient.data_nastere);
            pacient.save(function () {
                if (err) {
                    console.log('error calcul varsta pacient')
                }
            });
            Oliva.find({ "pacient_id": pacient._id, "cabinet": username }, function (err, oliva) {
                if (err) throw err;
                Ite.find({ "pacient_id": pacient._id, "cabinet": username }, function (err, ite) {
                    if (err) throw err;
                    Recarcasare.find({ "pacient_id": pacient._id, "cabinet": username }, function (err, recarcasare) {
                        if (err) throw err;
                        Service.find({ "pacient_id": pacient._id, "cabinet": username }).select('nr_comanda_service data_inregistrare denumire_aparat defectiune_reclamata serv_sosit finalizat_reparatie serv_plecat predat_pacient').exec(function (err, service) {
                            if (err) throw err;
                            if (!service || !oliva) {
                                res.json({ success: false, message: 'Nu s-au gasit service-uri sau olive' });
                            }
                            else {
                                res.json({ success: true, service: service, oliva: oliva, ite: ite, recarcasare: recarcasare });
                            }
                        });

                    });
                });
            });
        });
    });

    router.get('/raportareTehnic', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission !== 'admin') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Service.find({}).select('nr_comanda_service cabinet data_inregistrare service_inregistrat_pacient denumire_aparat defectiune_reclamata serv_sosit finalizat_reparatie serv_plecat garantie_serv').exec(function (err, service) {
                    if (err) throw err;
                    if (!service) {
                        res.json({ success: false, message: 'Nu s-au gasit service-uri' });
                    } else {
                        res.json({ success: true, service: service });
                    }
                });
            }
        });
    });

    router.get('/registruService', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission === 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Service.find({}).select('nr_comanda_service cabinet data_inregistrare service_inregistrat_pacient denumire_aparat defectiune_reclamata serv_sosit finalizat_reparatie serv_plecat garantie_serv').exec(function (err, service) {
                    if (err) throw err;
                    if (!service) {
                        res.json({ success: false, message: 'Nu s-au gasit service-uri' });
                    } else {
                        res.json({ success: true, service: service });
                    }
                });
            }
        });
    });



    router.get('/registruRecarcasari', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission === 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Recarcasare.find({}).select('nr_comanda_recarcasare cabinet data_inregistrare recarcasare_inregistrat_pacient denumire_aparat defectiune_reclamata asamblare_sosit finalizat_recarcasare asamblare_plecat').exec(function (err, recarcasare) {
                    if (err) throw err;
                    if (!recarcasare) {
                        res.json({ success: false, message: 'Nu s-au gasit recarcasari' });
                    } else {
                        res.json({ success: true, recarcasare: recarcasare });
                    }
                });
            }
        });
    });


    router.get('/registruOlive', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission === 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Oliva.find({}).select('nr_comanda_oliva serie_oliva cabinet data_inregistrare oliva_inregistrat_pacient material_oliva tip_oliva plastie_sosit finalizat_oliva plastie_plecat').exec(function (err, oliva) {
                    if (err) throw err;
                    if (!oliva) {
                        res.json({ success: false, message: 'Nu s-au gasit comenzi olive' });
                    } else {
                        res.json({ success: true, oliva: oliva });
                    }
                });
            }
        });
    });

    router.get('/registruIte', function (req, res) {
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser || mainUser.permission === 'user') {
                res.json({ success: false, message: 'Utilizator nu exista sau nu are permisiunile necesare' });
            } else {

                Ite.find({}).select('nr_comanda_ite serie_ite cabinet data_inregistrare ite_inregistrat_pacient model_aparat carcasa_ite asamblare_sosit finalizat_ite asamblare_plecat').exec(function (err, ite) {
                    if (err) throw err;
                    if (!ite) {
                        res.json({ success: false, message: 'Nu s-au gasit comenzi ITE' });
                    } else {
                        res.json({ success: true, ite: ite });
                    }
                });
            }
        });
    });


    router.get('/editPacient/:id', function (req, res) {
        var editPacient = req.params.id;
        Pacient.findOne({ _id: editPacient }).select('data_inregistrare cabinet nume telefon adresa cnp sex varsta').exec(function (err, pacient) {
            if (err) throw err;
            if (!pacient) {
                res.json({ success: false, message: 'No pacient found' });

            } else {
                res.json({ success: true, pacient: pacient });
            }
        });
    });

    router.get('/service/:id', function (req, res) {
        var idService = req.params.id;
        Service.findOne({ _id: idService }, function (err, service) {
            if (err) throw err;
            if (!service) {
                res.json({ success: false, message: 'No service found' });

            } else {
                res.json({ success: true, service: service });

            }
        });
    });

    router.delete('/service/:id', function (req, res) {
        var deletedService = req.params.id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Nu ai permisiunile necesare' });
                } else {
                    Service.findByIdAndRemove({ _id: deletedService }, function (err) {
                        if (err) throw err;
                        res.json({ success: true, message: 'Comanda Service stearsa cu succes' });
                    });
                }
            }
        });
    });

    router.get('/recarcasare/:id', function (req, res) {
        var idRecarcasare = req.params.id;
        Recarcasare.findOne({ _id: idRecarcasare }, function (err, recarcasare) {
            if (err) throw err;
            if (!recarcasare) {
                res.json({ success: false, message: 'No recarcasare found' });

            } else {
                res.json({ success: true, recarcasare: recarcasare });

            }
        });
    });

    router.delete('/recarcasare/:id', function (req, res) {
        var deletedRecarcasare = req.params.id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Nu ai permisiunile necesare' });
                } else {
                    Recarcasare.findByIdAndRemove({ _id: deletedRecarcasare }, function (err) {
                        if (err) throw err;
                        res.json({ success: true, message: 'Comanda Recarcasare stearsa cu succes' });
                    });
                }
            }
        });
    });


    router.get('/oliva/:id', function (req, res) {
        var idOliva = req.params.id;
        Oliva.findOne({ _id: idOliva }, function (err, oliva) {
            if (err) throw err;
            if (!oliva) {
                res.json({ success: false, message: 'No oliva found' });

            } else {
                res.json({ success: true, oliva: oliva });

            }
        });
    });

    router.delete('/oliva/:id', function (req, res) {
        var deletedOliva = req.params.id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Nu ai permisiunile necesare' });
                } else {
                    Oliva.findByIdAndRemove({ _id: deletedOliva }, function (err) {
                        if (err) throw err;
                        res.json({ success: true, message: 'Comanda Oliva stearsa cu succes' });
                    });
                }
            }
        });
    });


    router.get('/ite/:id', function (req, res) {
        var idIte = req.params.id;
        Ite.findOne({ _id: idIte }, function (err, ite) {
            if (err) throw err;
            if (!ite) {
                res.json({ success: false, message: 'No ite found' });

            } else {
                res.json({ success: true, ite: ite });

            }
        });
    });

    router.delete('/ite/:id', function (req, res) {
        var deletedIte = req.params.id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Nu ai permisiunile necesare' });
                } else {
                    Ite.findByIdAndRemove({ _id: deletedIte }, function (err) {
                        if (err) throw err;
                        res.json({ success: true, message: 'Comanda ITE stearsa cu succes' });
                    });
                }
            }
        });
    });


    // Update Pacient 
    //--------------------------------------------------------------------------------
    router.put('/editPacient', function (req, res) {
        var editPacient = req.body._id;

        if (req.body.telefon) var Pacient_Telefon = req.body.telefon;
        if (req.body.adresa) var Pacient_Adresa = req.body.adresa;

        User.findOne({ username: req.user.username }, function (err, mainUser) {

            if (err) throw err;
            if (Pacient_Adresa) {
                Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                    if (err) throw err;
                    if (pacient.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    } else {
                        pacient.adresa = Pacient_Adresa;
                        pacient.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Adresa modificata cu succes.' });
                            }
                        });
                    }
                });
            }

            if (Pacient_Telefon) {
                Pacient.findOne({ _id: editPacient }, function (err, pacient) {
                    if (err) throw err;
                    if (pacient.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    } else {
                        pacient.telefon = Pacient_Telefon;
                        pacient.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Telefon modificat cu succes.' });
                            }
                        });
                    }
                });
            }

        });

    });


    // Update Service 
    //--------------------------------------------------------------------------------

    router.put('/editService', function (req, res) {
        var editService = req.body._id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;

            //      Cabinet 
            //-----------------------------------------------------------------------------------
            if (req.body.completare_cabinet) var newCompletare_Cabinet = req.body.completare_cabinet;
            if (req.body.nr_comanda_service) var newNr_Comanda_Service = req.body.nr_comanda_service;
            if (req.body.iesit_cabinet) var newIesit_Cabinet = new moment().format('DD/MM/YYYY');
            if (req.body.intrat_cabinet) var newIntrat_Cabinet = new moment().format('DD/MM/YYYY');
            if (req.body.predat_pacient) var newPredat_Pacient = new moment().format('DD/MM/YYYY');

            //      Logistic 
            //-----------------------------------------------------------------------------------

            if (req.body.log_sosit) var newLog_Sosit = new moment().format('DD/MM/YYYY');
            if (req.body.log_plecat) var newLog_Plecat = new moment().format('DD/MM/YYYY');
            if (req.body.log_preluat) var newLog_Preluat = new moment().format('DD/MM/YYYY');
            if (req.body.log_trimis) var newLog_Trimis = new moment().format('DD/MM/YYYY');

            //      Service
            //-----------------------------------------------------------------------------------

            if (req.body.serv_sosit) var newServ_Sosit = new moment().format('DD/MM/YYYY');
            if (req.body.serv_plecat) var newServ_Plecat = new moment().format('DD/MM/YYYY');
            if (req.body.observatii_service) var newObservatii_Service = req.body.observatii_service;
            if (req.body.observatii_service_intern) var Observatii_service_Intern = req.body.observatii_service_intern;
            if (req.body.constatare_service) var newConstatare_Service = req.body.constatare_service;
            if (req.body.operatiuni_efectuate) var newOperatiuni_Efectuate = req.body.operatiuni_efectuate;
            if (req.body.piese_inlocuite) var newPiese_Inlocuite = req.body.piese_inlocuite;
            if (req.body.cod_componente) var newCod_Componente = req.body.cod_componente;
            if (req.body.cost_reparatie) var newCost_Reparatie = req.body.cost_reparatie;
            if (req.body.executant_reparatie) var newExecutant_Reparatie = req.body.executant_reparatie;
            if (req.body.taxa_constatare) var newTaxa_Constatare = req.body.taxa_constatare;
            if (req.body.taxa_urgenta) var newTaxa_Urgenta = req.body.taxa_urgenta;
            if (req.body.garantie_serv) var newGarantie_Serv = req.body.garantie_serv;
            if (req.body.finalizat_reparatie) var newFinalizat_Reparatie = new moment().format('DD/MM/YYYY');


            //      1.Cabinet ----------------------------------------------
            if (newIesit_Cabinet) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (service.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    } else {

                        if (!service || service.iesit_cabinet !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.iesit_cabinet = newIesit_Cabinet;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newIntrat_Cabinet) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (service.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    } else {

                        if (!service || service.intrat_cabinet !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.intrat_cabinet = newIntrat_Cabinet;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newPredat_Pacient) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (service.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    } else {

                        if (!service || service.predat_pacient !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.predat_pacient = newPredat_Pacient;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }


            if (newCompletare_Cabinet) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (service.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    }
                    else {
                        service.completare_cabinet = newCompletare_Cabinet;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }



            // //      2.Logistic ----------------------------------------------

            if (newLog_Sosit) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!service || service.log_sosit !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.log_sosit = newLog_Sosit;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Plecat) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!service || service.log_plecat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.log_plecat = newLog_Plecat;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Preluat) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!service || service.log_preluat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.log_preluat = newLog_Preluat;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Trimis) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!service || service.log_trimis !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.log_trimis = newLog_Trimis;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }


            // //      3.Service ----------------------------------------------

            if (newFinalizat_Reparatie) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    } else {

                        if (!service || service.finalizat_reparatie !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.finalizat_reparatie = newFinalizat_Reparatie;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newServ_Plecat) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    } else {

                        if (!service || service.serv_plecat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.serv_plecat = newServ_Plecat;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newServ_Sosit) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    } else {

                        if (!service || service.serv_sosit !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            service.serv_sosit = newServ_Sosit;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newConstatare_Service) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.constatare_service = newConstatare_Service;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newOperatiuni_Efectuate) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.operatiuni_efectuate = newOperatiuni_Efectuate;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newPiese_Inlocuite) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.piese_inlocuite = newPiese_Inlocuite;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newCod_Componente) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.cod_componente = newCod_Componente;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newCost_Reparatie) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.cost_reparatie = newCost_Reparatie;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newExecutant_Reparatie) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    } else {
                        if (!service || service.executant_reparatie !== '-') {
                            res.json({ success: false, message: 'Executant Reparatie a fost deja adaugat, modificarile nu sunt salvate' });
                        }
                        else {
                            service.executant_reparatie = newExecutant_Reparatie;
                            service.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true });
                                }
                            });
                        }
                    }
                });
            }

            if (newObservatii_Service) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.observatii_service = newObservatii_Service;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (Observatii_service_Intern) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.observatii_service_intern = Observatii_service_Intern;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }


            if (newTaxa_Constatare) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.taxa_constatare = newTaxa_Constatare;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newGarantie_Serv) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.garantie_serv = newGarantie_Serv;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newTaxa_Urgenta) {
                Service.findOne({ _id: editService }, function (err, service) {
                    if (err) throw err;
                    if (mainUser.permission !== 'service') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Service.' });
                    }
                    else {
                        service.taxa_urgenta = newTaxa_Urgenta;
                        service.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

        });

    });

    // Update Recarcasare 
    //--------------------------------------------------------------------------------

    router.put('/editRecarcasare', function (req, res) {
        var editRecarcasare = req.body._id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;

            //      Cabinet 
            //-----------------------------------------------------------------------------------
            if (req.body.completare_cabinet) var newCompletare_Cabinet = req.body.completare_cabinet;
            if (req.body.iesit_cabinet) var newIesit_Cabinet = new moment().format('DD/MM/YYYY');
            if (req.body.intrat_cabinet) var newIntrat_Cabinet = new moment().format('DD/MM/YYYY');
            if (req.body.predat_pacient) var newPredat_Pacient = new moment().format('DD/MM/YYYY');

            //      Logistic 
            //-----------------------------------------------------------------------------------

            if (req.body.log_sosit) var newLog_Sosit = new moment().format('DD/MM/YYYY');
            if (req.body.log_plecat) var newLog_Plecat = new moment().format('DD/MM/YYYY');
            if (req.body.log_preluat) var newLog_Preluat = new moment().format('DD/MM/YYYY');
            if (req.body.log_trimis) var newLog_Trimis = new moment().format('DD/MM/YYYY');

            //      Asamblare
            //-----------------------------------------------------------------------------------

            if (req.body.asamblare_sosit) var newAsamblare_Sosit = new moment().format('DD/MM/YYYY');
            if (req.body.asamblare_plecat) var newAsamblare_Plecat = new moment().format('DD/MM/YYYY');
            if (req.body.observatii_asamblare) var newObservatii_Asamblare = req.body.observatii_asamblare;
            if (req.body.observatii_recarcasare_intern) var Observatii_recarcasare_Intern = req.body.observatii_recarcasare_intern;
            if (req.body.constatare_asamblare) var newConstatare_Asamblare = req.body.constatare_asamblare;
            if (req.body.operatiuni_efectuate) var newOperatiuni_Efectuate = req.body.operatiuni_efectuate;
            if (req.body.piese_inlocuite) var newPiese_Inlocuite = req.body.piese_inlocuite;
            if (req.body.cod_componente) var newCod_Componente = req.body.cod_componente;
            if (req.body.cost_recarcasare) var newCost_Recarcasare = req.body.cost_recarcasare;
            if (req.body.executant_recarcasare) var newExecutant_Recarcasare = req.body.executant_recarcasare;
            if (req.body.executant_reparatie) var newExecutant_Reparatie = req.body.executant_reparatie;
            if (req.body.taxa_constatare) var newTaxa_Constatare = req.body.taxa_constatare;
            if (req.body.taxa_urgenta) var newTaxa_Urgenta = req.body.taxa_urgenta;
            if (req.body.garantie_asamblare) var newGarantie_Asamblare = req.body.garantie_asamblare;
            if (req.body.finalizat_recarcasare) var newFinalizat_Recarcasare = new moment().format('DD/MM/YYYY');


            //      1.Cabinet ----------------------------------------------
            if (newIesit_Cabinet) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (recarcasare.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta recarcasare.' });
                    } else {

                        if (!recarcasare || recarcasare.iesit_cabinet !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.iesit_cabinet = newIesit_Cabinet;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newIntrat_Cabinet) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (recarcasare.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta recarcasare.' });
                    } else {

                        if (!recarcasare || recarcasare.intrat_cabinet !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.intrat_cabinet = newIntrat_Cabinet;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newPredat_Pacient) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (recarcasare.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta recarcasare.' });
                    } else {

                        if (!recarcasare || recarcasare.predat_pacient !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.predat_pacient = newPredat_Pacient;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }


            if (newCompletare_Cabinet) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (recarcasare.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta recarcasare.' });
                    }
                    else {
                        recarcasare.completare_cabinet = newCompletare_Cabinet;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }



            // //      2.Logistic ----------------------------------------------

            if (newLog_Sosit) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!recarcasare || recarcasare.log_sosit !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.log_sosit = newLog_Sosit;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Plecat) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!recarcasare || recarcasare.log_plecat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.log_plecat = newLog_Plecat;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Preluat) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!recarcasare || recarcasare.log_preluat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.log_preluat = newLog_Preluat;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Trimis) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!recarcasare || recarcasare.log_trimis !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.log_trimis = newLog_Trimis;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            // //      3.Asamblare ----------------------------------------------

            if (newFinalizat_Recarcasare) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    } else {

                        if (!recarcasare || recarcasare.finalizat_recarcasare !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.finalizat_recarcasare = newFinalizat_Recarcasare;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newAsamblare_Plecat) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    } else {

                        if (!recarcasare || recarcasare.asamblare_plecat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.asamblare_plecat = newAsamblare_Plecat;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newAsamblare_Sosit) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    } else {

                        if (!recarcasare || recarcasare.asamblare_sosit !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.asamblare_sosit = newAsamblare_Sosit;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newConstatare_Asamblare) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.constatare_asamblare = newConstatare_Asamblare;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newOperatiuni_Efectuate) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.operatiuni_efectuate = newOperatiuni_Efectuate;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newPiese_Inlocuite) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.piese_inlocuite = newPiese_Inlocuite;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newCod_Componente) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.cod_componente = newCod_Componente;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newCost_Recarcasare) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.cost_recarcasare = newCost_Recarcasare;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newExecutant_Recarcasare) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    } else {
                        if (!recarcasare || recarcasare.executant_recarcasare !== '-') {
                            res.json({ success: false, message: 'Executant Reparatie a fost deja adaugat, modificarile nu sunt salvate' });
                        }
                        else {
                            recarcasare.executant_recarcasare = newExecutant_Recarcasare;
                            recarcasare.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Completare adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }




            if (newExecutant_Reparatie) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.executant_reparatie = newExecutant_Reparatie;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newObservatii_Asamblare) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.observatii_asamblare = newObservatii_Asamblare;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (Observatii_recarcasare_Intern) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.observatii_recarcasare_intern = Observatii_recarcasare_Intern;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newTaxa_Constatare) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.taxa_constatare = newTaxa_Constatare;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newGarantie_Asamblare) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.garantie_asamblare = newGarantie_Asamblare;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newTaxa_Urgenta) {
                Recarcasare.findOne({ _id: editRecarcasare }, function (err, recarcasare) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        recarcasare.taxa_urgenta = newTaxa_Urgenta;
                        recarcasare.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

        });

    });



    // Update Oliva 
    //--------------------------------------------------------------------------------

    router.put('/editOliva', function (req, res) {
        var editOliva = req.body._id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;

            //      Cabinet 
            //-----------------------------------------------------------------------------------
            if (req.body.completare_cabinet) var newCompletare_Cabinet = req.body.completare_cabinet;
            if (req.body.iesit_cabinet) var newIesit_Cabinet = new moment().format('DD/MM/YYYY');
            if (req.body.intrat_cabinet) var newIntrat_Cabinet = new moment().format('DD/MM/YYYY');
            if (req.body.predat_pacient) var newPredat_Pacient = new moment().format('DD/MM/YYYY');

            //      Logistic 
            //-----------------------------------------------------------------------------------

            if (req.body.log_sosit) var newLog_Sosit = new moment().format('DD/MM/YYYY');
            if (req.body.log_plecat) var newLog_Plecat = new moment().format('DD/MM/YYYY');
            if (req.body.log_preluat) var newLog_Preluat = new moment().format('DD/MM/YYYY');
            if (req.body.log_trimis) var newLog_Trimis = new moment().format('DD/MM/YYYY');

            //      Plastie
            //-----------------------------------------------------------------------------------

            if (req.body.plastie_sosit) var newPlastie_Sosit = new moment().format('DD/MM/YYYY');
            if (req.body.plastie_plecat) var newPlastie_Plecat = new moment().format('DD/MM/YYYY');
            if (req.body.observatii_plastie) var newObservatii_Plastie = req.body.observatii_plastie;
            if (req.body.taxa_urgenta) var newTaxa_Urgenta = req.body.taxa_urgenta;
            if (req.body.finalizat_oliva) var newFinalizat_Oliva = new moment().format('DD/MM/YYYY');
            if (req.body.executant_oliva) var newExecutant_Oliva = req.body.executant_oliva;


            //      1.Cabinet ----------------------------------------------
            if (newIesit_Cabinet) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (oliva.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    } else {

                        if (!oliva || oliva.iesit_cabinet !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.iesit_cabinet = newIesit_Cabinet;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newIntrat_Cabinet) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (oliva.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    } else {

                        if (!oliva || oliva.intrat_cabinet !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.intrat_cabinet = newIntrat_Cabinet;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newPredat_Pacient) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (oliva.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat acest service.' });
                    } else {

                        if (!oliva || oliva.predat_pacient !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.predat_pacient = newPredat_Pacient;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newCompletare_Cabinet) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (oliva.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta comanda.' });
                    }
                    else {
                        oliva.completare_cabinet = newCompletare_Cabinet;
                        oliva.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }



            // //      2.Logistic ----------------------------------------------

            if (newLog_Sosit) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!oliva || oliva.log_sosit !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.log_sosit = newLog_Sosit;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Plecat) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!oliva || oliva.log_plecat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.log_plecat = newLog_Plecat;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Preluat) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!oliva || oliva.log_preluat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.log_preluat = newLog_Preluat;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Trimis) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!oliva || oliva.log_trimis !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.log_trimis = newLog_Trimis;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }


            // //      3.Plastie ----------------------------------------------

            if (newFinalizat_Oliva) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'plastie') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Plastie.' });
                    } else {

                        if (!oliva || oliva.finalizat_oliva !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.finalizat_oliva = newFinalizat_Oliva;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newPlastie_Plecat) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'plastie') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Plastie.' });
                    } else {

                        if (!oliva || oliva.plastie_plecat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.plastie_plecat = newPlastie_Plecat;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newPlastie_Sosit) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'plastie') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Plastie.' });
                    } else {

                        if (!oliva || oliva.plastie_sosit !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.plastie_sosit = newPlastie_Sosit;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newObservatii_Plastie) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'plastie') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Plastie.' });
                    }
                    else {
                        oliva.observatii_plastie = newObservatii_Plastie;
                        oliva.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newExecutant_Oliva) {
                Oliva.findOne({ _id: editOliva }, function (err, oliva) {
                    if (err) throw err;
                    if (mainUser.permission !== 'plastie') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Plastie.' });
                    } else {
                        if (!oliva || oliva.executant_oliva !== '-') {
                            res.json({ success: false, message: 'Executant Oliva a fost deja adaugat, modificarile nu sunt salvate' });
                        }
                        else {
                            oliva.executant_oliva = newExecutant_Oliva;
                            oliva.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Executant Oliva adaugat' });
                                }
                            });
                        }
                    }
                });
            }



        });

    });

    // Update ITE 
    //--------------------------------------------------------------------------------

    router.put('/editIte', function (req, res) {
        var editIte = req.body._id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;

            //      Cabinet 
            //-----------------------------------------------------------------------------------
            if (req.body.iesit_cabinet) var newIesit_Cabinet = new moment().format('DD/MM/YYYY');
            if (req.body.intrat_cabinet) var newIntrat_Cabinet = new moment().format('DD/MM/YYYY');
            if (req.body.predat_pacient) var newPredat_Pacient = new moment().format('DD/MM/YYYY');
            if (req.body.completare_cabinet) var newCompletare_Cabinet = req.body.completare_cabinet;

            //      Logistic 
            //-----------------------------------------------------------------------------------

            if (req.body.log_sosit) var newLog_Sosit = new moment().format('DD/MM/YYYY');
            if (req.body.log_plecat) var newLog_Plecat = new moment().format('DD/MM/YYYY');
            if (req.body.log_preluat) var newLog_Preluat = new moment().format('DD/MM/YYYY');
            if (req.body.log_trimis) var newLog_Trimis = new moment().format('DD/MM/YYYY');

            //      Plastie
            //-----------------------------------------------------------------------------------

            if (req.body.asamblare_sosit) var newAsamblare_Sosit = new moment().format('DD/MM/YYYY');
            if (req.body.asamblare_plecat) var newAsamblare_Plecat = new moment().format('DD/MM/YYYY');
            if (req.body.observatii_asamblare) var newObservatii_Asamblare = req.body.observatii_asamblare;
            if (req.body.finalizat_ite) var newFinalizat_Ite = new moment().format('DD/MM/YYYY');
            if (req.body.executant_ite) var newExecutant_Ite = req.body.executant_ite;


            //      1.Cabinet ----------------------------------------------
            if (newIesit_Cabinet) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (ite.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta comanda.' });
                    } else {

                        if (!ite || ite.iesit_cabinet !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.iesit_cabinet = newIesit_Cabinet;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newIntrat_Cabinet) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (ite.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta comanda.' });
                    } else {

                        if (!ite || ite.intrat_cabinet !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.intrat_cabinet = newIntrat_Cabinet;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newPredat_Pacient) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (ite.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta comanda.' });
                    } else {

                        if (!ite || ite.predat_pacient !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.predat_pacient = newPredat_Pacient;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newCompletare_Cabinet) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (ite.cabinet !== mainUser.username) {
                        res.json({ success: false, message: 'Nu esti utilizatorul care a inregistrat aceasta comanda.' });
                    }
                    else {
                        ite.completare_cabinet = newCompletare_Cabinet;
                        ite.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }



            // // //      2.Logistic ----------------------------------------------

            if (newLog_Sosit) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!ite || ite.log_sosit !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.log_sosit = newLog_Sosit;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Plecat) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!ite || ite.log_plecat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.log_plecat = newLog_Plecat;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Preluat) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!ite || ite.log_preluat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.log_preluat = newLog_Preluat;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newLog_Trimis) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'colete') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Logistic.' });
                    } else {

                        if (!ite || ite.log_trimis !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.log_trimis = newLog_Trimis;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }


            // //      3.Asamblare ----------------------------------------------

            if (newFinalizat_Ite) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    } else {

                        if (!ite || ite.finalizat_ite !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.finalizat_ite = newFinalizat_Ite;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newAsamblare_Plecat) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    } else {

                        if (!ite || ite.asamblare_plecat !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.asamblare_plecat = newAsamblare_Plecat;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newAsamblare_Sosit) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    } else {

                        if (!ite || ite.asamblare_sosit !== '-') {
                            res.json({ success: false, message: 'Data a fost deja adaugata, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.asamblare_sosit = newAsamblare_Sosit;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Data adaugata cu succes' });
                                }
                            });
                        }
                    }
                });
            }

            if (newObservatii_Asamblare) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    }
                    else {
                        ite.observatii_asamblare = newObservatii_Asamblare;
                        ite.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: 'Nu s-a putut salva' });
                            } else {
                                res.json({ success: true, message: 'Completare adaugata cu succes' });
                            }
                        });
                    }
                });
            }

            if (newExecutant_Ite) {
                Ite.findOne({ _id: editIte }, function (err, ite) {
                    if (err) throw err;
                    if (mainUser.permission !== 'asamblare') {
                        res.json({ success: false, message: 'Se completeaza de catre Dep. Asamblare.' });
                    } else {
                        if (!ite || ite.executant_ite !== '-') {
                            res.json({ success: false, message: 'Executant ITE a fost deja adaugat, modificarile nu sunt salvate' });
                        }
                        else {
                            ite.executant_ite = newExecutant_Ite;
                            ite.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                } else {
                                    res.json({ success: true, message: 'Executant ITE adaugat' });
                                }
                            });
                        }
                    }
                });
            }



        });

    });


    //      User Delete ----------------------------------------------
    router.delete('/management/:username', function (req, res) {
        var deletedUser = req.params.username;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user was found' });
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'Permisiuni Insuficiente' });
                } else {
                    User.findOneAndRemove({ username: deletedUser }, function (err, user) {
                        if (err) throw err;
                        res.json({ success: true, user: user });
                    });
                }
            }
        });
    });


    //      Get User for Update ----------------------------------------------
    router.get('/edit/:id', function (req, res) {
        var editUser = req.params.id;
        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'Nu s-a gasit Utilizator' });
            } else {
                if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                    User.findOne({ _id: editUser }, function (err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({ success: false, message: 'Nu s-a gasit Utilizator' });
                        } else {
                            res.json({ success: true, user: user });
                        }
                    });
                } else {
                    res.json({ success: false, message: 'Permisiuni Insuficiente' });
                }
            }
        });
    });

    //       User Update ----------------------------------------------
    router.put('/edit', function (req, res) {
        var editUser = req.body._id;
        if (req.body.name) var newName = req.body.name;
        if (req.body.username) var newUsername = req.body.username;
        if (req.body.permission) var newPermission = req.body.permission;

        User.findOne({ username: req.user.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'Nu s-a gasit Utilizator' });
            } else {
                if (newName) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'Nu s-a gasit Utilizator' });
                            } else {
                                user.name = newName;
                                user.save(function (err) {
                                    if (err) {
                                        res.json({ success: false, message: 'Nu s-a putut salva' });
                                    } else {
                                        res.json({ success: true, message: 'Numele a most modificat cu succes!' });
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Permisiuni Insuficiente' });
                    }
                }

                if (newUsername) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'Nu s-a gasit Utilizator' });
                            } else {
                                user.username = newUsername;
                                user.save(function (err) {
                                    if (err) {
                                        res.json({ success: false, message: 'Nu s-a putut salva' });
                                    } else {
                                        res.json({ success: true, message: 'Username a most modificat cu succes!' });
                                    }
                                });
                            }
                        });

                    } else {
                        res.json({ success: false, message: 'Permisiuni Insuficiente' });
                    }
                }

                if (newPermission) {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        User.findOne({ _id: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: 'Nu s-a gasit Utilizator' });
                            } else {
                                if (newPermission === 'user') {
                                    if (user.permission === 'admin') {
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Permisiuni Insuficiente. You must be an admin to downgrade another admin' });
                                        } else {
                                            user.permission = newPermission;
                                            user.save(function (err) {
                                                if (err) {
                                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                                } else {
                                                    res.json({ success: true, message: 'Permisiuni modificate cu succes!' });
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                res.json({ success: false, message: 'Nu s-a putut salva' });
                                            } else {
                                                res.json({ success: true, message: 'Permisiuni modificate cu succes!' });
                                            }
                                        });
                                    }
                                }
                                if (newPermission === 'service' || newPermission === 'asamblare' || newPermission === 'plastie' || newPermission === 'colete') {
                                    if (user.permission === 'admin') {
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Permisiuni Insuficiente. Doar "Admin" poate modifica.' });
                                        } else {
                                            user.permission = newPermission;
                                            user.save(function (err) {
                                                if (err) {
                                                    res.json({ success: false, message: 'Nu s-a putut salva' });
                                                } else {
                                                    res.json({ success: true, message: 'Permisiuni modificate cu succes!' });
                                                }
                                            });
                                        }
                                    } else {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                res.json({ success: false, message: 'Nu s-a putut salva' });
                                            } else {
                                                res.json({ success: true, message: 'Permisiuni modificate cu succes!' });
                                            }
                                        });
                                    }
                                }
                                if (newPermission === 'admin') {
                                    if (mainUser.permission === 'admin') {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                res.json({ success: false, message: 'Nu s-a putut salva' });
                                            } else {
                                                res.json({ success: true, message: 'Permissions have been updated!' });
                                            }
                                        });
                                    } else {
                                        res.json({ success: false, message: 'Permisiuni Insuficiente. Doar "Admin" poate modifica.' });
                                    }
                                }
                            }
                        });

                    } else {
                        res.json({ success: false, message: 'Permisiuni Insuficiente' });
                    }
                }
            }
        });
    });

    return router;

};
