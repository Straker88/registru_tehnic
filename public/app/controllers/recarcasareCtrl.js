angular.module('recarcasareControllers', ['userServices'])

    .controller('regRecarcasareCtrl', function ($route, $routeParams, $http, $location, $timeout, Recarcasare, Pacient, User, $scope) {
        var app = this;
        app.adauga = true;
        app.print = false;

        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');

        this.regRecarcasare = function (regData, valid) {
            app.loading = true;
            app.errorMsg = false;
            app.disabled = false;

            if (valid) {
                Pacient.getPacient($routeParams.id).then(function (data) {
                    var pacient = data.data.pacient.nume;
                    var pacient_id = data.data.pacient._id;
                    var telefon_pacient = data.data.pacient.telefon;
                    Recarcasare.create(app.regData, app.regData.recarcasare_inregistrat_pacient = pacient, app.regData.recarcasare_pacient_id = pacient_id, app.regData.telefon = telefon_pacient).then(function (data) {

                        if (data.data.success) {
                            $scope.comanda_recarcasare = data.data.comanda_recarcasare + 1;
                            app.disabled = true;
                            app.print = true;
                            app.adauga = false;
                            app.successMsg = data.data.message

                            $timeout(function () {
                                window.print();
                            }, 300)

                            $scope.print_recarcasare = function () {
                                window.print();
                            }

                        } else {
                            app.loading = false;
                            app.errorMsg = data.data.message;
                            $timeout(function () {
                                app.errorMsg = false;
                            }, 3000)
                        }
                    });

                })
            } else {
                app.loading = false;
                app.errorMsg = 'Completeaza corect Formularul';

            }

        };

    })

    .controller('registruRecarcasariCabinetCtrl', function ($scope) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.data_estimativa = new moment().add(15, 'days').format('DD/MM/YYYY');
        $scope.data_inregistrare = new moment().format('DD/MM/YYYY');

    })

    .controller('registruRecarcasariCtrl', function ($scope) {
        var app = this;
        app.errorMsg = false;
        app.editPacientAccess = false;
        app.deletePacientAccess = false;
        $scope.finalizat_recarcasare = new moment().format('DD/MM/YYYY');
    })


    .controller('editRecarcasareCtrl', function ($scope, $routeParams, Recarcasare, $timeout, $location) {
        var app = this;
        var eroare = 'Campul trebuie sa contina cel putin 1 carcater.';

        $scope.Back = function () {
            window.history.back();
        };

        Recarcasare.getRecarcasare($routeParams.id).then(function (data) {
            if (data.data.success) {


                //              1.Cabinet ----------------------------------------------
                $scope.newData_Inregistrare = data.data.recarcasare.data_inregistrare;
                $scope.newData_Estimativa = data.data.recarcasare.data_estimativa;
                $scope.newNume = data.data.recarcasare.recarcasare_inregistrat_pacient;
                $scope.newTelefon = data.data.recarcasare.telefon;
                $scope.newDenumire_Aparat = data.data.recarcasare.denumire_aparat;
                $scope.newSerie_Aparat = data.data.recarcasare.serie_aparat;
                $scope.newDefectiune_Reclamata = data.data.recarcasare.defectiune_reclamata;
                $scope.newConstatare_Cabinet = data.data.recarcasare.constatare_cabinet;
                $scope.newCompletare_Cabinet = data.data.recarcasare.completare_cabinet;
                $scope.newU_Stanga = data.data.recarcasare.u_stanga;
                $scope.newU_Dreapta = data.data.recarcasare.u_dreapta;
                $scope.newGarantie = data.data.recarcasare.garantie;
                $scope.newCutie = data.data.recarcasare.cutie;
                $scope.newBaterie = data.data.recarcasare.baterie;
                $scope.newMulaj = data.data.recarcasare.mulaj;
                $scope.newObservatii_Cabinet = data.data.recarcasare.observatii_cabinet;
                $scope.newObservatii_Pacient = data.data.recarcasare.observatii_pacient;
                $scope.Nr_Comanda_Recarcasare = data.data.recarcasare.nr_comanda_recarcasare;
                $scope.newIesit_Cabinet = data.data.recarcasare.iesit_cabinet;
                $scope.newIntrat_Cabinet = data.data.recarcasare.intrat_cabinet;
                $scope.newPredat_Pacient = data.data.recarcasare.predat_pacient;
                $scope.newCabinet = data.data.recarcasare.cabinet;
                $scope.newTaxa_Urgenta_Cabinet = data.data.recarcasare.taxa_urgenta_cabinet;
                currentCabinet = data.data.recarcasare.cabinet;
                app.currentRecarcasare = data.data.recarcasare._id;

                //              2.Logistic ----------------------------------------------
                $scope.newLog_Sosit = data.data.recarcasare.log_sosit;
                $scope.newLog_Plecat = data.data.recarcasare.log_plecat;
                $scope.newLog_Preluat = data.data.recarcasare.log_preluat;
                $scope.newLog_Trimis = data.data.recarcasare.log_trimis;



                //              3.Asamblare ----------------------------------------------
                $scope.newObservatii_Asamblare = data.data.recarcasare.observatii_asamblare;
                $scope.Observatii_recarcasare_Intern = data.data.recarcasare.observatii_recarcasare_intern;
                $scope.newAsamblare_Sosit = data.data.recarcasare.asamblare_sosit;
                $scope.newAsamblare_Plecat = data.data.recarcasare.asamblare_plecat;
                $scope.newFinalizat_Recarcasare = data.data.recarcasare.finalizat_recarcasare;
                $scope.newConstatare_Asamblare = data.data.recarcasare.constatare_asamblare;
                $scope.newOperatiuni_Efectuate = data.data.recarcasare.operatiuni_efectuate;
                $scope.newPiese_Inlocuite = data.data.recarcasare.piese_inlocuite;
                $scope.newCod_Componente = data.data.recarcasare.cod_componente;
                $scope.newCost_Recarcasare = data.data.recarcasare.cost_recarcasare;
                $scope.newExecutant_Recarcasare = data.data.recarcasare.executant_recarcasare;
                $scope.newExecutant_Reparatie = data.data.recarcasare.executant_reparatie;
                $scope.newTaxa_Constatare = data.data.recarcasare.taxa_constatare;
                $scope.newTaxa_Urgenta = data.data.recarcasare.taxa_urgenta;
                $scope.newGarantie_Asamblare = data.data.recarcasare.garantie_asamblare;


                $scope.addExec = function () {
                    $scope.newExecutant_Recarcasare = $scope.exec;

                    var recarcasareObject = {};
                    recarcasareObject._id = app.currentRecarcasare;
                    recarcasareObject.executant_recarcasare = $scope.exec;
                    Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {
                        if (data.data.success) {
                            app.successExecutant_Recarcasare = data.data.message;
                        } else {
                            app.errorMsgExecutant_Recarcasare = data.data.message;
                        }
                        if (recarcasareObject.executant_recarcasare !== "-") {
                            app.errorMsgExecutant_Recarcasare = data.data.message;
                        }


                    });

                };


            } else {
                app.errorMsg = data.data.message;
            }
        });


        // Cabinet 
        //----------------------------------------------------------------------------------------------

        app.updateIesit_Cabinet = function (newIesit_Cabinet, valid) {
            app.errorMsgIesit_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.iesit_cabinet = $scope.newIesit_Cabinet;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgIesit_Cabinet = data.data.message;
                        $timeout(function () {
                            app.iesit_cabinetForm.iesit_cabinet.$setPristine();
                            app.iesit_cabinetForm.iesit_cabinet.$setUntouched();
                            app.successMsgIesit_Cabinet = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgIesit_Cabinet = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgIesit_Cabinet = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgIesit_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateIntrat_Cabinet = function (newIntrat_Cabinet, valid) {
            app.errorMsgIntrat_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.intrat_cabinet = $scope.newIntrat_Cabinet;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgIntrat_Cabinet = data.data.message;
                        $timeout(function () {
                            app.intrat_cabinetForm.intrat_cabinet.$setPristine();
                            app.intrat_cabinetForm.intrat_cabinet.$setUntouched();
                            app.successMsgIntrat_Cabinet = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgIntrat_Cabinet = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgIntrat_Cabinet = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgIesit_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updatePredat_Pacient = function (newPredat_Pacient, valid) {
            app.errorMsgPredat_Pacient = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.predat_pacient = $scope.newPredat_Pacient;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgPredat_Pacient = data.data.message;
                        $timeout(function () {
                            app.predat_pacientForm.predat_pacient.$setPristine();
                            app.predat_pacientForm.predat_pacient.$setUntouched();
                            app.successMsgPredat_Pacient = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgPredat_Pacient = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgPredat_Pacient = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgIesit_Cabinet = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateCompletare_Cabinet = function (newCompletare_Cabinet, valid) {
            app.errorMsgCompletare_Cabinet = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.completare_cabinet = $scope.newCompletare_Cabinet;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgCompletare_Cabinet = data.data.message;

                        $timeout(function () {
                            app.completare_cabinetForm.completare_cabinet.$setPristine();
                            app.completare_cabinetForm.completare_cabinet.$setUntouched();
                            app.successMsgCompletare_Cabinet = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgCompletare_Cabinet = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgCompletare_Cabinet = eroare;
                app.disabled = true;
            }

        };

        // Logistic 
        //----------------------------------------------------------------------------------------------

        app.updateLog_Sosit = function (newLog_Sosit, valid) {
            app.errorMsgLog_Sosit = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.log_sosit = $scope.newLog_Sosit;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgLog_Sosit = data.data.message;
                        $timeout(function () {
                            app.log_sositForm.log_sosit.$setPristine();
                            app.log_sositForm.log_sosit.$setUntouched();
                            app.successMsgLog_Sosit = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgLog_Sosit = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgLog_Sosit = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgLog_Sosit = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateLog_Plecat = function (newLog_Plecat, valid) {
            app.errorMsgLog_Plecat = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.log_plecat = $scope.newLog_Plecat;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgLog_Plecat = data.data.message;
                        $timeout(function () {
                            app.log_plecatForm.log_plecat.$setPristine();
                            app.log_plecatForm.log_plecat.$setUntouched();
                            app.successMsgLog_Plecat = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgLog_Plecat = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgLog_Plecat = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgLog_Plecat = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };


        app.updateLog_Preluat = function (newLog_Preluat, valid) {
            app.errorMsgLog_Preluat = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.log_preluat = $scope.newLog_Preluat;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgLog_Preluat = data.data.message;
                        $timeout(function () {
                            app.log_preluatForm.log_preluat.$setPristine();
                            app.log_preluatForm.log_preluat.$setUntouched();
                            app.successMsgLog_Preluat = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgLog_Preluat = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgLog_Preluat = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgLog_Preluat = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateLog_Trimis = function (newLog_Trimis, valid) {
            app.errorMsgLog_Trimis = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.log_trimis = $scope.newLog_Trimis;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgLog_Trimis = data.data.message;
                        $timeout(function () {
                            app.log_trimisForm.log_trimis.$setPristine();
                            app.log_trimisForm.log_trimis.$setUntouched();
                            app.successMsgLog_Trimis = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgLog_Trimis = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgLog_Trimis = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgLog_Trimis = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };



        // Asamblare.
        //----------------------------------------------------------------------------------------------

        app.updateAsamblare_Sosit = function (newAsamblare_Sosit, valid) {
            app.errorMsgAsamblare_Sosit = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.asamblare_sosit = $scope.newAsamblare_Sosit;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgAsamblare_Sosit = data.data.message;
                        $timeout(function () {
                            app.asamblare_sositForm.asamblare_sosit.$setPristine();
                            app.asamblare_sositForm.asamblare_sosit.$setUntouched();
                            app.successMsgAsamblare_Sosit = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgAsamblare_Sosit = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgAsamblare_Sosit = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgAsamblare_Sosit = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateFinalizat_Recarcasare = function (newFinalizat_Recarcasare, valid) {
            app.errorMsgFinalizat_Recarcasare = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.finalizat_recarcasare = $scope.newFinalizat_Recarcasare;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgFinalizat_Recarcasare = data.data.message;
                        $timeout(function () {
                            app.finalizat_recarcasareForm.finalizat_recarcasare.$setPristine();
                            app.finalizat_recarcasareForm.finalizat_recarcasare.$setUntouched();
                            app.successMsgFinalizat_Recarcasare = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgFinalizat_Recarcasare = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgFinalizat_Recarcasare = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgFinalizat_Recarcasare = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateAsamblare_Plecat = function (newAsamblare_Plecat, valid) {
            app.errorMsgAsamblare_Plecat = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.asamblare_plecat = $scope.newAsamblare_Plecat;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgAsamblare_Plecat = data.data.message;
                        $timeout(function () {
                            app.asamblare_plecatForm.asamblare_plecat.$setPristine();
                            app.asamblare_plecatForm.asamblare_plecat.$setUntouched();
                            app.successMsgAsamblare_Plecat = false;
                            app.disabled = false;
                        }, 1500);

                    } else {
                        app.errorMsgAsamblare_Plecat = data.data.message;
                        app.disabled = true;
                        $timeout(function () {
                            app.errorMsgAsamblare_Plecat = false;
                            app.disabled = false;
                        }, 3000);

                    }
                });
            } else {
                app.errorMsgAsamblare_Plecat = 'Acest camp trebuie completat';
                app.disabled = false;

            }
        };

        app.updateConstatare_Asamblare = function (newConstatare_Asamblare, valid) {
            app.errorMsgConstatare_Asamblare = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.constatare_asamblare = $scope.newConstatare_Asamblare;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgConstatare_Asamblare = data.data.message;

                        $timeout(function () {
                            app.constatare_asamblareForm.constatare_asamblare.$setPristine();
                            app.constatare_asamblareForm.constatare_asamblare.$setUntouched();
                            app.successMsgConstatare_Asamblare = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgConstatare_Asamblare = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgConstatare_Asamblare = eroare;
                app.disabled = true;
            }

        };

        app.updateOperatiuni_Efectuate = function (newOperatiuni_Efectuate, valid) {
            app.errorMsgOperatiuni_Efectuate = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.operatiuni_efectuate = $scope.newOperatiuni_Efectuate;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgOperatiuni_Efectuate = data.data.message;

                        $timeout(function () {
                            app.operatiuni_efectuateForm.operatiuni_efectuate.$setPristine();
                            app.operatiuni_efectuateForm.operatiuni_efectuate.$setUntouched();
                            app.successMsgOperatiuni_Efectuate = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgOperatiuni_Efectuate = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgOperatiuni_Efectuate = eroare;
                app.disabled = true;
            }

        };


        app.updatePiese_Inlocuite = function (newPiese_Inlocuite, valid) {
            app.errorMsgPiese_Inlocuite = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.piese_inlocuite = $scope.newPiese_Inlocuite;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgPiese_Inlocuite = data.data.message;

                        $timeout(function () {
                            app.piese_inlocuiteForm.piese_inlocuite.$setPristine();
                            app.piese_inlocuiteForm.piese_inlocuite.$setUntouched();
                            app.successMsgPiese_Inlocuite = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgPiese_Inlocuite = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgPiese_Inlocuite = eroare;
                app.disabled = true;
            }

        };

        app.updateCod_Componente = function (newCod_Componente, valid) {
            app.errorMsgCod_Componente = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.cod_componente = $scope.newCod_Componente;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgCod_Componente = data.data.message;

                        $timeout(function () {
                            app.cod_componenteForm.cod_componente.$setPristine();
                            app.cod_componenteForm.cod_componente.$setUntouched();
                            app.successMsgCod_Componente = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgCod_Componente = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgCod_Componente = eroare;
                app.disabled = true;
            }

        };

        app.updateCost_Recarcasare = function (newCost_Recarcasare, valid) {
            app.errorMsgCost_Recarcasare = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.cost_recarcasare = $scope.newCost_Recarcasare;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgCost_Recarcasare = data.data.message;

                        $timeout(function () {
                            app.cost_recarcasareForm.cost_recarcasare.$setPristine();
                            app.cost_recarcasareForm.cost_recarcasare.$setUntouched();
                            app.successMsgCost_Recarcasare = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgCost_Recarcasare = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgCost_Recarcasare = eroare;
                app.disabled = true;
            }

        };

        // app.updateExecutant_Recarcasare = function (newExecutant_Recarcasare, valid) {
        //     app.errorMsgExecutant_Recarcasare = false;
        //     app.disabled = false;

        //     if (valid) {
        //         var recarcasareObject = {};
        //         recarcasareObject._id = app.currentRecarcasare;
        //         recarcasareObject.executant_recarcasare = $scope.newExecutant_Recarcasare;

        //         Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

        //             if (data.data.success) {
        //                 app.successMsgExecutant_Recarcasare = data.data.message;

        //                 $timeout(function () {
        //                     app.executant_recarcasareForm.executant_recarcasare.$setPristine();
        //                     app.executant_recarcasareForm.executant_recarcasare.$setUntouched();
        //                     app.successMsgExecutant_Recarcasare = false;
        //                     app.disabled = false;
        //                 }, 700);

        //             } else {
        //                 app.errorMsgExecutant_Recarcasare = data.data.message;
        //                 app.disabled = false;
        //             }
        //         });
        //     } else {
        //         app.errorMsgExecutant_Recarcasare = eroare;
        //         app.disabled = true;
        //     }

        // };
        app.updateExecutant_Reparatie = function (newExecutant_Reparatie, valid) {
            app.errorMsgExecutant_Reparatie = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.executant_reparatie = $scope.newExecutant_Reparatie;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgExecutant_Reparatie = data.data.message;

                        $timeout(function () {
                            app.executant_reparatieForm.executant_reparatie.$setPristine();
                            app.executant_reparatieForm.executant_reparatie.$setUntouched();
                            app.successMsgExecutant_Reparatie = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgExecutant_Reparatie = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgExecutant_Reparatie = eroare;
                app.disabled = true;
            }

        };

        app.updateObservatii_Asamblare = function (newObservatii_Asamblare, valid) {
            app.errorMsgObservatii_Asamblare = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.observatii_asamblare = $scope.newObservatii_Asamblare;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgTaxa_Urgenta = data.data.message;

                        $timeout(function () {
                            app.observatii_asamblareForm.observatii_asamblare.$setPristine();
                            app.observatii_asamblareForm.observatii_asamblare.$setUntouched();
                            app.successMsgTaxa_Urgenta = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgObservatii_Asamblare = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgObservatii_Asamblare = eroare;
                app.disabled = true;
            }

        };

        app.updateObservatii_recarcasare_Intern = function (Observatii_recarcasare_Intern, valid) {
            app.errorMsgObservatii_recarcasare_Intern = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.observatii_recarcasare_intern = $scope.Observatii_recarcasare_Intern;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgObservatii_recarcasare_Intern = data.data.message;

                        $timeout(function () {
                            app.observatii_recarcasare_internForm.observatii_recarcasare_intern.$setPristine();
                            app.observatii_recarcasare_internForm.observatii_recarcasare_intern.$setUntouched();
                            app.successMsgObservatii_recarcasare_Intern = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgObservatii_recarcasare_Intern = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgObservatii_recarcasare_Intern = eroare;
                app.disabled = true;
            }

        };


        app.updateGarantie_Asamblare = function (newGarantie_Asamblare, valid) {
            app.errorMsgGarantie_Asamblare = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.garantie_asamblare = $scope.newGarantie_Asamblare;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgTaxa_Urgenta = data.data.message;

                        $timeout(function () {
                            app.garantie_asamblareForm.garantie_asamblare.$setPristine();
                            app.garantie_asamblareForm.garantie_asamblare.$setUntouched();
                            app.successMsgTaxa_Urgenta = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgGarantie_Asamblare = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgGarantie_Asamblare = eroare;
                app.disabled = true;
            }

        };

        app.updateTaxa_Urgenta = function (newTaxa_Urgenta, valid) {
            app.errorMsgTaxa_Urgenta = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.taxa_urgenta = $scope.newTaxa_Urgenta;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgTaxa_Urgenta = data.data.message;

                        $timeout(function () {
                            app.taxa_urgentaForm.taxa_urgenta.$setPristine();
                            app.taxa_urgentaForm.taxa_urgenta.$setUntouched();
                            app.successMsgTaxa_Urgenta = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgTaxa_Urgenta = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgTaxa_Urgenta = eroare;
                app.disabled = true;
            }

        };

        app.updateTaxa_Constatare = function (newTaxa_Constatare, valid) {
            app.errorMsgTaxa_Constatare = false;
            app.disabled = false;

            if (valid) {
                var recarcasareObject = {};
                recarcasareObject._id = app.currentRecarcasare;
                recarcasareObject.taxa_constatare = $scope.newTaxa_Constatare;

                Recarcasare.editRecarcasare(recarcasareObject).then(function (data) {

                    if (data.data.success) {
                        app.successMsgTaxa_Constatare = data.data.message;

                        $timeout(function () {
                            app.taxa_constatareForm.taxa_constatare.$setPristine();
                            app.taxa_constatareForm.taxa_constatare.$setUntouched();
                            app.successMsgTaxa_Constatare = false;
                            app.disabled = false;
                        }, 700);

                    } else {
                        app.errorMsgTaxa_Constatare = data.data.message;
                        app.disabled = false;
                    }
                });
            } else {
                app.errorMsgTaxa_Constatare = eroare;
                app.disabled = true;
            }

        };

        app.deleteRecarcasare = function () {
            app.errorMsgDeleteRecarcasare = false;
            var deletedRecarcasare = app.currentRecarcasare;

            Recarcasare.deleteRecarcasare(deletedRecarcasare).then(function (data) {
                if (data.data.success) {
                    app.successDeleteRecarcasare = data.data.message;
                    app.disabled = true;
                    $timeout(function () {
                        $location.path('/registruRecarcasari/');
                        app.successDeleteRecarcasare = false;

                    }, 2000);

                } else {
                    app.errorMsgDeleteRecarcasare = data.data.message;
                    $timeout(function () {
                        $location.path('/');
                        app.successDeleteRecarcasare = false;

                    }, 2000);

                }
            });
        };


    });




